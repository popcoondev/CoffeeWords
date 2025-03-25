import { CoffeeResponse, LanguageResult, generateCoffeeLanguage } from '../../src/services/openai';

// モックデータ
const mockApiResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify({
          shortDescription: "バランスの取れた甘みと柔らかな酸味が調和したミディアムボディのコーヒー",
          detailedDescription: "キャラメルやブラウンシュガーのような甘みと、りんごを思わせる穏やかな酸味が見事に調和しています。ナッツの風味がアクセントとなり、ミディアムボディは飲みやすさと満足感を両立。後味はクリーンで微かなフルーティーさが残ります。",
          tags: ["バランス", "キャラメル", "ナッツ", "ミディアムボディ", "まろやか", "甘み", "クリーン"],
          recommendations: ["コロンビア ウイラ", "ホンジュラス サンタバーバラ", "ペルー チャンチャマヨ"]
        })
      }
    }
  ]
};

// fetchをモック化
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockApiResponse)
  })
) as jest.Mock;

// SecureStoreの代わりにAPIキーを直接設定
jest.mock('@env', () => ({
  OPENAI_API_KEY: 'test-api-key'
}));

describe('generateCoffeeLanguage - レスポンス解析テスト', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('正常なAPIレスポンスを適切に解析できる', async () => {
    const responses: CoffeeResponse = {
      body: 'medium',
      flavor: ['nutty', 'chocolate'],
      aftertaste: 'medium'
    };

    const result = await generateCoffeeLanguage(responses);

    expect(result).toEqual({
      shortDescription: "バランスの取れた甘みと柔らかな酸味が調和したミディアムボディのコーヒー",
      detailedDescription: "キャラメルやブラウンシュガーのような甘みと、りんごを思わせる穏やかな酸味が見事に調和しています。ナッツの風味がアクセントとなり、ミディアムボディは飲みやすさと満足感を両立。後味はクリーンで微かなフルーティーさが残ります。",
      tags: ["バランス", "キャラメル", "ナッツ", "ミディアムボディ", "まろやか", "甘み", "クリーン"],
      recommendations: ["コロンビア ウイラ", "ホンジュラス サンタバーバラ", "ペルー チャンチャマヨ"]
    });

    // fetchが正しいパラメータで呼び出されたか検証
    expect(fetch).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', expect.any(Object));
  });

  it('不完全なAPIレスポンスをデフォルト値で補完する', async () => {
    // 不完全なレスポンスをモック
    const incompleteResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              shortDescription: "バランスの取れた味わい",
              // detailedDescriptionを省略
              tags: [] // 空のタグ配列
              // recommendationsを省略
            })
          }
        }
      ]
    };

    // このテストケースだけ異なるレスポンスを返すようにモック
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(incompleteResponse)
      })
    ) as jest.Mock;

    const responses: CoffeeResponse = {
      body: 'medium'
    };

    const result = await generateCoffeeLanguage(responses);

    expect(result.shortDescription).toBe("バランスの取れた味わい");
    expect(result.detailedDescription).toBe(""); // デフォルト値
    expect(result.tags).toEqual([]); // 空配列
    expect(result.recommendations).toEqual([]); // デフォルト値
  });

  it('不正なJSONフォーマットの場合にエラーをスローする', async () => {
    // 不正なJSONをモック
    const invalidJsonResponse = {
      choices: [
        {
          message: {
            content: "This is not a valid JSON string"
          }
        }
      ]
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(invalidJsonResponse)
      })
    ) as jest.Mock;

    const responses: CoffeeResponse = {
      body: 'medium'
    };

    await expect(generateCoffeeLanguage(responses, { useFallback: false })).rejects.toThrow('APIレスポンスの解析に失敗しました');
  });
});