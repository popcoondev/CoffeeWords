import { useCallback, useState } from 'react';
import { where, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { useAuth } from './useAuth';
import { DictionaryEntry } from '../types';

/**
 * コーヒー辞典管理のためのカスタムフック
 */
export const useDictionary = () => {
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
  } = useFirestore<DictionaryEntry>('dictionaryEntries');

  /**
   * 辞典エントリーの作成
   */
  const createEntry = useCallback(async (
    data: {
      term: string;
      description: string;
      userInterpretation?: string;
      examples?: string[];
    }
  ): Promise<string | null> => {
    if (!user) {
      setError('ログインが必要です');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // 既存のエントリーをチェック
      const existingEntries = await getDocuments([
        where('userId', '==', user.id),
        where('term', '==', data.term)
      ]);

      if (existingEntries.length > 0) {
        setError('この用語は既に登録されています');
        return null;
      }

      // 辞典エントリーデータを作成
      const entryData: Omit<DictionaryEntry, 'id'> = {
        userId: user.id,
        term: data.term,
        description: data.description,
        userInterpretation: data.userInterpretation,
        examples: data.examples || [],
        masteryLevel: 0, // 初期値
      };

      // Firestoreに保存
      const entryId = await addDocument(entryData);
      
      if (!entryId) {
        throw new Error('エントリーの保存に失敗しました');
      }
      
      return entryId;
    } catch (error: any) {
      console.error('Create dictionary entry error:', error);
      setError(error.message || '辞典エントリーの作成に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, getDocuments, addDocument]);

  /**
   * 辞典エントリーの取得
   */
  const getEntry = useCallback(async (entryId: string): Promise<DictionaryEntry | null> => {
    try {
      setLoading(true);
      setError(null);
      return await getDocument(entryId);
    } catch (error: any) {
      console.error('Get dictionary entry error:', error);
      setError('辞典エントリーの取得に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getDocument]);

  /**
   * ユーザーの辞典エントリー一覧を取得
   */
  const getUserEntries = useCallback(async (
    sortBy: 'masteryLevel' | 'term' = 'masteryLevel',
    sortOrder: 'asc' | 'desc' = 'desc', 
    limitCount = 20
  ): Promise<DictionaryEntry[]> => {
    if (!user) {
      setError('ログインが必要です');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      const constraints = [
        where('userId', '==', user.id),
        orderBy(sortBy, sortOrder),
        limit(limitCount)
      ];
      
      return await getDocuments(constraints);
    } catch (error: any) {
      console.error('Get user dictionary entries error:', error);
      setError('辞典エントリー一覧の取得に失敗しました');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, getDocuments]);

  /**
   * 用語で辞典エントリーを検索
   */
  const searchEntries = useCallback(async (searchTerm: string): Promise<DictionaryEntry[]> => {
    if (!user) {
      setError('ログインが必要です');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      // 前方一致での検索（Firestoreの制約上、完全な部分文字列検索はインデックスなしではできない）
      const constraints = [
        where('userId', '==', user.id),
        orderBy('term'),
        // where('term', '>=', searchTerm),
        // where('term', '<=', searchTerm + '\uf8ff'),
      ];
      
      const entries = await getDocuments(constraints);
      
      // クライアント側でフィルタリング（より柔軟な検索のため）
      return entries.filter(entry => 
        entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error: any) {
      console.error('Search dictionary entries error:', error);
      setError('辞典エントリーの検索に失敗しました');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, getDocuments]);

  /**
   * 熟練度レベルの更新
   */
  const updateMasteryLevel = useCallback(async (
    entryId: string, 
    newLevel: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // 0-5の範囲内に制限
      const validLevel = Math.max(0, Math.min(5, newLevel));
      
      return await updateDocument(entryId, { masteryLevel: validLevel });
    } catch (error: any) {
      console.error('Update mastery level error:', error);
      setError('熟練度レベルの更新に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateDocument]);

  /**
   * ユーザーの解釈を更新
   */
  const updateUserInterpretation = useCallback(async (
    entryId: string, 
    interpretation: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await updateDocument(entryId, { userInterpretation: interpretation });
    } catch (error: any) {
      console.error('Update user interpretation error:', error);
      setError('ユーザー解釈の更新に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateDocument]);

  /**
   * 辞典エントリーを削除
   */
  const deleteEntry = useCallback(async (entryId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await deleteDocument(entryId);
    } catch (error: any) {
      console.error('Delete dictionary entry error:', error);
      setError('辞典エントリーの削除に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  }, [deleteDocument]);

  /**
   * 辞典エントリーをリアルタイム購読
   */
  const subscribeToUserEntries = useCallback((
    callback: (entries: DictionaryEntry[]) => void,
    sortBy: 'masteryLevel' | 'term' = 'masteryLevel',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) => {
    if (!user) {
      setError('ログインが必要です');
      return () => {};
    }

    try {
      const constraints = [
        where('userId', '==', user.id),
        orderBy(sortBy, sortOrder),
        limit(20)
      ];
      
      return subscribeToQuery(constraints, callback);
    } catch (error: any) {
      console.error('Subscribe to dictionary entries error:', error);
      setError('リアルタイム更新の設定に失敗しました');
      return () => {};
    }
  }, [user, subscribeToQuery]);

  return {
    // 状態
    loading,
    error,
    
    // 基本操作
    createEntry,
    getEntry,
    getUserEntries,
    searchEntries,
    updateMasteryLevel,
    updateUserInterpretation,
    deleteEntry,
    
    // リアルタイム監視
    subscribeToUserEntries,
  };
};