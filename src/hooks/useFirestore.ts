import { useState, useCallback } from 'react';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  CollectionReference,
  DocumentReference,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../services/firebase';

type FirestoreData<T> = Omit<T, 'id'> & { id?: string };

interface FirestoreHookOptions {
  mapTimestamps?: boolean;
}

/**
 * Firestore操作のためのカスタムフック
 */
export const useFirestore = <T extends DocumentData>(
  collectionName: string,
  options: FirestoreHookOptions = { mapTimestamps: true }
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const collectionRef = collection(db, collectionName) as CollectionReference<T>;

  /**
   * TimestampをDateに変換する
   */
  const convertTimestamps = (data: any): any => {
    if (!options.mapTimestamps) return data;
    
    if (!data) return data;
    
    if (data instanceof Timestamp) {
      return data.toDate();
    }
    
    if (typeof data !== 'object') return data;
    
    if (Array.isArray(data)) {
      return data.map(item => convertTimestamps(item));
    }
    
    const result: any = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value instanceof Timestamp) {
        result[key] = value.toDate();
      } else if (typeof value === 'object' && value !== null) {
        result[key] = convertTimestamps(value);
      } else {
        result[key] = value;
      }
    });
    
    return result;
  };

  /**
   * ドキュメントを取得
   */
  const getDocument = useCallback(async (id: string): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id) as DocumentReference<T>;
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      const data = snapshot.data();
      const convertedData = options.mapTimestamps ? convertTimestamps(data) : data;
      
      return {
        ...convertedData,
        id: snapshot.id
      } as T;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  /**
   * コレクションから複数のドキュメントを取得
   */
  const getDocuments = useCallback(async (
    constraints: QueryConstraint[] = [],
    limitCount?: number
  ): Promise<T[]> => {
    setLoading(true);
    setError(null);
    
    try {
      let queryConstraints = [...constraints];
      
      if (limitCount) {
        queryConstraints.push(limit(limitCount));
      }
      
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const documents = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const convertedData = options.mapTimestamps ? convertTimestamps(data) : data;
        
        return {
          ...convertedData,
          id: doc.id
        } as T;
      });
      
      return documents;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, [collectionName, collectionRef]);

  /**
   * 新しいドキュメントを追加
   */
  const addDocument = useCallback(async (data: FirestoreData<T>): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { id, ...restData } = data as any;
      
      // タイムスタンプフィールドを追加
      const dataWithTimestamps = {
        ...restData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collectionRef, dataWithTimestamps);
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [collectionName, collectionRef]);

  /**
   * IDを指定して新しいドキュメントを作成または上書き
   */
  const setDocument = useCallback(async (id: string, data: FirestoreData<T>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      
      // ID以外のデータを抽出
      const { id: _, ...restData } = data as any;
      
      // タイムスタンプフィールドを追加
      const dataWithTimestamps = {
        ...restData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(docRef, dataWithTimestamps);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  /**
   * ドキュメントを更新
   */
  const updateDocument = useCallback(async (id: string, data: Partial<T>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      
      // IDフィールドを削除
      const { id: _, ...updateData } = data as any;
      
      // 更新タイムスタンプを追加
      const dataWithTimestamp = {
        ...updateData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, dataWithTimestamp);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  /**
   * ドキュメントを削除
   */
  const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  /**
   * リアルタイムでドキュメントを監視
   */
  const subscribeToDocument = useCallback((
    id: string,
    callback: (data: T | null) => void
  ) => {
    const docRef = doc(db, collectionName, id) as DocumentReference<T>;
    
    const unsubscribe = onSnapshot(docRef, 
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          callback(null);
          return;
        }
        
        const data = docSnapshot.data();
        const convertedData = options.mapTimestamps ? convertTimestamps(data) : data;
        
        callback({
          ...convertedData,
          id: docSnapshot.id
        } as T);
      },
      (err) => {
        console.error(`Error subscribing to document ${id}:`, err);
        setError(err);
      }
    );
    
    return unsubscribe;
  }, [collectionName]);

  /**
   * リアルタイムでクエリを監視
   */
  const subscribeToQuery = useCallback((
    constraints: QueryConstraint[] = [],
    callback: (data: T[]) => void
  ) => {
    const q = query(collectionRef, ...constraints);
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const convertedData = options.mapTimestamps ? convertTimestamps(data) : data;
          
          return {
            ...convertedData,
            id: doc.id
          } as T;
        });
        
        callback(documents);
      },
      (err) => {
        console.error('Error subscribing to query:', err);
        setError(err);
      }
    );
    
    return unsubscribe;
  }, [collectionRef]);

  /**
   * ユーティリティ関数
   */
  const utils = {
    where,
    orderBy,
    limit,
    serverTimestamp,
    convertTimestamps
  };

  return {
    // 基本的なCRUD操作
    getDocument,
    getDocuments,
    addDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    
    // リアルタイム監視
    subscribeToDocument,
    subscribeToQuery,
    
    // 状態
    loading,
    error,
    
    // ユーティリティ
    utils
  };
};