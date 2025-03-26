import { buildDecodePrompt, buildDictionaryEntryPrompt, buildMissionGenerationPrompt } from './prompts';
import { getApiKey } from '../openai';

// 型定義
export interface DecodeResult {
  professionalDescription: string;
  personalTranslation: string;
  tasteProfile: {
    acidity: number;
    sweetness: number;
    bitterness: number;
    body: number;
    complexity: number;
  };
  preferenceInsight: string;
  discoveredFlavor: {
    name: string;
    category: string;
    description: string;
    rarity: number;
    userInterpretation: string;
  };
  nextExploration: string;
}

export interface DictionaryEntry {
  personalInterpretation: string;
  examples: string[];
  connections: string[];
  personalNotes: string;
}

export interface Mission {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'discovery' | 'comparison' | 'challenge' | 'daily';
  objectives: {
    targetFlavorCategory?: string;
    specificTask: string;
  };
  recommendations: string[];
  helpTips: string[];
}

/**
 * キャッシュ用ユーティリティ関数
 */
// キャッシュキーを生成
function generateCacheKey(prefix: string, input: any): string {
  // 単純なハッシュ関数
  const str = JSON.stringify(input);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `${prefix}_${hash}`;
}

// メモリ内キャッシュ（実際のアプリではAsyncStorageなどを使うべき）
const memoryCache: Record<string, { data: any, expires: number }> = {};

// キャッシュのチェック
async function checkCache(key: string): Promise<any | null> {
  const entry = memoryCache[key];
  if (entry && entry.expires > Date.now()) {
    return entry.data;
  }
  return null;
}

// キャッシュへの保存
async function saveToCache(key: string, data: any, ttlSeconds: number): Promise<void> {
  memoryCache[key] = {
    data,
    expires: Date.now() + ttlSeconds * 1000
  };
}

/**
 * OpenAI APIを使用してコーヒー解読を行う
 * @param userInput - ユーザーの入力データ
 * @return 解読結果
 */
export async function decodeCoffeeTaste(
  userInput: any
): Promise<DecodeResult> {
  try {
    const prompt = buildDecodePrompt(userInput);
    
    // キャッシュチェック
    const cacheKey = generateCacheKey('decode', userInput);
    const cachedResult = await checkCache(cacheKey);
    if (cachedResult) return cachedResult;
    
    // APIリクエスト
    const result = await callOpenAI(prompt);
    
    // JSONパース
    const parsedContent = JSON.parse(result);
    
    // キャッシュに保存
    await saveToCache(cacheKey, parsedContent, 24 * 60 * 60); // 24時間
    
    return parsedContent;
  } catch (error) {
    console.error('Coffee decoding error:', error);
    
    // フォールバック処理
    return generateFallbackResponse(userInput);
  }
}

/**
 * 個人辞書エントリーを生成
 * @param term - 用語
 * @param professionalDefinition - 専門的定義
 * @param relatedRecords - 関連する記録
 * @returns 辞書エントリー
 */
export async function generateDictionaryEntry(
  term: string,
  professionalDefinition: string,
  relatedRecords: any[]
): Promise<DictionaryEntry> {
  try {
    const prompt = buildDictionaryEntryPrompt(term, professionalDefinition, relatedRecords);
    
    // キャッシュチェック
    const cacheKey = generateCacheKey('dictionary', { term, relatedRecords });
    const cachedResult = await checkCache(cacheKey);
    if (cachedResult) return cachedResult;
    
    // APIリクエスト
    const result = await callOpenAI(prompt);
    
    // JSONパース
    const parsedContent = JSON.parse(result);
    
    // キャッシュに保存
    await saveToCache(cacheKey, parsedContent, 7 * 24 * 60 * 60); // 1週間
    
    return parsedContent;
  } catch (error) {
    console.error('Dictionary entry generation error:', error);
    
    // フォールバック
    return {
      personalInterpretation: `「${term}」はあなたにとって特徴的なコーヒーの味わいです。`,
      examples: ["エチオピア イルガチェフェ", "ケニア AA"],
      connections: ["酸味", "フローラル"],
      personalNotes: "もっと探求してみると新しい発見があるかもしれません。"
    };
  }
}

/**
 * 探検ミッションを生成
 * @param userProfile - ユーザープロファイル
 * @param explorationHistory - 探検履歴
 * @returns ミッション
 */
