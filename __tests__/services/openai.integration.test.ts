import { 
  CoffeeResponse, 
  generateCoffeeLanguage, 
  mockGenerateCoffeeLanguage,
  saveApiKey,
  hasApiKey,
  removeApiKey
} from '../../src/services/openai';
import * as SecureStore from 'expo-secure-store';

// 統合テスト
describe('OpenAI言語化機能 - 統合テスト', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // 環境をクリーンな状態に戻す
    await removeApiKey().catch(() => {});
  });

  it('完全なフロー: APIキー設定 → 言語化 → 解析', async () => {
    // 1. APIキーを設定
    await saveApiKey('test-api-key');
    const keyExists = await hasApiKey();
    expect(keyExists).toBe(true);

    // 2. 成功するAPIレスポンスをモック
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  shortDescription: "テスト用の説明文",
                  detailedDescription: "詳細なテスト用の説明文です。これは統合テストのためのモックデータです。",
                  tags: ["テスト", "モック", "統合テスト"],
                  recommendations: ["テスト用コーヒー1", "テスト用コーヒー2"]
                })
              }
            }
          ]
        })
      })
    ) as jest.Mock;

    // 3. コーヒーレスポンスを作成
    const responses: CoffeeResponse = {
      body: 'medium',
      flavor: ['chocolate', 'nutty'],
      aftertaste: 'long'
    };

    // 4. 言語化機能を実行
    const result = await generateCoffeeLanguage(responses, { useFallback: false });

    // 5. 結果を検証
    expect(result.shortDescription).toBe("テスト用の説明文");
    expect(result.detailedDescription).toBe("詳細なテスト用の説明文です。これは統合テストのためのモックデータです。");
    expect(result.tags).toEqual(["テスト", "モック", "統合テスト"]);
    expect(result.recommendations).toEqual(["テスト用コーヒー1", "テスト用コーヒー2"]);

    // 6. APIが正しいパラメータで呼び出されたか検証
    expect(fetch).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Authorization': 'Bearer test-api-key'
      }),
      body: expect.stringContaining('"model":"gpt-4o"')
    }));
  });

  it('エラー発生時のフォールバックフロー', async () => {
    // 1. APIキーを設定
    await saveApiKey('test-api-key');

    // 2. APIエラーをモック
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 503,
        json: () => Promise.resolve({
          error: {
            message: 'Service unavailable'
          }
        })
      })
    ) as jest.Mock;

    // 3. コーヒーレスポンスを作成
    const responses: CoffeeResponse = {
      body: 'light',
      flavor: ['fruity', 'floral'],
      aftertaste: 'short'
    };

    // 4. 言語化機能を実行（フォールバック有効）
    const result = await generateCoffeeLanguage(responses);

    // 5. モックデータに対応した結果が返されたことを検証
    expect(result.shortDescription).toContain('明るく爽やか');
    expect(result.tags).toContain('爽やか');
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations?.length).toBeGreaterThan(0);

    // 6. APIは呼び出されたが、エラーが発生したことを確認
    expect(fetch).toHaveBeenCalled();
  });

  it('APIキーなしで直接モックデータを使用', async () => {
    // キーが存在しないことを確認
    const keyExists = await hasApiKey();
    expect(keyExists).toBe(false);

    // モック関数を直接呼び出し
    const responses: CoffeeResponse = {
      body: 'heavy',
      flavor: ['chocolate', 'spicy'],
      aftertaste: 'long'
    };

    const result = await mockGenerateCoffeeLanguage(responses);

    // モックデータの内容を検証
    expect(result.shortDescription).toContain('深いチョコレート');
    expect(result.tags).toEqual(expect.arrayContaining(['チョコレート', '重厚']));
    expect(result.recommendations).toEqual(expect.arrayContaining(['インドネシア マンデリン']));
  });
});