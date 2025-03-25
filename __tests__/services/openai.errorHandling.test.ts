import { CoffeeResponse, generateCoffeeLanguage, mockGenerateCoffeeLanguage } from '../../src/services/openai';
import * as SecureStore from 'expo-secure-store';

// APIキーが設定されていない場合のテスト
describe('generateCoffeeLanguage - エラーハンドリングテスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('APIキーが設定されていない場合にエラーをスローする', async () => {
    // APIキーが取得できないようにモック
    jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue(null);
    
    // 環境変数のAPIキーも空に設定
    jest.mock('@env', () => ({
      OPENAI_API_KEY: ''
    }));

    const responses: CoffeeResponse = {
      body: 'medium'
    };

    await expect(generateCoffeeLanguage(responses, { useFallback: false })).rejects.toThrow('OpenAI APIキーが設定されていません');
  });

  it('APIレスポンスがokでない場合にエラーをスローする', async () => {
    // APIキーが取得できるようにモック
    jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue('mock-api-key');

    // APIエラーレスポンスをモック
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
      body: 'medium'
    };

    await expect(generateCoffeeLanguage(responses, { useFallback: false })).rejects.toThrow('OpenAI API エラー: 429');
  });

  it('ネットワークエラーが発生した場合にエラーをスローする', async () => {
    // APIキーが取得できるようにモック
    jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue('mock-api-key');

    // ネットワークエラーをモック
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;

    const responses: CoffeeResponse = {
      body: 'medium'
    };

    await expect(generateCoffeeLanguage(responses, { useFallback: false })).rejects.toThrow('Network error');
  });
});

describe('mockGenerateCoffeeLanguage - フォールバックテスト', () => {
  it('light bodyの場合に適切なモックデータを返す', async () => {
    const responses: CoffeeResponse = {
      body: 'light'
    };

    const result = await mockGenerateCoffeeLanguage(responses);

    expect(result.shortDescription).toContain('明るく爽やか');
    expect(result.tags).toContain('爽やか');
    expect(result.recommendations).toContain('エチオピア イルガチェフェ');
  });

  it('heavy bodyの場合に適切なモックデータを返す', async () => {
    const responses: CoffeeResponse = {
      body: 'heavy'
    };

    const result = await mockGenerateCoffeeLanguage(responses);

    expect(result.shortDescription).toContain('深いチョコレート');
    expect(result.tags).toContain('チョコレート');
    expect(result.recommendations).toContain('インドネシア マンデリン');
  });

  it('その他のbodyの場合にデフォルトモックデータを返す', async () => {
    const responses: CoffeeResponse = {
      body: 'medium'
    };

    const result = await mockGenerateCoffeeLanguage(responses);

    expect(result.shortDescription).toContain('バランスの取れた甘み');
    expect(result.tags).toContain('バランス');
    expect(result.recommendations).toContain('コロンビア ウイラ');
  });

  it('bodyが提供されない場合もデフォルトモックデータを返す', async () => {
    const responses: CoffeeResponse = {
      flavor: ['fruity']
    };

    const result = await mockGenerateCoffeeLanguage(responses);

    expect(result.shortDescription).toBeTruthy();
    expect(result.detailedDescription).toBeTruthy();
    expect(result.tags.length).toBeGreaterThan(0);
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations?.length).toBeGreaterThan(0);
  });
});