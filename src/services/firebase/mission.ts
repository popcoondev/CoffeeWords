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

// モックミッションデータ生成関数
const getMockActiveMissions = (userId: string, limitCount: number): Mission[] => {
  const now = new Date();
  
  // モックミッションデータ
  const mockMissions: Mission[] = [
    {
      id: 'mock-mission-1',
      userId: userId,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1日前
      expiresAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6日後
      title: '今日のコーヒー探検',
      description: '今日飲んだコーヒーの記録を登録しましょう。定期的な記録は味覚を育てます。',
      difficulty: 'beginner',
      type: 'daily',
      objectives: {
        specificTask: '今日飲んだコーヒーを記録する'
      },
      status: 'active',
      reward: {
        experiencePoints: 5
      },
      relatedCoffeeRecommendations: [],
      helpTips: ['普段飲み慣れているコーヒーでも、じっくり味わうと新しい発見があるかもしれません']
    },
    {
      id: 'mock-mission-2',
      userId: userId,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2日前
      expiresAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5日後
      title: '酸味と甘みのバランスを探す',
      description: '酸味と甘みのバランスが良いコーヒーを見つけて記録しましょう。バランスの取れた味わいは、多くのコーヒー愛好家に親しまれています。',
      difficulty: 'beginner',
      type: 'discovery',
      objectives: {
        targetFlavorCategory: 'acidity',
        specificTask: '酸味と甘みのバランスが取れたコーヒーを探す'
      },
      status: 'active',
      reward: {
        experiencePoints: 10
      },
      relatedCoffeeRecommendations: ['エチオピア イルガチェフェ', 'グアテマラ アンティグア'],
      helpTips: ['浅煎りのコーヒーを探してみましょう', '準備中の豆を確認してみましょう']
    },
    {
      id: 'mock-mission-3',
      userId: userId,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3日前
      expiresAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4日後
      title: 'フルーティーな味わいを比較する',
      description: '異なる産地のフルーティーなコーヒーを2種類飲み比べて、それぞれの違いを記録しましょう。味覚の比較は理解を深めます。',
      difficulty: 'intermediate',
      type: 'comparison',
      objectives: {
        targetFlavorCategory: 'aroma',
        specificTask: 'フルーティーな風味を持つ異なる2種類のコーヒーを比較する'
      },
      status: 'active',
      reward: {
        experiencePoints: 25,
        badgeId: 'taste-explorer'
      },
      relatedCoffeeRecommendations: ['ケニア ニエリ', 'エチオピア シダモ', 'コロンビア ウイラ'],
      helpTips: ['一つは果実のような風味のあるエチオピア産がおすすめです', '時間を空けずに飲み比べると違いが分かりやすいです']
    }
  ];
  
  // limitCount以下の数を返す
  return mockMissions.slice(0, limitCount);
};

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
    
    // モックモードの場合はモックデータを返す
    if ((global as any).__FIREBASE_MOCK_MODE__ === true) {
      console.log('ミッション取得: モックデータを使用');
      return getMockActiveMissions(userId, limitCount);
    }
    
    // アクティブで期限内のミッションを取得
    q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('expiresAt', 'asc'),
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