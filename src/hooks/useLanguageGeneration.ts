import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { 
  CoffeeResponse, 
  LanguageResult, 
  generateCoffeeLanguage, 
  mockGenerateCoffeeLanguage,
  hasApiKey,
  saveApiKey,
  removeApiKey
} from '../services/openai';

// 開発環境ではモックを使うかどうか
const USE_MOCK = __DEV__ && false; // trueにするとモックデータを使用

/**
 * コーヒー言語化機能のカスタムフック
 */
export const useLanguageGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LanguageResult | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  // APIキーの存在確認
  const checkApiKey = useCallback(async () => {
    const exists = await hasApiKey();
    setHasKey(exists);
    return exists;
  }, []);

  // APIキーの設定
  const setupApiKey = useCallback(async (apiKey: string) => {
    try {
      await saveApiKey(apiKey);
      setHasKey(true);
      return true;
    } catch (error) {
      console.error('API key setup error:', error);
      setError('APIキーの設定に失敗しました');
      return false;
    }
  }, []);

  // APIキーの削除
  const clearApiKey = useCallback(async () => {
    try {
      await removeApiKey();
      setHasKey(false);
      return true;
    } catch (error) {
      console.error('API key removal error:', error);
      setError('APIキーの削除に失敗しました');
      return false;
    }
  }, []);

  // 言語化の実行
  const generateLanguage = useCallback(async (responses: CoffeeResponse) => {
    setLoading(true);
    setError(null);
    
    try {
      // APIキーの確認
      const keyExists = await checkApiKey();
      if (!keyExists && !USE_MOCK) {
        setError('OpenAI APIキーが設定されていません');
        setLoading(false);
        return null;
      }
      
      // モックを使うか実際のAPIを使うか
      const languageResult = USE_MOCK 
        ? await mockGenerateCoffeeLanguage(responses)
        : await generateCoffeeLanguage(responses);
      
      setResult(languageResult);
      return languageResult;
    } catch (error: any) {
      console.error('Language generation error:', error);
      setError(error.message || '言語化の生成に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, [checkApiKey]);

  return {
    loading,
    error,
    result,
    hasKey,
    generateLanguage,
    checkApiKey,
    setupApiKey,
    clearApiKey
  };
};