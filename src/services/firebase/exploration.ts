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
import { CoffeeExploration, CoffeeInfo, MapPosition, UserPreferences, ComparisonData, DecodeResult } from '../../types';

const COLLECTION_NAME = 'explorations';

/**
 * 新しい探検を作成
 */
export const createExploration = async (
  userId: string,
  coffeeInfo: CoffeeInfo,
  mapPosition: MapPosition,
  preferences: UserPreferences,
  comparison: ComparisonData | null,
  decodeResult: DecodeResult
): Promise<string> => {
  try {
    const explorationData = {
      userId,
      createdAt: serverTimestamp(),
      coffeeInfo,
      tasteMapPosition: mapPosition,
      preferences,
      comparison: comparison || null,
      analysis: decodeResult
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), explorationData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating exploration:', error);
    throw error;
  }
};

/**
 * 特定の探検を取得
 */
export const getExploration = async (explorationId: string): Promise<CoffeeExploration | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, explorationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // サーバーのタイムスタンプをDateオブジェクトに変換
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date();
      
      return {
        id: docSnap.id,
        ...data,
        createdAt
      } as CoffeeExploration;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting exploration:', error);
    throw error;
  }
};

/**
 * ユーザーの探検履歴を取得
 */
export const getUserExplorations = async (
  userId: string, 
  options: { limit?: number, offset?: number } = {}
): Promise<CoffeeExploration[]> => {
  try {
    const { limit: limitCount = 10, offset = 0 } = options;
    
    let q;
    
    if (__DEV__) {
      // 開発環境では最低限のクエリ
      q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        limit(limitCount)
      );
    } else {
      // 本番環境では完全なクエリ
      q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const explorations: CoffeeExploration[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // サーバーのタイムスタンプをDateオブジェクトに変換
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date();
      
      explorations.push({
        id: doc.id,
        ...data,
        createdAt
      } as CoffeeExploration);
    });
    
    return explorations;
  } catch (error) {
    console.error('Error getting user explorations:', error);
    throw error;
  }
};

/**
 * 探検を更新
 */
export const updateExploration = async (
  explorationId: string,
  updates: Partial<CoffeeExploration>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, explorationId);
    
    // サーバーのタイムスタンプを使用するために更新対象から特定のフィールドを除外
    const { id, userId, createdAt, ...updateData } = updates;
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating exploration:', error);
    throw error;
  }
};