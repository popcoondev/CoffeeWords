/**
 * OpenAI APIの実際の統合テスト
 * 
 * このテストは実際のOpenAI APIを呼び出します。
 * .env.testファイルにAPIキーが設定されており、ENABLE_API_TESTS=trueになっている場合のみ実行されます。
 * 
 * 注意: このテストを実行するとAPIクレジットが消費されます。
 */

import { CoffeeResponse, generateCoffeeLanguage } from '../../src/services/openai';
import { getOpenAIApiKey, isApiTestEnabled } from '../utils/loadTestEnv';

// テスト環境変数をロード
const API_KEY = getOpenAIApiKey();
const ENABLE_API_TESTS = isApiTestEnabled();

// APIキーがない場合やテストが有効でない場合はスキップ
const shouldRunTests = ENABLE_API_TESTS && API_KEY && API_KEY.length > 0;

// モックを解除
jest.unmock('../../src/__mocks__/env.ts');
jest.unmock('../../src/services/openai.ts');

// 実際のAPIコールを行うテスト
(shouldRunTests ? describe : describe.skip)('OpenAI API 実際の統合テスト', () => {
  beforeAll(() => {
    // テスト用のAPIキーを設定
    process.env.OPENAI_API_KEY = API_KEY;
    
    // global.fetchのモックを解除
    global.fetch = jest.requireActual('node-fetch');
  });

  // タイムアウトを長めに設定（APIコールに時間がかかる場合があるため）
  jest.setTimeout(30000);

  it('light bodyのコーヒーをAPIで言語化できる', async () => {
    const responses: CoffeeResponse = {
      body: 'light',
      flavor: ['fruity', 'floral'],
      aftertaste: 'short'
    };

    const result = await generateCoffeeLanguage(responses, { useFallback: false });

    // 結果の検証
    expect(result).toBeDefined();
    expect(result.shortDescription).toBeTruthy();
    expect(result.shortDescription.length).toBeGreaterThan(10);
    expect(result.detailedDescription).toBeTruthy();
    expect(result.tags).toBeInstanceOf(Array);
    expect(result.tags.length).toBeGreaterThan(0);
    
    // 軽いボディについての言及があるか確認
    const containsLightReference = 
      result.shortDescription.toLowerCase().includes('軽') || 
      result.detailedDescription.toLowerCase().includes('軽') ||
      result.tags.some(tag => tag.includes('軽'));
      
    expect(containsLightReference).toBe(true);
    
    console.log('API Result:', result);
  });

  it('heavy bodyのコーヒーをAPIで言語化できる', async () => {
    const responses: CoffeeResponse = {
      body: 'heavy',
      flavor: ['chocolate', 'nutty'],
      aftertaste: 'long'
    };

    const result = await generateCoffeeLanguage(responses, { useFallback: false });

    // 結果の検証
    expect(result).toBeDefined();
    expect(result.shortDescription).toBeTruthy();
    expect(result.detailedDescription).toBeTruthy();
    expect(result.tags).toBeInstanceOf(Array);
    
    // 重いボディについての言及があるか確認
    const containsHeavyReference = 
      result.shortDescription.toLowerCase().includes('重') || 
      result.detailedDescription.toLowerCase().includes('重') ||
      result.tags.some(tag => tag.includes('重'));
      
    expect(containsHeavyReference).toBe(true);
    
    console.log('API Result:', result);
  });

  it('エラーケース: 有効でないオプションの場合もAPIが動作する', async () => {
    const responses: CoffeeResponse = {
      body: 'medium',
      // 意図的に無効な値を含める
      flavor: ['invalid_flavor' as any],
      aftertaste: 'medium'
    };

    const result = await generateCoffeeLanguage(responses, { useFallback: false });

    // 結果の検証
    expect(result).toBeDefined();
    expect(result.shortDescription).toBeTruthy();
    expect(result.detailedDescription).toBeTruthy();
    
    console.log('API Result with invalid flavor:', result);
  });

  // テスト完了後の後処理
  afterAll(() => {
    // 環境変数をクリーンアップ
    delete process.env.OPENAI_API_KEY;
  });
});