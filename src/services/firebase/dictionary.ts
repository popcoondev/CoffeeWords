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
    
    // 開発環境ではモックデータを返す
    if (__DEV__) {
      console.log('開発環境: 辞書モックデータを使用');
      return getMockDictionaryTerms();
    }
    
    let q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      limit(limitCount)
    );
    
    // 本番環境のみで高度なクエリを追加（開発環境ではエラーになる可能性があるため）
    if (!__DEV__) {
      q = query(q, orderBy('updatedAt', 'desc'));
      
      if (category) {
        q = query(q, where('category', '==', category));
      }
      
      if (status) {
        q = query(q, where('explorationStatus', '==', status));
      }
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

/**
 * モック辞書用語データを生成
 */
const getMockDictionaryTerms = (): DictionaryTerm[] => {
  const now = new Date();
  
  // モックの辞書用語データ
  return [
    {
      id: 'mock-term-1',
      userId: 'mock-user',
      createdAt: now,
      updatedAt: now,
      term: 'アシディティ',
      category: 'acidity',
      professionalDefinition: 'コーヒーに含まれる有機酸によって感じられる酸味や爽やかさのこと。柑橘系やベリー系の風味として感じられることが多い。',
      personalInterpretation: 'さわやかなレモンやリンゴを思わせる、口の中がぱっと明るくなるような感じ',
      masteryLevel: 4,
      discoveryCount: 5,
      lastEncounteredAt: now,
      firstDiscoveredAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      relatedCoffeeIds: ['coffee-1', 'coffee-2'],
      relatedTerms: ['明るさ', '柑橘系'],
      examples: ['エチオピア イルガチェフェ', 'ケニア AA'],
      explorationStatus: 'mastered'
    },
    {
      id: 'mock-term-2',
      userId: 'mock-user',
      createdAt: now,
      updatedAt: now,
      term: 'ボディ',
      category: 'body',
      professionalDefinition: 'コーヒーの口当たりや重さ、密度を指す。薄いものから厚みのあるものまで様々で、コーヒーの粘性や油分の量に関係する。',
      personalInterpretation: 'お茶とコーヒーの違いのような、飲み物の「厚み」や「重さ」の感じ',
      masteryLevel: 3,
      discoveryCount: 3,
      lastEncounteredAt: now,
      firstDiscoveredAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      relatedCoffeeIds: ['coffee-3'],
      relatedTerms: ['マウスフィール', '粘性'],
      examples: ['ブラジル サントス', 'インドネシア マンデリン'],
      explorationStatus: 'learning'
    },
    {
      id: 'mock-term-3',
      userId: 'mock-user',
      createdAt: now,
      updatedAt: now,
      term: 'フルーティ',
      category: 'aroma',
      professionalDefinition: '様々な果実を連想させる香りや風味を持つコーヒーの特徴。特定の果物の名前で表現されることも多い。',
      personalInterpretation: 'ドライフルーツやジャムのような、果物の甘い香りを感じられる特徴',
      masteryLevel: 2,
      discoveryCount: 1,
      lastEncounteredAt: now,
      firstDiscoveredAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      relatedCoffeeIds: [],
      relatedTerms: ['ベリー', 'ストーンフルーツ'],
      examples: ['エチオピア イルガチェフェ'],
      explorationStatus: 'learning'
    },
    {
      id: 'mock-term-4',
      userId: 'mock-user',
      createdAt: now,
      updatedAt: now,
      term: 'クリーンカップ',
      category: 'other',
      professionalDefinition: '欠点や不快な味わいがなく、明確で透明感のある味わいを持つコーヒーを指す。不純物や欠点豆の混入がない高品質なコーヒーに見られる特徴。',
      personalInterpretation: 'すっきりとした澄んだ味わいで、変な臭みや雑味がない感じ',
      masteryLevel: 1,
      discoveryCount: 1,
      lastEncounteredAt: now,
      firstDiscoveredAt: now,
      relatedCoffeeIds: [],
      relatedTerms: ['透明感', '純度'],
      examples: [],
      explorationStatus: 'discovered'
    },
    {
      id: 'mock-term-5',
      userId: 'mock-user',
      createdAt: now,
      updatedAt: now,
      term: 'チョコレート',
      category: 'sweetness',
      professionalDefinition: 'カカオやチョコレートを連想させる風味。ミルクチョコレートのような甘さからダークチョコレートのような苦みまで幅広い。',
      personalInterpretation: 'ホットチョコレートのような香ばしい甘さ',
      masteryLevel: 1,
      discoveryCount: 1,
      lastEncounteredAt: now,
      firstDiscoveredAt: now,
      relatedCoffeeIds: [],
      relatedTerms: ['カカオ', 'ナッツ'],
      examples: [],
      explorationStatus: 'discovered'
    }
  ];
};