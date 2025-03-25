import { useCallback, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { where, orderBy, limit } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { storage, functions } from '../services/firebase';
import { useFirestore } from './useFirestore';
import { useAuth } from './useAuth';
import { CoffeeRecord, AILanguageResponse } from '../types';

/**
 * コーヒー記録管理のためのカスタムフック
 */
export const useCoffeeStorage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Firestoreフックの初期化
  const {
    getDocument,
    getDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    subscribeToDocument,
    subscribeToQuery,
    utils,
  } = useFirestore<CoffeeRecord>('coffeeRecords');

  /**
   * 画像をアップロードしURLを取得
   */
  const uploadImage = useCallback(async (uri: string): Promise<string | null> => {
    if (!user) {
      setError('ログインが必要です');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // URIから画像データを取得
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Storageへの参照を作成
      const storageRef = ref(storage, `coffeeImages/${user.id}/${Date.now()}.jpg`);
      
      // アップロード
      await uploadBytes(storageRef, blob);
      
      // ダウンロードURLを取得
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error: any) {
      console.error('Image upload error:', error);
      setError('画像のアップロードに失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * AI言語化機能の呼び出し
   */
  const generateLanguage = useCallback(async (
    responses: {
      body?: 'light' | 'medium' | 'heavy';
      flavor?: string[];
      aftertaste?: 'short' | 'medium' | 'long';
    }
  ): Promise<AILanguageResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      // Cloud Functionsを呼び出し
      const generateLanguageFn = httpsCallable<
        { responses: typeof responses },
        AILanguageResponse
      >(functions, 'generateCoffeeLanguage');
      
      const result = await generateLanguageFn({ responses });
      return result.data;
    } catch (error: any) {
      console.error('AI language generation error:', error);
      setError('表現の生成に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 新しいコーヒー記録の作成
   */
  const createRecord = useCallback(async (
    data: {
      coffeeInfo: {
        name: string;
        roaster?: string;
        photoURI?: string;
      };
      responses: {
        body?: 'light' | 'medium' | 'heavy';
        flavor?: string[];
        aftertaste?: 'short' | 'medium' | 'long';
      };
    }
  ): Promise<string | null> => {
    if (!user) {
      setError('ログインが必要です');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      let photoURL: string | undefined = undefined;
      
      // 画像がある場合はアップロード
      if (data.coffeeInfo.photoURI) {
        photoURL = await uploadImage(data.coffeeInfo.photoURI);
      }

      // AI言語化を呼び出し
      const aiResult = await generateLanguage(data.responses);
      
      if (!aiResult) {
        throw new Error('表現の生成に失敗しました');
      }

      // 記録データを作成
      const recordData: Omit<CoffeeRecord, 'id'> = {
        userId: user.id,
        coffeeInfo: {
          name: data.coffeeInfo.name,
          roaster: data.coffeeInfo.roaster,
          photoURL
        },
        responses: data.responses,
        languageResult: aiResult.text,
        tags: aiResult.tags || [],
      };

      // Firestoreに保存
      const recordId = await addDocument(recordData);
      
      if (!recordId) {
        throw new Error('記録の保存に失敗しました');
      }
      
      return recordId;
    } catch (error: any) {
      console.error('Create record error:', error);
      setError(error.message || 'コーヒー記録の作成に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, uploadImage, generateLanguage, addDocument]);

  /**
   * コーヒー記録を取得
   */
  const getRecord = useCallback(async (recordId: string): Promise<CoffeeRecord | null> => {
    try {
      setLoading(true);
      setError(null);
      return await getDocument(recordId);
    } catch (error: any) {
      console.error('Get record error:', error);
      setError('コーヒー記録の取得に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getDocument]);

  /**
   * ユーザーのコーヒー記録一覧を取得
   */
  const getUserRecords = useCallback(async (limitCount = 10): Promise<CoffeeRecord[]> => {
    if (!user) {
      setError('ログインが必要です');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      const constraints = [
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      ];
      
      return await getDocuments(constraints);
    } catch (error: any) {
      console.error('Get user records error:', error);
      setError('コーヒー記録一覧の取得に失敗しました');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, getDocuments]);

  /**
   * タグでコーヒー記録を検索
   */
  const searchRecordsByTag = useCallback(async (tag: string, limitCount = 10): Promise<CoffeeRecord[]> => {
    if (!user) {
      setError('ログインが必要です');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      const constraints = [
        where('userId', '==', user.id),
        where('tags', 'array-contains', tag),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      ];
      
      return await getDocuments(constraints);
    } catch (error: any) {
      console.error('Search records by tag error:', error);
      setError('タグ検索に失敗しました');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, getDocuments]);

  /**
   * コーヒー記録をリアルタイム購読
   */
  const subscribeToRecords = useCallback((callback: (records: CoffeeRecord[]) => void) => {
    if (!user) {
      setError('ログインが必要です');
      return () => {};
    }

    try {
      const constraints = [
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(10)
      ];
      
      return subscribeToQuery(constraints, callback);
    } catch (error: any) {
      console.error('Subscribe to records error:', error);
      setError('リアルタイム更新の設定に失敗しました');
      return () => {};
    }
  }, [user, subscribeToQuery]);

  /**
   * コーヒー記録を削除
   */
  const deleteRecord = useCallback(async (recordId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await deleteDocument(recordId);
    } catch (error: any) {
      console.error('Delete record error:', error);
      setError('コーヒー記録の削除に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  }, [deleteDocument]);

  return {
    // 状態
    loading,
    error,
    
    // 基本操作
    createRecord,
    getRecord,
    getUserRecords,
    searchRecordsByTag,
    deleteRecord,
    
    // リアルタイム監視
    subscribeToRecords,
    
    // ユーティリティ
    uploadImage,
    generateLanguage,
  };
};