export async function generateMission(
  userProfile: any,
  explorationHistory: any[]
): Promise<Mission> {
  try {
    const prompt = buildMissionGenerationPrompt(userProfile, explorationHistory);
    
    // キャッシュチェック
    const cacheKey = generateCacheKey('mission', { userProfile, historyLength: explorationHistory.length });
    const cachedResult = await checkCache(cacheKey);
    if (cachedResult) return cachedResult;
    
    // APIリクエスト
    const result = await callOpenAI(prompt);
    
    // JSONパース
    const parsedContent = JSON.parse(result);
    
    // キャッシュに保存 (短め)
    await saveToCache(cacheKey, parsedContent, 12 * 60 * 60); // 12時間
    
    return parsedContent;
  } catch (error) {
    console.error('Mission generation error:', error);
    
    // フォールバック
    return {
      title: "新しい酸味を探そう",
      description: "異なるタイプの酸味を持つコーヒーを探索し、その違いを発見しましょう。",
      difficulty: "beginner",
      type: "discovery",
      objectives: {
        targetFlavorCategory: "acidity",
        specificTask: "柑橘系と果実系の酸味の違いを見つける"
      },
      recommendations: ["エチオピア イルガチェフェ", "コロンビア ウイラ"],
      helpTips: ["酸味は舌の側面で感じます", "抽出温度を少し下げると酸味が際立ちます"]
    };
  }
}

/**
 * OpenAI APIを呼び出す共通関数
 * @param prompt - プロンプト
 * @returns レスポンス
 */
async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = await getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません');
  }
  
  // リクエストタイムアウトの設定（20秒）
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "あなたはコーヒーの味覚翻訳と解読の専門家です。"
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
    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * フォールバックレスポンスを生成
 * @param userInput - ユーザー入力
 * @returns フォールバックレスポンス
 */
function generateFallbackResponse(userInput: any): DecodeResult {
  // マップ位置から基本特性を抽出
  const { mapPosition, preferences } = userInput;
  
  // 位置に基づいて基本的な値を算出
  const x = mapPosition?.x || 200;
  const y = mapPosition?.y || 200;
  
  // X軸(0-400)を酸味-苦味(1-5)に変換
  const acidity = Math.max(1, Math.min(5, 6 - (x / 400) * 5));
  const bitterness = Math.max(1, Math.min(5, (x / 400) * 5));
  
  // Y軸(0-400)をボディ(1-5)に変換(上が軽い、下が重い)
  const body = Math.max(1, Math.min(5, (y / 400) * 5));
  
  // ランダムな値
  const sweetness = Math.floor(Math.random() * 3) + 2; // 2-4
  const complexity = Math.floor(Math.random() * 3) + 2; // 2-4
  
  // 好みに基づいたカテゴリとフレーバーを選択
  let category = 'general';
  let flavor = '豊かな風味';
  
  if (acidity > 3.5) {
    category = 'acidity';
    flavor = '明るい酸味';
  } else if (bitterness > 3.5) {
    category = 'bitterness';
    flavor = 'しっかりした苦味';
  } else if (body > 3.5) {
    category = 'body';
    flavor = '重厚なボディ';
  } else if (body < 2.5) {
    category = 'body';
    flavor = '軽やかなボディ';
  }
  
  // 好みの洞察
  let insight = '';
  if (preferences?.overallRating >= 4) {
    if (acidity > 3.5) {
      insight = 'あなたは明るい酸味のあるコーヒーを好む傾向があります。';
    } else if (bitterness > 3.5) {
      insight = 'あなたはしっかりとした苦味のあるコーヒーを好む傾向があります。';
    } else {
      insight = 'あなたはバランスの取れたコーヒーを好む傾向があります。';
    }
  } else {
    insight = 'あなたの好みは多様で、様々なコーヒーを試すことを楽しんでいます。';
  }
  
  return {
    professionalDescription: body > 3 
      ? "重厚なボディと複雑な風味を持つ、深みのあるコーヒーです。" 
      : "軽やかな口当たりと爽やかな風味を持つバランスの良いコーヒーです。",
    personalTranslation: "あなたにとっては「心地よく飲みやすい」コーヒーです。",
    tasteProfile: {
      acidity,
      sweetness,
      bitterness,
      body,
      complexity
    },
    preferenceInsight: insight,
    discoveredFlavor: {
      name: flavor,
      category,
      description: "コーヒーの基本的な特性のひとつです。",
      rarity: Math.floor(Math.random() * 3) + 1, // 1-3
      userInterpretation: "あなたにとっては「好ましい」特性です。"
    },
    nextExploration: "次回は少し違った焙煎度のコーヒーを試してみると、新しい発見があるかもしれません。"
  };
}