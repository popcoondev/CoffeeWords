import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { OPENAI_API_KEY } from '@env'; // react-native-dotenv を使用

// CoffeeResponse型の定義（ユーザーの回答）
export interface CoffeeResponse {
  body?: 'light' | 'medium' | 'heavy';
  flavor?: string[];
  aftertaste?: 'short' | 'medium' | 'long';
}

// 言語化結果の型定義
export interface LanguageResult {
  shortDescription: string;     // 短い説明文（1〜2文）
  detailedDescription: string;  // 詳細な説明文
  educationalContent?: string;  // 教育的な内容・学びの要素
  nextStepsSuggestion?: string; // 次に試すべきことの提案
  tags: string[];               // 関連タグ
  recommendations?: string[];   // おすすめのコーヒー豆
  coffeeTrivia?: string;        // コーヒーに関する豆知識
}

// APIキーの保存と取得
const API_KEY_STORAGE_KEY = 'openai_api_key';

/**
 * APIキーを安全に保存
 */
export const saveApiKey = async (apiKey: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, apiKey);
    return;
  } catch (error) {
    console.error('Failed to save API key:', error);
    throw new Error('APIキーの保存に失敗しました');
  }
};

/**
 * 保存されたAPIキーを取得
 */
export const getApiKey = async (): Promise<string | null> => {
  try {
    // まず環境変数から取得を試みる
    if (OPENAI_API_KEY) {
      return OPENAI_API_KEY;
    }
    
    // 環境変数になければSecureStoreから取得
    const apiKey = await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
    return apiKey;
  } catch (error) {
    console.error('Failed to get API key:', error);
    return null;
  }
};

/**
 * APIキーがセットされているか確認
 */
export const hasApiKey = async (): Promise<boolean> => {
  const apiKey = await getApiKey();
  return apiKey !== null && apiKey.length > 0;
};

/**
 * APIキーを削除
 */
export const removeApiKey = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
    return;
  } catch (error) {
    console.error('Failed to remove API key:', error);
    throw new Error('APIキーの削除に失敗しました');
  }
};

/**
 * コーヒーの言語化プロンプトを構築
 */
export const buildCoffeePrompt = (responses: CoffeeResponse): string => {
  // ボディの表現マッピング
  const bodyDescriptions = {
    light: '軽い、繊細な口当たり',
    medium: 'バランスの取れた、ミディアムな口当たり',
    heavy: '重厚で力強い口当たり'
  };

  // 風味の表現マッピング
  const flavorDescriptions = {
    fruity: '果実系（ベリー、柑橘類など）',
    nutty: 'ナッツ系（アーモンド、ヘーゼルナッツなど）',
    chocolate: 'チョコレート系（カカオ、ダークチョなど）',
    floral: '花系（ジャスミン、バラなど）',
    spicy: 'スパイス系（シナモン、ナツメグなど）'
  };

  // 後味の表現マッピング
  const aftertasteDescriptions = {
    short: '短い、すぐに消える余韻',
    medium: '中程度の持続する余韻',
    long: '長く続く余韻'
  };

  // 風味の説明テキストを構築
  let flavorText = '';
  if (responses.flavor && responses.flavor.length > 0) {
    const flavorDescList = responses.flavor.map(f => {
      const description = flavorDescriptions[f as keyof typeof flavorDescriptions];
      return description || f;
    });
    flavorText = flavorDescList.join('、');
  }

  // プロンプトを構築
  return `
あなたはコーヒーの味覚を専門用語で表現するエキスパートです。
以下のコーヒーの特徴を理解し、専門的かつ魅力的な言語で表現してください。

## コーヒーの特徴
- ボディ感: ${responses.body ? bodyDescriptions[responses.body] : '不明'}
- 風味: ${flavorText || '不明'}
- 余韻: ${responses.aftertaste ? aftertasteDescriptions[responses.aftertaste] : '不明'}

## 出力形式（JSON）
{
  "shortDescription": "1〜2文の簡潔な表現",
  "detailedDescription": "3〜5文のより詳細な表現と特徴の解説",
  "educationalContent": "この味わいの特徴、産地、栽培方法などに関する学びの要素（2〜3文）",
  "nextStepsSuggestion": "次に試すべきコーヒーや探求方法についての具体的な提案（2〜3文）",
  "tags": ["関連するタグを5〜8つ"],
  "recommendations": ["この特徴に近い2〜3種類のコーヒー豆の名前や産地"],
  "coffeeTrivia": "このコーヒーに関連する興味深い豆知識や歴史的背景（1〜2文）"
}

出力は必ず上記のJSON形式で、日本語で返してください。
文学的で魅力的な表現を心がけてください。
教育的な要素や次のステップの提案は、ユーザーの成長や発見につながる具体的な内容にしてください。
単なる言語化だけではなく、「だからどうなの？」という問いに応えられる価値のある内容を含めてください。
`;
};

