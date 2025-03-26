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
import { DictionaryTerm } from '../../types';

const COLLECTION_NAME = 'dictionary';

/**
 * 新しい辞書用語を作成
 */
export const createDictionaryTerm = async (
  userId: string,
  term: string,
  category: DictionaryTerm['category'],
  professionalDefinition: string,
  personalInterpretation: string,
  examples: string[] = [],
  relatedTerms: string[] = []
): Promise<string> => {
  try {
    const now = new Date();
    
    const termData: Omit<DictionaryTerm, 'id'> = {
      userId,
      createdAt: now,
      updatedAt: now,
      term,
      category,
      professionalDefinition,
      personalInterpretation,
      masteryLevel: 1,
      discoveryCount: 1,
      lastEncounteredAt: now,
      firstDiscoveredAt: now,
      relatedCoffeeIds: [],
      relatedTerms,
      examples,
      explorationStatus: 'discovered'
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...termData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastEncounteredAt: serverTimestamp(),
      firstDiscoveredAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating dictionary term:', error);
    throw error;
  }
};

/**
 * 辞書用語を取得
 */
export const getDictionaryTerm = async (termId: string): Promise<DictionaryTerm | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, termId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // タイムスタンプをDateオブジェクトに変換
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date();
      
      const updatedAt = data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate() 
        : new Date();
        
      const lastEncounteredAt = data.lastEncounteredAt instanceof Timestamp 
        ? data.lastEncounteredAt.toDate() 
        : new Date();
        
      const firstDiscoveredAt = data.firstDiscoveredAt instanceof Timestamp 
        ? data.firstDiscoveredAt.toDate() 
        : new Date();
      
      return {
        id: docSnap.id,
        ...data,
        createdAt,
        updatedAt,
        lastEncounteredAt,
        firstDiscoveredAt
      } as DictionaryTerm;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting dictionary term:', error);
    throw error;
  }
};

/**
 * ユーザーの辞書用語を取得
 */
export const getUserDictionaryTerms = async (
  userId: string,
  options: { 
    category?: DictionaryTerm['category'], 
    status?: DictionaryTerm['explorationStatus'],
    limit?: number
  } = {}
): Promise<DictionaryTerm[]> => {
  try {
    const { category, status, limit: limitCount = 50 } = options;
    
    let q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    if (status) {
      q = query(q, where('explorationStatus', '==', status));
    }
    
    const querySnapshot = await getDocs(q);
    const terms: DictionaryTerm[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // タイムスタンプをDateオブジェクトに変換
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date();
      
      const updatedAt = data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate() 
        : new Date();
        
      const lastEncounteredAt = data.lastEncounteredAt instanceof Timestamp 
        ? data.lastEncounteredAt.toDate() 
        : new Date();
        
      const firstDiscoveredAt = data.firstDiscoveredAt instanceof Timestamp 
        ? data.firstDiscoveredAt.toDate() 
        : new Date();
      
      terms.push({
        id: doc.id,
        ...data,
        createdAt,
        updatedAt,
        lastEncounteredAt,
        firstDiscoveredAt
      } as DictionaryTerm);
    });
    
    return terms;
  } catch (error) {
    console.error('Error getting user dictionary terms:', error);
    throw error;
  }
};

/**
 * 辞書用語を更新
 */
export const updateDictionaryTerm = async (
  termId: string,
  updates: Partial<DictionaryTerm>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, termId);
    
    // サーバーのタイムスタンプを使用するために更新対象から特定のフィールドを除外
    const { id, userId, createdAt, firstDiscoveredAt, ...updateData } = updates;
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
      lastEncounteredAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating dictionary term:', error);
    throw error;
  }
};

/**
 * 用語の発見回数を増やす
 */
export const incrementDiscoveryCount = async (
  termId: string
): Promise<void> => {
  try {
    const termRef = doc(db, COLLECTION_NAME, termId);
    const termSnap = await getDoc(termRef);
    
    if (termSnap.exists()) {
      const currentCount = termSnap.data().discoveryCount || 0;
      
      await updateDoc(termRef, {
        discoveryCount: currentCount + 1,
        lastEncounteredAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error incrementing discovery count:', error);
    throw error;
  }
};