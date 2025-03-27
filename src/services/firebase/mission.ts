import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Mission } from '../../types';

const COLLECTION_NAME = 'missions';

/**
 * 新しいミッションを作成
 */
export const createMission = async (
  userId: string,
  title: string,
  description: string,
  difficulty: Mission['difficulty'],
  type: Mission['type'],
  objectives: Mission['objectives'],
  expiresIn: number = 7 * 24 * 60 * 60 * 1000, // デフォルト1週間
  recommendations: string[] = [],
  tips: string[] = []
): Promise<string> => {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresIn);
    
    const missionData: Omit<Mission, 'id'> = {
      userId,
      createdAt: now,
      expiresAt,
      title,
      description,
      difficulty,
      type,
      objectives,
      status: 'active',
      relatedCoffeeRecommendations: recommendations,
      helpTips: tips,
      reward: {
        experiencePoints: calculateRewardPoints(difficulty),
      }
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...missionData,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt)
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating mission:', error);
    throw error;
  }
};

/**
 * 特定のミッションを取得
 */
export const getMission = async (missionId: string): Promise<Mission | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, missionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // タイムスタンプをDateオブジェクトに変換
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date();
      
      const expiresAt = data.expiresAt instanceof Timestamp 
        ? data.expiresAt.toDate() 
        : new Date();
        
      const completedAt = data.completedAt instanceof Timestamp 
        ? data.completedAt.toDate() 
        : undefined;
      
      return {
        id: docSnap.id,
        ...data,
        createdAt,
        expiresAt,
        completedAt
      } as Mission;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting mission:', error);
    throw error;
  }
};

/**
 * ユーザーのアクティブなミッションを取得
 */
export const getUserActiveMissions = async (
  userId: string,
  options: { limit?: number } = {}
): Promise<Mission[]> => {
  try {
    const { limit: limitCount = 10 } = options;
    
    // 現在の日時
    const now = new Date();
    
    // クエリを作成（開発環境では簡略化）
    let q;
    
    if (__DEV__) {
      // 開発環境では単純にユーザーIDのみでクエリ
      q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        limit(limitCount)
      );
    } else {
      // 本番環境ではアクティブで期限内のミッションを取得
      q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('status', '==', 'active'),
        where('expiresAt', '>=', now),
        orderBy('expiresAt', 'asc'),
        limit(limitCount)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const missions: Mission[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // タイムスタンプをDateオブジェクトに変換
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date();
      
      const expiresAt = data.expiresAt instanceof Timestamp 
        ? data.expiresAt.toDate() 
        : new Date();
      
      missions.push({
        id: doc.id,
        ...data,
        createdAt,
        expiresAt
      } as Mission);
    });
    
    return missions;
  } catch (error) {
    console.error('Error getting user active missions:', error);
    throw error;
  }
};

/**
 * ユーザーの完了したミッションを取得
 */
export const getUserCompletedMissions = async (
  userId: string,
  options: { limit?: number } = {}
): Promise<Mission[]> => {
  try {
    const { limit: limitCount = 10 } = options;
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('status', '==', 'completed'),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const missions: Mission[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // タイムスタンプをDateオブジェクトに変換
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date();
      
      const expiresAt = data.expiresAt instanceof Timestamp 
        ? data.expiresAt.toDate() 
        : new Date();
        
      const completedAt = data.completedAt instanceof Timestamp 
        ? data.completedAt.toDate() 
        : new Date();
      
      missions.push({
        id: doc.id,
        ...data,
        createdAt,
        expiresAt,
        completedAt
      } as Mission);
    });
    
    return missions;
  } catch (error) {
    console.error('Error getting user completed missions:', error);
    throw error;
  }
};

/**
 * ミッションを完了としてマーク
 */
export const completeMission = async (
  missionId: string
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, missionId);
    
    await updateDoc(docRef, {
      status: 'completed',
      completedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error completing mission:', error);
    throw error;
  }
};

/**
 * 難易度に基づいて報酬ポイントを計算
 */
function calculateRewardPoints(difficulty: Mission['difficulty']): number {
  switch (difficulty) {
    case 'beginner':
      return 10;
    case 'intermediate':
      return 25;
    case 'advanced':
      return 50;
    default:
      return 10;
  }
}