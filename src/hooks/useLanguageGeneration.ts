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
      let languageResult;
      try {
        languageResult = USE_MOCK 
          ? await mockGenerateCoffeeLanguage(responses)
          : await generateCoffeeLanguage(responses);
      } catch (apiError) {
        console.error('API call error:', apiError);
        // モックデータで代用
        languageResult = {
          shortDescription: "バランスの取れた味わいと心地よい余韻を持つ魅力的なコーヒー",
          detailedDescription: "適度な酸味と甘みのバランスが絶妙で、滑らかな口当たりが特徴です。香ばしさとフルーティーさが共存し、飲み終わった後も余韻が楽しめます。",
          tags: ["バランス", "スムース", "フルーティー", "華やか", "心地よい"],
          recommendations: ["エチオピア イルガチェフェ", "コロンビア ウイラ"]
        };
      }
      
      setResult(languageResult);
      return languageResult;
    } catch (error: any) {
      console.error('Language generation error:', error);
      setError(error.message || '言語化の生成に失敗しました');
      
      // エラー時はフォールバックのデータを返す
      const fallbackResult = {
        shortDescription: "バランスの取れた味わいを持つコーヒー",
        detailedDescription: "適度な酸味と甘みのバランスが良く、滑らかな口当たりが特徴です。",
        tags: ["バランス", "スムース", "マイルド"],
        recommendations: ["エチオピア イルガチェフェ", "コロンビア ウイラ"]
      };
      setResult(fallbackResult);
      return fallbackResult;
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