/**
 * OpenAI APIを使用してコーヒーを言語化
 */
/**
 * OpenAI APIを使用してコーヒーを言語化（エラーハンドリングとフォールバック機能を強化）
 */
export const generateCoffeeLanguage = async (
  responses: CoffeeResponse,
  options?: { useFallback?: boolean }
): Promise<LanguageResult> => {
  const { useFallback = true } = options || {};
  
  try {
    const apiKey = await getApiKey();
    
    if (!apiKey) {
      throw new Error('OpenAI APIキーが設定されていません');
    }
    
    const prompt = buildCoffeePrompt(responses);
    
    try {
      // リクエストタイムアウトの設定（20秒）
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",  // 最新のモデルを使用（適宜変更可能）
          messages: [
            {
              role: "system",
              content: "あなたはコーヒーの味覚を専門的に表現できるバリスタです。"
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API エラー: ${response.status}`);
      }
      
      const data = await response.json();
      
      // OpenAI APIからのレスポンスをパース
      try {
        const resultText = data.choices[0].message.content;
        const parsedResult = JSON.parse(resultText);
        
        return {
          shortDescription: parsedResult.shortDescription || '説明を生成できませんでした',
          detailedDescription: parsedResult.detailedDescription || '',
          educationalContent: parsedResult.educationalContent || '',
          nextStepsSuggestion: parsedResult.nextStepsSuggestion || '',
          tags: parsedResult.tags || [],
          recommendations: parsedResult.recommendations || [],
          coffeeTrivia: parsedResult.coffeeTrivia || ''
        };
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError);
        throw new Error('APIレスポンスの解析に失敗しました');
      }
    } catch (error: any) {
      console.error('Error calling OpenAI API:', error);
      
      // フォールバックが有効で、エラーの種類が適切な場合はモックデータを使用
      if (useFallback && (
        error instanceof Error && (
          error.message.includes('API エラー') ||
          error.message.includes('abort') ||
          error.message.includes('timeout') ||
          error.message.includes('network') ||
          error.name === 'AbortError' ||
          error.message.includes('解析に失敗')
        )
      )) {
        console.log('Falling back to mock data due to API error');
        return mockGenerateCoffeeLanguage(responses);
      }
      
      throw error;
    }
  } catch (error: any) {
    // APIキーエラーと予期せぬエラーの場合も、フォールバックが有効ならモックデータを使用
    if (useFallback) {
      console.log('Falling back to mock data due to general error:', error.message);
      return mockGenerateCoffeeLanguage(responses);
    }
    throw error;
  }
};

/**
 * 言語化のモックバージョン（開発・テスト用）
 */
export const mockGenerateCoffeeLanguage = (
  responses: CoffeeResponse
): Promise<LanguageResult> => {
  return new Promise((resolve) => {
    // 1〜2秒の遅延を模擬（実際のAPI呼び出しの感覚）
    setTimeout(() => {
      // ボディに基づいて異なるモック結果を返す
      if (responses.body === 'light') {
        resolve({
          shortDescription: "明るく爽やかな酸味とフローラルな香りが特徴的な軽やかなコーヒー",
          detailedDescription: "柑橘系の爽やかな酸味が口の中で広がり、ジャスミンやオレンジブロッサムを思わせるフローラルな香りが鼻に抜けます。軽やかなボディは紅茶のような繊細さを持ち、クリーンな後味が特徴です。朝の目覚めに最適な、リフレッシュ感のある一杯です。",
          educationalContent: "あなたが感じた爽やかな酸味は、高地で栽培されたアラビカ種コーヒーに特徴的なものです。標高1800m以上の高地では、豆の成長がゆっくりになり、複雑な糖の発達と明るい酸味が生まれます。",
          nextStepsSuggestion: "この軽やかな口当たりをさらに探求するなら、水出しコーヒーを試してみてください。低温抽出により酸味がより繊細になり、フローラルな香りが引き立ちます。また、エチオピアのイェルガチェフェも試す価値があります。",
          tags: ["爽やか", "柑橘系", "フローラル", "軽やか", "クリーン", "明るい酸味", "ティーライク"],
          recommendations: ["エチオピア イルガチェフェ", "ケニア ニエリ", "グアテマラ ウエウエテナンゴ"],
          coffeeTrivia: "フローラルな香りを持つコーヒーはしばしば「ジャスミンコーヒー」と呼ばれ、エチオピア原産の希少な品種に多く見られる特徴です。"
        });
      } else if (responses.body === 'heavy') {
        resolve({
          shortDescription: "深いチョコレートの風味と豊かなコクを持つ重厚なコーヒー",
          detailedDescription: "濃厚なダークチョコレートの風味が口いっぱいに広がり、スパイスやナッツの複雑な香りが重なります。シロップのような滑らかな口当たりと重厚なボディ感が特徴で、長く続く余韻には甘みと微かな燻製香が感じられます。夜のリラックスタイムにぴったりの満足感のある一杯です。",
          educationalContent: "重厚なボディと長い余韻を持つコーヒーは典型的にはインドネシアやブラジルの低地で栽培されます。これらの地域では、豆の細胞壁が厚くなり、油分が多く抽出され、リッチな口当たりになります。深煎りによってこの特徴がさらに増強されます。",
          nextStepsSuggestion: "この重厚な味わいをより楽しむには、エスプレッソまたはモカポットでの抽出がおすすめです。高圧抽出によって油分が効率的に抽出され、よりシロップのような口当たりが得られます。スマトラの伝統的な「ウェット・ハル」製法の豆も試してみてください。",
          tags: ["濃厚", "チョコレート", "重厚", "複雑", "スパイシー", "シロップのような", "長い余韻"],
          recommendations: ["インドネシア マンデリン", "ブラジル セラード", "グアテマラ アンティグア"],
          coffeeTrivia: "インドネシアのスマトラ島では「ウェット・ハル」と呼ばれる特殊な精製方法が用いられ、これが独特のスパイシーさと重厚なボディを生み出します。"
        });
      } else {
        resolve({
          shortDescription: "バランスの取れた甘みと柔らかな酸味が調和したミディアムボディのコーヒー",
          detailedDescription: "キャラメルやブラウンシュガーのような甘みと、りんごを思わせる穏やかな酸味が見事に調和しています。ナッツの風味がアクセントとなり、ミディアムボディは飲みやすさと満足感を両立。後味はクリーンで微かなフルーティーさが残ります。一日中楽しめる、バランスの良い味わいです。",
          educationalContent: "バランスの良いコーヒーはしばしば中米（グアテマラ、コスタリカなど）や南米のコロンビアで見られます。これらの地域は適度な標高と安定した気候条件により、酸味と甘みのバランスが取れた豆が育ちます。中煎りによってこの特性が最大限に引き出されます。",
          nextStepsSuggestion: "あなたの味覚がバランスのとれたプロファイルを好むなら、様々な抽出方法を試してみてください。ペーパードリップでは酸味が、フレンチプレスでは甘みとボディがより強調されます。また、コロンビアの異なる地域（ウイラ、ナリーニョなど）の豆を比較するのも良い学びになります。",
          tags: ["バランス", "キャラメル", "ナッツ", "ミディアムボディ", "まろやか", "甘み", "クリーン"],
          recommendations: ["コロンビア ウイラ", "ホンジュラス サンタバーバラ", "ペルー チャンチャマヨ"],
          coffeeTrivia: "コロンビアは世界で唯一、ほぼ年間を通じてコーヒーを収穫できる国です。これは異なる標高と地域に恵まれているため、一年中どこかで収穫の時期を迎えているのです。"
        });
      }
    }, 1000 + Math.random() * 1000);
  });
};