import { CoffeeResponse, generateCoffeeLanguage } from '../../src/services/openai';
import * as SecureStore from 'expo-secure-store';

describe('generateCoffeeLanguage - フォールバック機能テスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // APIキーが取得できるようにモック
    jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue('mock-api-key');
  });

  it('APIエラー発生時にフォールバックが有効な場合はモックデータを返す', async () => {
    // APIエラーをモック
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 429,
        json: () => Promise.resolve({
          error: {
            message: 'Rate limit exceeded'
          }
        })
      })
    ) as jest.Mock;

    const responses: CoffeeResponse = {
      body: 'light',
      flavor: ['fruity'],
      aftertaste: 'medium'
    };

    // フォールバック有効でAPIを呼び出し
    const result = await generateCoffeeLanguage(responses);

    // モックデータが返されることを確認
    expect(result.shortDescription).toContain('明るく爽やか');
    expect(fetch).toHaveBeenCalled(); // APIは呼び出されている
  });

  it('APIエラー発生時にフォールバックが無効な場合はエラーをスローする', async () => {
    // APIエラーをモック
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 429,
        json: () => Promise.resolve({
          error: {
            message: 'Rate limit exceeded'
          }
        })
      })
    ) as jest.Mock;

    const responses: CoffeeResponse = {
      body: 'light'
    };

    // フォールバック無効でAPIを呼び出し
    await expect(generateCoffeeLanguage(responses, { useFallback: false }))
      .rejects.toThrow('OpenAI API エラー: 429');
  });

  it('タイムアウト発生時にフォールバックが有効な場合はモックデータを返す', async () => {
    // タイムアウトをシミュレート
    global.fetch = jest.fn(() => {
      // AbortControllerのabortメソッドを呼び出すことで、タイムアウトをシミュレート
      setTimeout(() => {
        const controller = new AbortController();
        controller.abort();
      }, 100);
      
      return new Promise((_, reject) => {
        const error = new Error('The operation was aborted');
        error.name = 'AbortError';
        setTimeout(() => reject(error), 150);
      });
    }) as jest.Mock;

    const responses: CoffeeResponse = {
      body: 'medium'
    };

    const result = await generateCoffeeLanguage(responses);

    // モックデータが返されることを確認
    expect(result.shortDescription).toBeTruthy();
    expect(fetch).toHaveBeenCalled();
  });

  it('JSON解析エラー発生時にフォールバックが有効な場合はモックデータを返す', async () => {
    // 不正なJSONレスポンスをモック
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          choices: [
            {
              message: {
                content: 'This is not a valid JSON'
              }
            }
          ]
        })
      })
    ) as jest.Mock;

    const responses: CoffeeResponse = {
      body: 'heavy'
    };

    const result = await generateCoffeeLanguage(responses);

    // モックデータが返されることを確認
    expect(result.shortDescription).toContain('深いチョコレート');
    expect(fetch).toHaveBeenCalled();
  });

  it('APIキーがない場合にフォールバックが有効な場合はモックデータを返す', async () => {
    // APIキーが取得できないようにモック
    jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValueOnce(null);
    
    const responses: CoffeeResponse = {
      body: 'medium',
      flavor: ['chocolate']
    };

    const result = await generateCoffeeLanguage(responses);

    // モックデータが返されることを確認
    expect(result.shortDescription).toBeTruthy();
    expect(result.tags.length).toBeGreaterThan(0);
    // APIは呼び出されていない
    expect(fetch).not.toHaveBeenCalled();
  });

  it('ネットワークエラー発生時にフォールバックが有効な場合はモックデータを返す', async () => {
    // ネットワークエラーをモック
    global.fetch = jest.fn(() => Promise.reject(new Error('Network request failed'))) as jest.Mock;

    const responses: CoffeeResponse = {
      body: 'light',
      flavor: ['floral'],
      aftertaste: 'short'
    };

    const result = await generateCoffeeLanguage(responses);

    // モックデータが返されることを確認
    expect(result.shortDescription).toBeTruthy();
    expect(result.detailedDescription).toBeTruthy();
    expect(fetch).toHaveBeenCalled();
  });
});