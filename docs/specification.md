# Coffee Words リニューアル仕様書

## コンセプト転換

### 従来コンセプト
「コーヒーの味わいを言語化するトレーニングアプリ」

### 新コンセプト
「あなたの好みの解読と探検ガイド」

---

## 1. 核心的価値の再定義

従来のアプリは「言語化」に焦点を当てていましたが、言語化はあくまで手段であり目的ではありません。新しいアプリは以下の3つの価値に焦点を当てます：

### 1.1 翻訳機能
- 個人の主観的な感覚と専門用語の間の双方向翻訳
- プロの言葉を「あなた語」に、あなたの感覚を「プロの言葉」に変換

### 1.2 自己理解
- 自分の好みのパターン発見と視覚化
- 「あなたは〇〇な特徴を持つコーヒーを好む傾向があります」という洞察

### 1.3 発見・成長
- 好みに基づいた次のコーヒー体験の提案
- 未体験の領域への冒険を促す「探検ガイド」機能

---

## 2. UI/UX再設計方針

### 2.1 言語のシフト
- 「記録する」→「解読する」
- 「言語化する」→「翻訳する」
- 「学ぶ」→「発見する」
- 「トレーニング」→「探検」

### 2.2 メインフロー再構成
1. 「今日の一杯」→「今日の探検」
2. 「コーヒー辞典」→「あなたの翻訳辞書」
3. 「好みプロファイル」→「味わい探検マップ」

---

## 3. 画面別詳細仕様

### 3.1 ホーム画面（今日の探検）

#### 3.1.1 探検ミッション
- **機能**: 毎日または新しいコーヒーごとに探検ミッションを提供
- **表示**: カード形式でミッションの説明と目標を表示
- **例**: 
  - 「今日は『甘み』のニュアンスの違いを探そう」
  - 「前回見つけた『ベリー系』の風味に似た別の特徴を探そう」
- **実装要件**:
  - ユーザーの過去の記録に基づいてミッションを自動生成するアルゴリズム
  - 未経験の風味特性を優先的に提案する仕組み

#### 3.1.2 コーヒー解読入力フロー
- **ステップ1**: 基本情報入力（コーヒー名、焙煎所など）
- **ステップ2**: 味わいマップでの位置づけ
  - 2軸マップUIを実装（縦軸：軽い⇔重い、横軸：酸味⇔苦味）
  - タップした位置に基づいて自動的に基本特性をテキスト表示
- **ステップ3**: 好みベースの質問
  - 「このコーヒーは好きですか？」（5段階評価）
  - 「特に気に入ったポイントは？」（選択肢+自由入力）
  - 「違和感があったポイントは？」（選択肢+自由入力）
- **ステップ4**: 再体験意向
  - 「また飲みたいと思いますか？」（5段階評価）
  - 「どのような場面で飲みたいですか？」（選択肢）
- **ステップ5**: （2回目以降のコーヒーの場合）比較質問
  - 「前回より好きですか？」（3段階：より好き、同じくらい、あまり好きではない）
  - 「前回と比べて特に違いを感じたのは？」（自由入力）

#### 3.1.3 解読結果表示
- **翻訳結果**: ユーザーの感覚入力を専門的な表現に翻訳
  - 例：「あなたの好みを翻訳すると『明るい酸味とミルクチョコレートのような甘みを持つ、軽やかなボディのコーヒー』になります」
- **発見カード**: ユーザーが発見した新しい味わい特性をカード形式で表示
  - 特性名、カテゴリ、説明、レア度を表示
  - 「図鑑に追加」ボタンを設置
- **好みの傾向分析**: 今回の記録から分かる好みの傾向
  - 例：「あなたは高地産のエチオピアコーヒーによく見られる花のような香りを好む傾向があります」
- **次回の探検提案**: 次に試すべきコーヒーのタイプや注目すべき特性の提案

### 3.2 翻訳辞書画面（旧コーヒー辞典）

#### 3.2.1 パーソナル翻訳辞典
- **機能**: ユーザーが経験した味わい用語と、それに対する個人的な感覚の対応付け
- **表示**:
  - 専門用語→個人的解釈の対応表
  - 例：「酸味：あなたにとっては『レモネードのような爽やかさ』」
  - 理解度/経験度に応じたカテゴリ分け
- **機能要件**:
  - 用語をタップすると詳細ページに遷移
  - 検索機能の実装
  - カテゴリ別表示切替

#### 3.2.2 用語詳細ページ
- **表示内容**:
  - 専門的定義
  - あなた流の解釈
  - 発見した日付と関連コーヒー
  - この特性を持つ他のコーヒーの例
  - 関連する他の特性へのリンク
- **インタラクション**:
  - 解釈の編集機能
  - 「次回確認」ボタン（次回のミッションに追加）

#### 3.2.3 専門用語翻訳機能
- **機能**: コーヒーショップやパッケージの説明文を「あなた語」に翻訳
- **使用例**:
  - テキスト入力または写真アップロード
  - 「この説明はあなたにとって〇〇のような味わいを意味します」という翻訳結果

### 3.3 味わい探検マップ（旧好みプロファイル）

#### 3.3.1 視覚的な探検マップ
- **機能**: ユーザーが経験済みの「味わい領域」と未開拓領域を地図形式で表示
- **表示**:
  - インタラクティブなマップUI
  - 経験済み領域は色付き、未経験領域はグレーアウト
  - 特に好きな領域は強調表示
- **インタラクション**:
  - 領域をタップすると詳細情報表示
  - ピンチ操作でズームイン/アウト
  - ドラッグでマップ移動

#### 3.3.2 好みプロファイル
- **機能**: ユーザーの好みの傾向を分析して視覚化
- **表示**:
  - レーダーチャート（酸味、甘み、苦味、ボディなど）
  - 好みの特徴テキスト説明
  - 時系列での好みの変化グラフ
- **インタラクション**:
  - 時期別フィルタリング
  - SNSでの共有機能

#### 3.3.3 次の冒険提案
- **機能**: ユーザーの好みと経験に基づいた次のコーヒー体験の提案
- **表示**:
  - 「あなたの好みに合う未体験の豆」リスト
  - 「あなたの好みを広げる挑戦」提案
  - 近くで購入できるコーヒー豆のリコメンド（オプション）
- **インタラクション**:
  - 提案をブックマーク
  - 「試してみた」ボタン

---

## 4. 技術実装仕様

### 4.1 AIプロンプト再設計

#### 4.1.1 翻訳プロンプト
```javascript
// ユーザー感覚→専門表現の翻訳プロンプト
const translationPrompt = `
あなたはコーヒーの味覚翻訳の専門家です。
ユーザーの主観的な感覚を専門的な表現に、専門的な表現をユーザーの感覚に翻訳してください。

# ユーザーの入力
味わいマップ位置: ${JSON.stringify(mapPosition)}

// services/openai/api.js

/**
 * OpenAI APIを使用してコーヒー解読を行う
 * @param {Object} userInput - ユーザーの入力データ
 * @return {Promise<Object>} 解読結果
 */
export async function decodeCoffeeTaste(userInput) {
  try {
    const prompt = buildDecodePrompt(userInput);
    
    // キャッシュチェック
    const cacheKey = generateCacheKey(userInput);
    const cachedResult = await checkCache(cacheKey);
    if (cachedResult) return cachedResult;
    
    // APIリクエスト
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system', 
            content: 'あなたはコーヒーの味覚翻訳と解読の専門家です。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // JSONパース
    const parsedContent = JSON.parse(content);
    
    // キャッシュに保存
    await saveToCache(cacheKey, parsedContent, 24 * 60 * 60); // 24時間
    
    return parsedContent;
  } catch (error) {
    console.error('Coffee decoding error:', error);
    
    // フォールバック処理
    if (config.ENABLE_FALLBACK) {
      return generateFallbackResponse(userInput);
    }
    
    throw error;
  }
}

/**
 * キャッシュキーを生成
 */
function generateCacheKey(userInput) {
  // ユーザー入力の主要部分からハッシュを生成
  const { mapPosition, preferences } = userInput;
  const inputString = JSON.stringify({
    x: Math.round(mapPosition.x),
    y: Math.round(mapPosition.y),
    rating: preferences.overallRating,
    liked: preferences.likedPoints.sort().join(',')
  });
  
  return 'decode_' + hashString(inputString);
}

/**
 * フォールバックレスポンスを生成
 */
function generateFallbackResponse(userInput) {
  // マップ位置から基本特性を抽出
  const mapCharacteristics = extractMapCharacteristics(userInput.mapPosition);
  const { preferences } = userInput;
  
  // 単純な決定木ベースの応答生成
  let description = '';
  if (mapCharacteristics.body === '軽やかなボディ') {
    description = 'ライトなボディで明るい風味のコーヒーです。';
    if (mapCharacteristics.acidity) {
      description += ' フルーティな酸が特徴的です。';
    } else {
      description += ' やわらかな苦味と爽やかさがバランスよく感じられます。';
    }
  } else if (mapCharacteristics.body === '重厚なボディ') {
    description = '重厚なボディが特徴的なコーヒーです。';
    if (mapCharacteristics.bitterness) {
      description += ' しっかりとした苦味とコクがあります。';
    } else {
      description += ' 深みのある酸とコクが複雑に感じられます。';
    }
  } else {
    description = 'バランスの取れたミディアムボディのコーヒーです。';
    if (mapCharacteristics.acidity) {
      description += ' 適度な酸味があり、飲みやすさが特徴です。';
    } else if (mapCharacteristics.bitterness) {
      description += ' 控えめな苦味と甘みが調和しています。';
    } else {
      description += ' 全体的にバランスがよく、どんな場面でも楽しめます。';
    }
  }
  
  // 好みに基づいた推奨
  let insight = '';
  if (preferences.overallRating >= 4) {
    insight = 'あなたは軽やかでフルーティな風味のコーヒーを好む傾向があります。';
    if (mapCharacteristics.acidity) {
      insight = 'あなたは明るい酸味のあるコーヒーを好む傾向があります。';
    } else if (mapCharacteristics.bitterness) {
      insight = 'あなたはしっかりとした苦味のあるコーヒーを好む傾向があります。';
    }
  }
  
  return {
    professionalDescription: description,
    personalTranslation: "あなたにとっては「心地よく飲みやすい」コーヒーです。",
    tasteProfile: {
      acidity: Math.floor(mapCharacteristics.acidityLevel / 20) + 1,
      sweetness: Math.floor(Math.random() * 3) + 2, // 2-4のランダム値
      bitterness: Math.floor(mapCharacteristics.bitternessLevel / 20) + 1,
      body: Math.floor(mapCharacteristics.bodyLevel / 20) + 1,
      complexity: Math.floor(Math.random() * 3) + 2 // 2-4のランダム値
    },
    preferenceInsight: insight,
    discoveredFlavor: {
      name: preferences.likedPoints[0] || "バランスの良さ",
      category: "general",
      description: "コーヒーの基本的な特性のひとつです。",
      rarity: 1,
      userInterpretation: "あなたにとっては「好ましい」特性です。"
    },
    nextExploration: "次回は少し違った焙煎度のコーヒーを試してみると、新しい発見があるかもしれません。"
  };
}

### 6.2 味わいマップコンポーネント実装

```jsx
// components/TasteMap.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { extractMapCharacteristics } from '../services/openai/prompts';

/**
 * 味わいマップコンポーネント
 * @param {Object} props
 * @param {Object} props.initialPosition - 初期位置 {x, y}
 * @param {Function} props.onPositionChange - 位置変更時のコールバック
 * @returns {React.Component}
 */
const TasteMap = ({ initialPosition, onPositionChange }) => {
  const [position, setPosition] = useState(initialPosition || { x: 200, y: 200 });
  const [characteristics, setCharacteristics] = useState({});
  
  useEffect(() => {
    // 特性の抽出
    const extracted = extractMapCharacteristics(position);
    setCharacteristics(extracted);
    
    // 親コンポーネントへの通知
    if (onPositionChange) {
      onPositionChange(position, extracted);
    }
  }, [position]);
  
  // タップ位置の更新
  const handlePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    
    // マップの境界内に制限
    const newPosition = {
      x: Math.max(0, Math.min(400, locationX)),
      y: Math.max(0, Math.min(400, locationY))
    };
    
    setPosition(newPosition);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>あなたのコーヒーはどの位置？</Text>
      <Text style={styles.subtitle}>タップして位置を示してください</Text>
      
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.map}>
          {/* 軸 */}
          <View style={styles.horizontalAxis} />
          <View style={styles.verticalAxis} />
          
          {/* 軸ラベル */}
          <Text style={[styles.axisLabel, styles.topLabel]}>軽やか</Text>
          <Text style={[styles.axisLabel, styles.bottomLabel]}>重厚</Text>
          <Text style={[styles.axisLabel, styles.leftLabel]}>酸味</Text>
          <Text style={[styles.axisLabel, styles.rightLabel]}>苦味</Text>
          
          {/* 選択マーカー */}
          <View style={[
            styles.marker,
            { left: position.x, top: position.y }
          ]} />
        </View>
      </TouchableWithoutFeedback>
      
      {/* 特性表示 */}
      <View style={styles.characteristics}>
        <Text style={styles.characteristicTitle}>この位置のコーヒー特性:</Text>
        <Text style={styles.characteristicText}>
          {characteristics.body || 'ミディアムボディ'}
          {characteristics.acidity ? `、${characteristics.acidity}` : ''}
          {characteristics.bitterness ? `、${characteristics.bitterness}` : ''}
          が特徴のコーヒーです。
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5A2B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 16,
  },
  map: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#D4A76A',
    borderWidth: 1,
    position: 'relative',
  },
  horizontalAxis: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#D4A76A',
    opacity: 0.5,
    top: '50%',
  },
  verticalAxis: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: '#D4A76A',
    opacity: 0.5,
    left: '50%',
  },
  axisLabel: {
    position: 'absolute',
    fontSize: 12,
    color: '#8B5A2B',
  },
  topLabel: {
    top: 8,
    alignSelf: 'center',
  },
  bottomLabel: {
    bottom: 8,
    alignSelf: 'center',
  },
  leftLabel: {
    left: 8,
    top: '50%',
    transform: [{ translateY: -6 }]
  },
  rightLabel: {
    right: 8,
    top: '50%',
    transform: [{ translateY: -6 }]
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8B5A2B',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  characteristics: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100%',
    borderColor: '#D4A76A',
    borderWidth: 1,
  },
  characteristicTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5A2B',
    marginBottom: 4,
  },
  characteristicText: {
    fontSize: 14,
    color: '#555555',
  }
});

export default TasteMap;
```

### 6.3 発見カードコンポーネント実装

```jsx
// components/DiscoveryCard.jsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

/**
 * 発見カードコンポーネント
 * @param {Object} props
 * @param {Object} props.discovery - 発見データ
 * @param {Function} props.onAddToDictionary - 辞書に追加時のコールバック
 * @param {Function} props.onViewDetail - 詳細表示時のコールバック
 * @returns {React.Component}
 */
const DiscoveryCard = ({ discovery, onAddToDictionary, onViewDetail }) => {
  const { name, category, description, rarity, isFirstDiscovery, userInterpretation } = discovery;
  
  // カテゴリに基づくアイコンとカラーの設定
  const getCategoryMeta = (category) => {
    switch(category) {
      case 'acidity':
        return { icon: '🍋', color: '#FFD700' };
      case 'sweetness':
        return { icon: '🍯', color: '#FFA500' };
      case 'bitterness':
        return { icon: '🍫', color: '#8B4513' };
      case 'body':
        return { icon: '💪', color: '#A0522D' };
      case 'aroma':
        return { icon: '🌸', color: '#FF69B4' };
      case 'aftertaste':
        return { icon: '✨', color: '#9370DB' };
      default:
        return { icon: '☕', color: '#D4A76A' };
    }
  };
  
  const categoryMeta = getCategoryMeta(category);
  
  // レア度に基づく星表示
  const rarityStars = '★'.repeat(rarity) + '☆'.repeat(5 - rarity);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isFirstDiscovery ? '新しい発見！' : '再発見！'}
        </Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { backgroundColor: categoryMeta.color }]}>
          <Text style={styles.icon}>{categoryMeta.icon}</Text>
        </View>
        
        <View style={styles.discoveryInfo}>
          <Text style={styles.discoveryName}>{name}</Text>
          <Text style={styles.discoveryCategory}>{categoryToJapanese(category)}</Text>
          <Text style={styles.discoveryRarity}>レア度: {rarityStars}</Text>
        </View>
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.interpretation}>あなたにとって: {userInterpretation}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onAddToDictionary && onAddToDictionary(discovery)}
        >
          <Text style={styles.buttonText}>辞書に追加</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => onViewDetail && onViewDetail(discovery)}
        >
          <Text style={styles.secondaryButtonText}>詳細を見る</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// カテゴリの日本語表示
const categoryToJapanese = (category) => {
  const map = {
    'acidity': '酸味',
    'sweetness': '甘み',
    'bitterness': '苦味',
    'body': 'ボディ',
    'aroma': '香り',
    'aftertaste': '余韻',
    'general': '基本特性',
  };
  return map[category] || category;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    backgroundColor: '#8B5A2B',
    padding: 12,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 30,
  },
  discoveryInfo: {
    flex: 1,
  },
  discoveryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  discoveryCategory: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  discoveryRarity: {
    fontSize: 12,
    color: '#8B5A2B',
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F5DEB3',
  },
  description: {
    fontSize: 14,
    color: '#1E1E1E',
    marginBottom: 8,
    lineHeight: 20,
  },
  interpretation: {
    fontSize: 14,
    color: '#555555',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F5DEB3',
  },
  button: {
    flex: 1,
    backgroundColor: '#8B5A2B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#8B5A2B',
  },
  secondaryButtonText: {
    color: '#8B5A2B',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DiscoveryCard;
好みレベル: ${preferenceLevel}/5
気に入ったポイント: ${likedPoints}
違和感があったポイント: ${dislikedPoints}
再体験意向: ${wouldDrinkAgain}/5
飲みたいシーン: ${drinkingScene}

# 出力要件
以下の形式でJSON出力してください：
{
  "professionalDescription": "専門的な表現(2-3文)",
  "personalTranslation": "ユーザーにとってどういう意味か",
  "tasteProfile": {
    "acidity": 1-5の数値,
    "sweetness": 1-5の数値,
    "bitterness": 1-5の数値,
    "body": 1-5の数値,
    "complexity": 1-5の数値
  },
  "preferenceInsight": "好みの傾向についての洞察",
  "discoveredFlavor": {
    "name": "発見した特性の名前",
    "category": "カテゴリ",
    "description": "説明",
    "rarity": 1-5の数値,
    "userInterpretation": "ユーザーにとっての意味"
  },
  "nextExploration": "次に試すべきコーヒータイプや特性"
}
`;
```

#### 4.1.2 個人辞書構築プロンプト
```javascript
// 個人辞書エントリー生成プロンプト
const dictionaryEntryPrompt = `
あなたはコーヒーの個人辞書作成の専門家です。
ユーザーの過去の記録に基づいて、特定の味わい用語に対する個人的な解釈を生成してください。

# 用語情報
用語: ${term}
専門的定義: ${professionalDefinition}

# ユーザーの過去の記録
この用語に関連する記録:
${relatedRecords.map(r => `- ${r.description}`).join('\n')}

# 出力要件
以下の形式でJSON出力してください：
{
  "personalInterpretation": "ユーザーにとってのこの用語の意味",
  "examples": ["関連する具体例1", "関連する具体例2"],
  "connections": ["関連する他の用語1", "関連する他の用語2"],
  "personalNotes": "ユーザーのための個人的なメモ案"
}
`;
```

### 4.2 データモデル再設計

#### 4.2.1 コーヒー記録モデル
```typescript
interface CoffeeExploration {
  id: string;
  userId: string;
  createdAt: timestamp;
  // 基本情報
  coffeeInfo: {
    name: string;
    roaster?: string;
    origin?: string;
    photo?: string;
  };
  // マップ位置
  tasteMapPosition: {
    x: number; // 0-400
    y: number; // 0-400
  };
  // 好み評価
  preferences: {
    overallRating: number; // 1-5
    likedPoints: string[];
    likedPointsDetail?: string;
    dislikedPoints?: string[];
    dislikedPointsDetail?: string;
    wouldDrinkAgain: number; // 1-5
    drinkingScene: string[];
  };
  // 比較（2回目以降のみ）
  comparison?: {
    comparedToId: string; // 比較対象の記録ID
    preferenceCompared: 'better' | 'same' | 'worse';
    notedDifferences?: string;
  };
  // AI解析結果
  analysis: {
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
    discoveredFlavor?: {
      id: string;
      name: string;
      category: string;
      description: string;
      rarity: number;
      isFirstDiscovery: boolean;
    };
    nextExploration: string;
  };
}
```

#### 4.2.4 ミッションモデル
```typescript
interface ExplorationMission {
  id: string;
  userId: string;
  createdAt: timestamp;
  expiresAt: timestamp;
  // ミッション基本情報
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'discovery' | 'comparison' | 'challenge' | 'daily';
  // ミッション目標
  objectives: {
    targetFlavorId?: string;
    targetFlavorCategory?: string;
    targetRegionId?: string;
    comparisonCoffeeId?: string;
    specificTask?: string;
  };
  // ミッション状態
  status: 'active' | 'completed' | 'expired';
  completedAt?: timestamp;
  reward?: {
    badgeId?: string;
    experiencePoints: number;
    unlockFeatureId?: string;
  };
  // 関連データ
  relatedCoffeeRecommendations: string[]; // 推奨コーヒーID
  helpTips: string[]; // ヒント
}
```

### 4.3 画面遷移フロー

```
1. スプラッシュ画面
   └→ 2. ログイン/サインアップ（未認証時のみ）
      └→ 3. ホーム画面（今日の探検）
          ├→ 4. コーヒー解読フロー
          │   ├→ 4.1 基本情報入力
          │   ├→ 4.2 味わいマップ配置
          │   ├→ 4.3 好み質問回答
          │   ├→ 4.4 比較質問回答（該当時のみ）
          │   └→ 4.5 解読結果表示
          │       └→ 4.5.1 発見詳細表示
          │           └→ 3. ホーム画面に戻る
          ├→ 5. ミッション詳細
          │   └→ 3. ホーム画面に戻る
          ├→ 6. 翻訳辞書画面
          │   ├→ 6.1 用語検索
          │   ├→ 6.2 カテゴリー表示
          │   └→ 6.3 用語詳細表示
          │       ├→ 6.3.1 用語編集
          │       │   └→ 6.3 用語詳細表示に戻る
          │       └→ 6 翻訳辞書画面に戻る
          └→ 7. 味わい探検マップ画面
              ├→ 7.1 マップ詳細表示
              ├→ 7.2 好みプロファイル詳細
              ├→ 7.3 推奨リスト表示
              │   └→ 7 味わい探検マップ画面に戻る
              └→ 7.4 時系列変化表示
                  └→ 7 味わい探検マップ画面に戻る
```

---

## 5. 実装プラン

### 5.1 フェーズ分け

#### フェーズ1: 基盤構築（1-4週目）
- 新コンセプトに基づくUI/UX設計の完了
- コーヒー解読フローの再構築
- 味わいマップコンポーネントの実装
- AIプロンプトの再設計と実装
- 基本データモデルの再設計

#### フェーズ2: コア機能実装（5-8週目）
- 翻訳辞書機能の実装
- 探検マップの基本実装
- 発見カードと記録機能
- 好みプロファイル分析の実装
- ミッション生成システムの基本実装

#### フェーズ3: 探検体験強化（9-12週目）
- 探検マップの詳細化と視覚的強化
- 発見バッジとレベルアップシステム
- 次回探索推奨エンジンの強化
- ユーザーフィードバックに基づく調整
- パフォーマンス最適化

### 5.2 技術スタック

#### フロントエンド
- React Native (Expo)
- Zustand（状態管理）
- React Navigation
- NativeBase（UIコンポーネント）

#### バックエンド
- Firebase / Supabase
  - Authentication（認証）
  - Firestore / PostgreSQL（データベース）
  - Storage（画像保存）
  - Functions（サーバーレス関数）
- OpenAI API（GPT-3.5-turbo）

#### デザイン
- Figma（UI/UXデザイン）
- カラーパレット：元の仕様書のパレットを継続使用
- アイコン：Material Design + カスタムアイコン

### 5.3 リソース要件

#### 開発者リソース
- フロントエンドエンジニア: 1名
- バックエンド/AIエンジニア: 1名
- UIデザイナー: 1名（パートタイム可）

#### インフラリソース
- Firebase/Supabase: Spark/Hobby プラン（初期）
- OpenAI API: 予測使用量 1000ユーザー×月20回 = 20,000リクエスト/月
- 画像ストレージ: 初期5GB想定

#### 開発環境
- GitHub: プライベートリポジトリ
- CI/CD: GitHub Actions + Expo EAS
- テスト環境: Jest + React Native Testing Library

---

## 6. 具体的な実装指示

### 6.1 AIプロンプト実装

#### 解読プロンプトの実装例
```javascript
// services/openai/prompts.js

/**
 * ユーザー入力から解読プロンプトを生成する
 * @param {Object} userInput - ユーザーの入力データ
 * @return {String} OpenAIに送信するプロンプト
 */
export function buildDecodePrompt(userInput) {
  const {
    mapPosition,
    preferences,
    comparison,
    coffeeInfo
  } = userInput;
  
  // マップ位置から基本特性を抽出
  const mapCharacteristics = extractMapCharacteristics(mapPosition);
  
  return `
    あなたはコーヒーの味覚翻訳と解読の専門家です。
    ユーザーの主観的な感覚入力に基づいて、以下の出力を生成してください。
    
    # ユーザーの入力
    コーヒー情報: ${JSON.stringify(coffeeInfo)}
    味わいマップ位置: ${JSON.stringify(mapCharacteristics)}
    好みレベル: ${preferences.overallRating}/5
    気に入ったポイント: ${preferences.likedPoints.join(', ')}
    ${preferences.likedPointsDetail ? `詳細: ${preferences.likedPointsDetail}` : ''}
    ${preferences.dislikedPoints ? `違和感があったポイント: ${preferences.dislikedPoints.join(', ')}` : ''}
    ${preferences.dislikedPointsDetail ? `詳細: ${preferences.dislikedPointsDetail}` : ''}
    再体験意向: ${preferences.wouldDrinkAgain}/5
    飲みたいシーン: ${preferences.drinkingScene.join(', ')}
    ${comparison ? `前回との比較: ${comparison.preferenceCompared}, 違い: ${comparison.notedDifferences || 'なし'}` : ''}
    
    # 出力要件
    以下の形式でJSON出力してください：
    {
      "professionalDescription": "専門的な表現(2-3文)",
      "personalTranslation": "ユーザーにとってどういう意味か(平易な言葉で)",
      "tasteProfile": {
        "acidity": 1-5の数値,
        "sweetness": 1-5の数値,
        "bitterness": 1-5の数値,
        "body": 1-5の数値,
        "complexity": 1-5の数値
      },
      "preferenceInsight": "好みの傾向についての洞察",
      "discoveredFlavor": {
        "name": "発見した特性の名前",
        "category": "カテゴリ",
        "description": "説明",
        "rarity": 1-5の数値,
        "userInterpretation": "ユーザーにとっての意味"
      },
      "nextExploration": "次に試すべきコーヒータイプや特性"
    }
  `;
}

/**
 * マップ位置から基本特性を抽出する
 * @param {Object} position - x, y座標
 * @return {Object} 抽出された特性
 */
function extractMapCharacteristics(position) {
  const { x, y } = position;
  // マップの中心からの相対位置
  const centerX = 200;
  const centerY = 200;
  const relX = x - centerX; // 正：苦味方向、負：酸味方向
  const relY = centerY - y; // 正：軽い方向、負：重い方向
  
  // 軸に基づく特性の決定
  let acidity = '';
  let bitterness = '';
  let body = '';
  
  // X軸: 左が酸味多い、右が苦味多い
  if (relX < -80) acidity = "鮮明な酸";
  else if (relX < -30) acidity = "明るい酸";
  else if (relX < 30) acidity = "バランスの取れた酸";
  else if (relX < 80) bitterness = "軽い苦味";
  else bitterness = "しっかりした苦味";
  
  // Y軸: 上がライト、下がヘビー
  if (relY > 80) body = "軽やかなボディ";
  else if (relY > 30) body = "すっきりとしたボディ";
  else if (relY > -30) body = "ミディアムボディ";
  else if (relY > -80) body = "しっかりしたボディ";
  else body = "重厚なボディ";
  
  return {
    acidity: acidity || null,
    bitterness: bitterness || null,
    body,
    // 0-100のスケールに変換
    acidityLevel: Math.max(0, Math.min(100, 50 - relX / 2)),
    bitternessLevel: Math.max(0, Math.min(100, 50 + relX / 2)),
    bodyLevel: Math.max(0, Math.min(100, 50 - relY / 2))
  };
}

#### 4.2.2 味わい辞典モデル
```typescript
interface FlavorDictionaryEntry {
  id: string;
  userId: string;
  createdAt: timestamp;
  updatedAt: timestamp;
  // 基本情報
  term: string;
  category: 'acidity' | 'sweetness' | 'bitterness' | 'body' | 'aroma' | 'aftertaste' | 'other';
  // 定義
  professionalDefinition: string;
  personalInterpretation: string;
  // メタデータ
  masteryLevel: number; // 1-5
  discoveryCount: number;
  lastEncounteredAt: timestamp;
  firstDiscoveredAt: timestamp;
  // 関連データ
  relatedCoffeeIds: string[];
  relatedTerms: string[];
  examples: string[];
  personalNotes?: string;
  // 探検状態
  explorationStatus: 'discovered' | 'learning' | 'mastered';
}

#### 4.2.3 探検マップモデル
```typescript
interface TasteExplorationMap {
  id: string;
  userId: string;
  updatedAt: timestamp;
  // マップデータ
  exploredRegions: {
    regionId: string;
    name: string;
    position: {
      x: number;
      y: number;
    };
    size: number;
    explorationLevel: number; // 0-100%
    preferenceLevel: number; // 1-5
    relatedFlavorIds: string[];
    relatedCoffeeIds: string[];
  }[];
  // 好みプロファイル
  preferenceProfile: {
    acidity: number;
    sweetness: number;
    bitterness: number;
    body: number;
    brightness: number;
    complexity: number;
    // 時系列データ
    history: {
      timestamp: timestamp;
      values: {
        acidity: number;
        sweetness: number;
        bitterness: number;
        body: number;
        brightness: number;
        complexity: number;
      };
    }[];
  };
  // 探検進捗
  explorationProgress: {
    discoveredFlavors: number;
    totalFlavorsPossible: number;
    discoveredRegions: number;
    totalRegionsPossible: number;
    currentExplorationRank: string; // 「冒険者」「探検家」など
    nextRankRequirement: string;
  };
  // 冒険推奨
  recommendations: {
    forPreference: {
      coffeeId: string;
      coffeeName: string;
      reason: string;
      matchPercentage: number;
    }[];
    forExploration: {
      flavorId: string;
      flavorName: string;
      reason: string;
      difficultyLevel: number;
    }[];
  };
}
```
export default DiscoveryCard;
```

### 6.4 主要画面実装例

#### 6.4.1 コーヒー解読画面

```jsx
// screens/CoffeeDecodeScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from 'native-base';
import TasteMap from '../components/TasteMap';
import PreferenceQuestions from '../components/PreferenceQuestions';
import { decodeCoffeeTaste } from '../services/openai/api';
import DiscoveryCard from '../components/DiscoveryCard';

const CoffeeDecodeScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { missionId, previousCoffeeId } = route.params || {};
  
  // ステップ管理
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 入力データ
  const [coffeeInfo, setCoffeeInfo] = useState({
    name: '',
    roaster: '',
  });
  
  const [mapPosition, setMapPosition] = useState({ x: 200, y: 200 });
  const [mapCharacteristics, setMapCharacteristics] = useState({});
  
  const [preferences, setPreferences] = useState({
    overallRating: 3,
    likedPoints: [],
    likedPointsDetail: '',
    dislikedPoints: [],
    dislikedPointsDetail: '',
    wouldDrinkAgain: 3,
    drinkingScene: [],
  });
  
  const [comparison, setComparison] = useState(
    previousCoffeeId ? {
      comparedToId: previousCoffeeId,
      preferenceCompared: 'same',
      notedDifferences: '',
    } : null
  );
  
  // 解読結果
  const [decodeResult, setDecodeResult] = useState(null);
  
  // マップ位置が変更された時
  const handleMapPositionChange = (position, characteristics) => {
    setMapPosition(position);
    setMapCharacteristics(characteristics);
  };
  
  // 好み質問の回答が変更された時
  const handlePreferenceChange = (newPreferences) => {
    setPreferences({ ...preferences, ...newPreferences });
  };
  
  // 比較質問の回答が変更された時
  const handleComparisonChange = (newComparison) => {
    setComparison({ ...comparison, ...newComparison });
  };
  
  // ステップを進める
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // 最終ステップ: 解読処理
      handleDecode();
    }
  };
  
  // 解読処理
  const handleDecode = async () => {
    setIsProcessing(true);
    
    try {
      // 入力データの準備
      const userInput = {
        coffeeInfo,
        mapPosition,
        preferences,
        comparison,
      };
      
      // API呼び出し
      const result = await decodeCoffeeTaste(userInput);
      setDecodeResult(result);
      
      // 結果表示ステップへ
      setCurrentStep(5);
    } catch (error) {
      console.error('Decode error:', error);
      // エラー処理
      alert('解読中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // 辞書に追加
  const handleAddToDictionary = (discovery) => {
    // TODO: データベースへの保存処理
    navigation.navigate('Dictionary', { newDiscovery: discovery });
  };
  
  // 詳細表示
  const handleViewDetail = (discovery) => {
    navigation.navigate('DiscoveryDetail', { discovery });
  };
  
  // 解読完了、ホームに戻る
  const handleFinish = () => {
    // TODO: 結果の保存処理
    navigation.navigate('Home', { decodeResult });
  };
  
  // 現在のステップに応じたコンテンツの表示
  const renderStepContent = () => {
    switch(currentStep) {
      case 1: // 基本情報
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>前回と比較してどうですか？</Text>
            <ComparisonQuestions
              comparison={comparison}
              onChange={handleComparisonChange}
            />
          </View>
        ) : (
          // 比較なしの場合は次のステップへ自動進行
          useEffect(() => { handleNextStep(); }, [])
        );
        
      case 5: // 解読結果
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>あなたのコーヒーを解読しました</Text>
            {decodeResult ? (
              <>
                <View style={styles.resultCard}>
                  <Text style={styles.resultTitle}>プロの表現では</Text>
                  <Text style={styles.resultText}>{decodeResult.professionalDescription}</Text>
                  
                  <Text style={styles.resultTitle}>あなた流に言うと</Text>
                  <Text style={styles.resultText}>{decodeResult.personalTranslation}</Text>
                  
                  <Text style={styles.resultTitle}>好みの傾向</Text>
                  <Text style={styles.resultText}>{decodeResult.preferenceInsight}</Text>
                </View>
                
                {decodeResult.discoveredFlavor && (
                  <DiscoveryCard
                    discovery={decodeResult.discoveredFlavor}
                    onAddToDictionary={handleAddToDictionary}
                    onViewDetail={handleViewDetail}
                  />
                )}
              </>
            ) : (
              <ActivityIndicator size="large" color="#8B5A2B" />
            )}
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* プログレスインジケーター */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View 
              key={step} 
              style={[
                styles.progressStep,
                currentStep >= step ? styles.progressStepActive : {}
              ]}
            />
          ))}
        </View>
        
        {/* ステップコンテンツ */}
        {renderStepContent()}
      </ScrollView>
      
      {/* アクションボタン */}
      <View style={styles.buttonContainer}>
        {currentStep < 5 ? (
          <Button
            style={styles.actionButton}
            isLoading={isProcessing}
            onPress={handleNextStep}
            disabled={
              (currentStep === 1 && !coffeeInfo.name) || // 名前は必須
              isProcessing
            }
          >
            {currentStep === 4 ? '解読する' : '次へ'}
          </Button>
        ) : (
          <Button style={styles.actionButton} onPress={handleFinish}>
            完了
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  progressStep: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5DEB3',
  },
  progressStepActive: {
    backgroundColor: '#8B5A2B',
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5A2B',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderColor: '#D4A76A',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5DEB3',
    backgroundColor: 'white',
  },
  actionButton: {
    backgroundColor: '#8B5A2B',
    borderRadius: 8,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#D4A76A',
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5A2B',
    marginBottom: 4,
    marginTop: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
});

export default CoffeeDecodeScreen;
```

---

## 7. 開発ガイドラインと注意点

### 7.1 コード規約

- TypeScriptを基本とし、型付けを徹底する
- コンポーネントはAtomicデザインに基づいて分割する
- ロジックとUIの分離を心がける
- Firebase/Supabaseとの通信処理は専用サービス層に分離

### 7.2 パフォーマンス考慮事項

- OpenAI APIコールは必要最小限に抑え、キャッシュを活用
- 大量のデータ処理が必要な場合はページネーションを実装
- 画像最適化を徹底（リサイズ、キャッシング）
- リアルタイム同期が必要ない画面では、オンデマンド読み込みを検討

### 7.3 テスト方針

- 重要なロジック（OpenAI連携、データ変換）には単体テストを実装
- UIコンポーネントには基本的なスナップショットテストを実装
- E2Eテストよりも、中核機能のユーザーテストを優先

### 7.4 セキュリティ考慮事項

- OpenAI APIキーはクライアント側に保存しない
- サーバーレス関数経由でAPIを呼び出す
- ユーザーデータへのアクセス制御をFirebase/Supabaseルールで厳格に設定
- ユーザーコンテンツの検証を徹底（XSS対策など）

---

## 8. リリースとマーケティング計画

### 8.1 マーケティングメッセージの転換

**旧メッセージ**:
「コーヒーの味わいを言語化するトレーニングアプリ」

**新メッセージ**:
「あなた流に翻訳する、コーヒーの味わい探検アプリ」
「コーヒーの味の謎を解き明かし、あなただけの味わい地図を作ろう」

### 8.2 初期ユーザー獲得戦略

1. **探検テーマのランディングページ**
   - 「あなたのコーヒーの冒険が、ここから始まる」
   - 実際のアプリ画面とアニメーションを多用

2. **カフェ・焙煎所連携**
   - QRコードパネルの設置
   - 「このコーヒーを解読してみよう」キャンペーン

3. **SNS展開**
   - Instagram: 「今日の発見」カード共有機能
   - Twitter: 「あなたのコーヒー好みプロファイル」共有機能

### 8.3 ローンチタイムライン

- **フェーズ1完了（4週目）**: クローズドベータ開始（50名）
- **フェーズ2完了（8週目）**: オープンベータ開始（500名）
- **フェーズ3完了（12週目）**: 正式リリース

---

## 9. 将来拡張案

### 9.1 コミュニティ機能

- 発見シェア機能
- 「あなたに似た味わい探検家」のマッチング
- コミュニティチャレンジ（「みんなで◯◯な風味を探そう」）

### 9.2 商用連携

- コーヒー豆ECサイトとの連携
- 「あなたの好みに合った豆」のサブスクリプション
- カフェやロースターとの探検イベント

### 9.3 高度なAI機能

- 写真からの豆情報抽出
- 味わい予測（「この豆は〇〇な味わいがするはずです」）
- パーソナライズされた抽出アドバイス

---

## 10. 結論

本リニューアル計画は、Coffee Wordsアプリの本質的な価値を「言語化トレーニング」から「好みの解読と探検ガイド」へとシフトさせるものです。ユーザーの本当のニーズである「自分の好みを理解したい」「新しい素晴らしいコーヒー体験をしたい」という欲求に直接応えることで、より明確な価値提案と継続的なエンゲージメントを実現します。

言語化はあくまで手段であり、目的は「自分だけのコーヒー体験の地図を作り、新たな喜びを発見すること」です。このビジョンのもと、ユーザーが新しいポケモンを発見するような感動を、コーヒーの味わいの世界で体験できるアプリへと生まれ変わらせることを目指します。<Text style={styles.stepTitle}>基本情報を入力</Text>
            <Input
              placeholder="コーヒー名"
              value={coffeeInfo.name}
              onChangeText={(text) => setCoffeeInfo({ ...coffeeInfo, name: text })}
              style={styles.input}
              marginBottom={4}
            />
            <Input
              placeholder="焙煎所 (任意)"
              value={coffeeInfo.roaster}
              onChangeText={(text) => setCoffeeInfo({ ...coffeeInfo, roaster: text })}
              style={styles.input}
              marginBottom={4}
            />
          </View>
        );
        
      case 2: // 味わいマップ
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>味わいマップで位置づけ</Text>
            <TasteMap
              initialPosition={mapPosition}
              onPositionChange={handleMapPositionChange}
            />
          </View>
        );
        
      case 3: // 好み質問
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>味わいについて教えてください</Text>
            <PreferenceQuestions
              preferences={preferences}
              onChange={handlePreferenceChange}
            />
          </View>
        );
        
      case 4: // 比較質問 (該当時のみ)
        return comparison ? (
          <View style={styles.stepContainer}>
            # Coffee Words リニューアル仕様書

## コンセプト転換

### 従来コンセプト
「コーヒーの味わいを言語化するトレーニングアプリ」

### 新コンセプト
「あなたの好みの解読と探検ガイド」

---

## 1. 核心的価値の再定義

従来のアプリは「言語化」に焦点を当てていましたが、言語化はあくまで手段であり目的ではありません。新しいアプリは以下の3つの価値に焦点を当てます：

### 1.1 翻訳機能
- 個人の主観的な感覚と専門用語の間の双方向翻訳
- プロの言葉を「あなた語」に、あなたの感覚を「プロの言葉」に変換

### 1.2 自己理解
- 自分の好みのパターン発見と視覚化
- 「あなたは〇〇な特徴を持つコーヒーを好む傾向があります」という洞察

### 1.3 発見・成長
- 好みに基づいた次のコーヒー体験の提案
- 未体験の領域への冒険を促す「探検ガイド」機能

---

## 2. UI/UX再設計方針

### 2.1 言語のシフト
- 「記録する」→「解読する」
- 「言語化する」→「翻訳する」
- 「学ぶ」→「発見する」
- 「トレーニング」→「探検」

### 2.2 メインフロー再構成
1. 「今日の一杯」→「今日の探検」
2. 「コーヒー辞典」→「あなたの翻訳辞書」
3. 「好みプロファイル」→「味わい探検マップ」

---

## 3. 画面別詳細仕様

### 3.1 ホーム画面（今日の探検）

#### 3.1.1 探検ミッション
- **機能**: 毎日または新しいコーヒーごとに探検ミッションを提供
- **表示**: カード形式でミッションの説明と目標を表示
- **例**: 
  - 「今日は『甘み』のニュアンスの違いを探そう」
  - 「前回見つけた『ベリー系』の風味に似た別の特徴を探そう」
- **実装要件**:
  - ユーザーの過去の記録に基づいてミッションを自動生成するアルゴリズム
  - 未経験の風味特性を優先的に提案する仕組み

#### 3.1.2 コーヒー解読入力フロー
- **ステップ1**: 基本情報入力（コーヒー名、焙煎所など）
- **ステップ2**: 味わいマップでの位置づけ
  - 2軸マップUIを実装（縦軸：軽い⇔重い、横軸：酸味⇔苦味）
  - タップした位置に基づいて自動的に基本特性をテキスト表示
- **ステップ3**: 好みベースの質問
  - 「このコーヒーは好きですか？」（5段階評価）
  - 「特に気に入ったポイントは？」（選択肢+自由入力）
  - 「違和感があったポイントは？」（選択肢+自由入力）
- **ステップ4**: 再体験意向
  - 「また飲みたいと思いますか？」（5段階評価）
  - 「どのような場面で飲みたいですか？」（選択肢）
- **ステップ5**: （2回目以降のコーヒーの場合）比較質問
  - 「前回より好きですか？」（3段階：より好き、同じくらい、あまり好きではない）
  - 「前回と比べて特に違いを感じたのは？」（自由入力）

#### 3.1.3 解読結果表示
- **翻訳結果**: ユーザーの感覚入力を専門的な表現に翻訳
  - 例：「あなたの好みを翻訳すると『明るい酸味とミルクチョコレートのような甘みを持つ、軽やかなボディのコーヒー』になります」
- **発見カード**: ユーザーが発見した新しい味わい特性をカード形式で表示
  - 特性名、カテゴリ、説明、レア度を表示
  - 「図鑑に追加」ボタンを設置
- **好みの傾向分析**: 今回の記録から分かる好みの傾向
  - 例：「あなたは高地産のエチオピアコーヒーによく見られる花のような香りを好む傾向があります」
- **次回の探検提案**: 次に試すべきコーヒーのタイプや注目すべき特性の提案

### 3.2 翻訳辞書画面（旧コーヒー辞典）

#### 3.2.1 パーソナル翻訳辞典
- **機能**: ユーザーが経験した味わい用語と、それに対する個人的な感覚の対応付け
- **表示**:
  - 専門用語→個人的解釈の対応表
  - 例：「酸味：あなたにとっては『レモネードのような爽やかさ』」
  - 理解度/経験度に応じたカテゴリ分け
- **機能要件**:
  - 用語をタップすると詳細ページに遷移
  - 検索機能の実装
  - カテゴリ別表示切替

#### 3.2.2 用語詳細ページ
- **表示内容**:
  - 専門的定義
  - あなた流の解釈
  - 発見した日付と関連コーヒー
  - この特性を持つ他のコーヒーの例
  - 関連する他の特性へのリンク
- **インタラクション**:
  - 解釈の編集機能
  - 「次回確認」ボタン（次回のミッションに追加）

#### 3.2.3 専門用語翻訳機能
- **機能**: コーヒーショップやパッケージの説明文を「あなた語」に翻訳
- **使用例**:
  - テキスト入力または写真アップロード
  - 「この説明はあなたにとって〇〇のような味わいを意味します」という翻訳結果

### 3.3 味わい探検マップ（旧好みプロファイル）

#### 3.3.1 視覚的な探検マップ
- **機能**: ユーザーが経験済みの「味わい領域」と未開拓領域を地図形式で表示
- **表示**:
  - インタラクティブなマップUI
  - 経験済み領域は色付き、未経験領域はグレーアウト
  - 特に好きな領域は強調表示
- **インタラクション**:
  - 領域をタップすると詳細情報表示
  - ピンチ操作でズームイン/アウト
  - ドラッグでマップ移動

#### 3.3.2 好みプロファイル
- **機能**: ユーザーの好みの傾向を分析して視覚化
- **表示**:
  - レーダーチャート（酸味、甘み、苦味、ボディなど）
  - 好みの特徴テキスト説明
  - 時系列での好みの変化グラフ
- **インタラクション**:
  - 時期別フィルタリング
  - SNSでの共有機能

#### 3.3.3 次の冒険提案
- **機能**: ユーザーの好みと経験に基づいた次のコーヒー体験の提案
- **表示**:
  - 「あなたの好みに合う未体験の豆」リスト
  - 「あなたの好みを広げる挑戦」提案
  - 近くで購入できるコーヒー豆のリコメンド（オプション）
- **インタラクション**:
  - 提案をブックマーク
  - 「試してみた」ボタン

---

## 4. 技術実装仕様

### 4.1 AIプロンプト再設計

#### 4.1.1 翻訳プロンプト
```javascript
// ユーザー感覚→専門表現の翻訳プロンプト
const translationPrompt = `
あなたはコーヒーの味覚翻訳の専門家です。
ユーザーの主観的な感覚を専門的な表現に、専門的な表現をユーザーの感覚に翻訳してください。

# ユーザーの入力
味わいマップ位置: ${JSON.stringify(mapPosition)}

// services/openai/api.js

/**
 * OpenAI APIを使用してコーヒー解読を行う
 * @param {Object} userInput - ユーザーの入力データ
 * @return {Promise<Object>} 解読結果
 */
export async function decodeCoffeeTaste(userInput) {
  try {
    const prompt = buildDecodePrompt(userInput);
    
    // キャッシュチェック
    const cacheKey = generateCacheKey(userInput);
    const cachedResult = await checkCache(cacheKey);
    if (cachedResult) return cachedResult;
    
    // APIリクエスト
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system', 
            content: 'あなたはコーヒーの味覚翻訳と解読の専門家です。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // JSONパース
    const parsedContent = JSON.parse(content);
    
    // キャッシュに保存
    await saveToCache(cacheKey, parsedContent, 24 * 60 * 60); // 24時間
    
    return parsedContent;
  } catch (error) {
    console.error('Coffee decoding error:', error);
    
    // フォールバック処理
    if (config.ENABLE_FALLBACK) {
      return generateFallbackResponse(userInput);
    }
    
    throw error;
  }
}

/**
 * キャッシュキーを生成
 */
function generateCacheKey(userInput) {
  // ユーザー入力の主要部分からハッシュを生成
  const { mapPosition, preferences } = userInput;
  const inputString = JSON.stringify({
    x: Math.round(mapPosition.x),
    y: Math.round(mapPosition.y),
    rating: preferences.overallRating,
    liked: preferences.likedPoints.sort().join(',')
  });
  
  return 'decode_' + hashString(inputString);
}

/**
 * フォールバックレスポンスを生成
 */
function generateFallbackResponse(userInput) {
  // マップ位置から基本特性を抽出
  const mapCharacteristics = extractMapCharacteristics(userInput.mapPosition);
  const { preferences } = userInput;
  
  // 単純な決定木ベースの応答生成
  let description = '';
  if (mapCharacteristics.body === '軽やかなボディ') {
    description = 'ライトなボディで明るい風味のコーヒーです。';
    if (mapCharacteristics.acidity) {
      description += ' フルーティな酸が特徴的です。';
    } else {
      description += ' やわらかな苦味と爽やかさがバランスよく感じられます。';
    }
  } else if (mapCharacteristics.body === '重厚なボディ') {
    description = '重厚なボディが特徴的なコーヒーです。';
    if (mapCharacteristics.bitterness) {
      description += ' しっかりとした苦味とコクがあります。';
    } else {
      description += ' 深みのある酸とコクが複雑に感じられます。';
    }
  } else {
    description = 'バランスの取れたミディアムボディのコーヒーです。';
    if (mapCharacteristics.acidity) {
      description += ' 適度な酸味があり、飲みやすさが特徴です。';
    } else if (mapCharacteristics.bitterness) {
      description += ' 控えめな苦味と甘みが調和しています。';
    } else {
      description += ' 全体的にバランスがよく、どんな場面でも楽しめます。';
    }
  }
  
  // 好みに基づいた推奨
  let insight = '';
  if (preferences.overallRating >= 4) {
    insight = 'あなたは軽やかでフルーティな風味のコーヒーを好む傾向があります。';
    if (mapCharacteristics.acidity) {
      insight = 'あなたは明るい酸味のあるコーヒーを好む傾向があります。';
    } else if (mapCharacteristics.bitterness) {
      insight = 'あなたはしっかりとした苦味のあるコーヒーを好む傾向があります。';
    }
  }
  
  return {
    professionalDescription: description,
    personalTranslation: "あなたにとっては「心地よく飲みやすい」コーヒーです。",
    tasteProfile: {
      acidity: Math.floor(mapCharacteristics.acidityLevel / 20) + 1,
      sweetness: Math.floor(Math.random() * 3) + 2, // 2-4のランダム値
      bitterness: Math.floor(mapCharacteristics.bitternessLevel / 20) + 1,
      body: Math.floor(mapCharacteristics.bodyLevel / 20) + 1,
      complexity: Math.floor(Math.random() * 3) + 2 // 2-4のランダム値
    },
    preferenceInsight: insight,
    discoveredFlavor: {
      name: preferences.likedPoints[0] || "バランスの良さ",
      category: "general",
      description: "コーヒーの基本的な特性のひとつです。",
      rarity: 1,
      userInterpretation: "あなたにとっては「好ましい」特性です。"
    },
    nextExploration: "次回は少し違った焙煎度のコーヒーを試してみると、新しい発見があるかもしれません。"
  };
}

### 6.2 味わいマップコンポーネント実装

```jsx
// components/TasteMap.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { extractMapCharacteristics } from '../services/openai/prompts';

/**
 * 味わいマップコンポーネント
 * @param {Object} props
 * @param {Object} props.initialPosition - 初期位置 {x, y}
 * @param {Function} props.onPositionChange - 位置変更時のコールバック
 * @returns {React.Component}
 */
const TasteMap = ({ initialPosition, onPositionChange }) => {
  const [position, setPosition] = useState(initialPosition || { x: 200, y: 200 });
  const [characteristics, setCharacteristics] = useState({});
  
  useEffect(() => {
    // 特性の抽出
    const extracted = extractMapCharacteristics(position);
    setCharacteristics(extracted);
    
    // 親コンポーネントへの通知
    if (onPositionChange) {
      onPositionChange(position, extracted);
    }
  }, [position]);
  
  // タップ位置の更新
  const handlePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    
    // マップの境界内に制限
    const newPosition = {
      x: Math.max(0, Math.min(400, locationX)),
      y: Math.max(0, Math.min(400, locationY))
    };
    
    setPosition(newPosition);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>あなたのコーヒーはどの位置？</Text>
      <Text style={styles.subtitle}>タップして位置を示してください</Text>
      
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.map}>
          {/* 軸 */}
          <View style={styles.horizontalAxis} />
          <View style={styles.verticalAxis} />
          
          {/* 軸ラベル */}
          <Text style={[styles.axisLabel, styles.topLabel]}>軽やか</Text>
          <Text style={[styles.axisLabel, styles.bottomLabel]}>重厚</Text>
          <Text style={[styles.axisLabel, styles.leftLabel]}>酸味</Text>
          <Text style={[styles.axisLabel, styles.rightLabel]}>苦味</Text>
          
          {/* 選択マーカー */}
          <View style={[
            styles.marker,
            { left: position.x, top: position.y }
          ]} />
        </View>
      </TouchableWithoutFeedback>
      
      {/* 特性表示 */}
      <View style={styles.characteristics}>
        <Text style={styles.characteristicTitle}>この位置のコーヒー特性:</Text>
        <Text style={styles.characteristicText}>
          {characteristics.body || 'ミディアムボディ'}
          {characteristics.acidity ? `、${characteristics.acidity}` : ''}
          {characteristics.bitterness ? `、${characteristics.bitterness}` : ''}
          が特徴のコーヒーです。
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5A2B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 16,
  },
  map: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#D4A76A',
    borderWidth: 1,
    position: 'relative',
  },
  horizontalAxis: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#D4A76A',
    opacity: 0.5,
    top: '50%',
  },
  verticalAxis: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: '#D4A76A',
    opacity: 0.5,
    left: '50%',
  },
  axisLabel: {
    position: 'absolute',
    fontSize: 12,
    color: '#8B5A2B',
  },
  topLabel: {
    top: 8,
    alignSelf: 'center',
  },
  bottomLabel: {
    bottom: 8,
    alignSelf: 'center',
  },
  leftLabel: {
    left: 8,
    top: '50%',
    transform: [{ translateY: -6 }]
  },
  rightLabel: {
    right: 8,
    top: '50%',
    transform: [{ translateY: -6 }]
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8B5A2B',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  characteristics: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100%',
    borderColor: '#D4A76A',
    borderWidth: 1,
  },
  characteristicTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5A2B',
    marginBottom: 4,
  },
  characteristicText: {
    fontSize: 14,
    color: '#555555',
  }
});

export default TasteMap;
```

### 6.3 発見カードコンポーネント実装

```jsx
// components/DiscoveryCard.jsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

/**
 * 発見カードコンポーネント
 * @param {Object} props
 * @param {Object} props.discovery - 発見データ
 * @param {Function} props.onAddToDictionary - 辞書に追加時のコールバック
 * @param {Function} props.onViewDetail - 詳細表示時のコールバック
 * @returns {React.Component}
 */
const DiscoveryCard = ({ discovery, onAddToDictionary, onViewDetail }) => {
  const { name, category, description, rarity, isFirstDiscovery, userInterpretation } = discovery;
  
  // カテゴリに基づくアイコンとカラーの設定
  const getCategoryMeta = (category) => {
    switch(category) {
      case 'acidity':
        return { icon: '🍋', color: '#FFD700' };
      case 'sweetness':
        return { icon: '🍯', color: '#FFA500' };
      case 'bitterness':
        return { icon: '🍫', color: '#8B4513' };
      case 'body':
        return { icon: '💪', color: '#A0522D' };
      case 'aroma':
        return { icon: '🌸', color: '#FF69B4' };
      case 'aftertaste':
        return { icon: '✨', color: '#9370DB' };
      default:
        return { icon: '☕', color: '#D4A76A' };
    }
  };
  
  const categoryMeta = getCategoryMeta(category);
  
  // レア度に基づく星表示
  const rarityStars = '★'.repeat(rarity) + '☆'.repeat(5 - rarity);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isFirstDiscovery ? '新しい発見！' : '再発見！'}
        </Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { backgroundColor: categoryMeta.color }]}>
          <Text style={styles.icon}>{categoryMeta.icon}</Text>
        </View>
        
        <View style={styles.discoveryInfo}>
          <Text style={styles.discoveryName}>{name}</Text>
          <Text style={styles.discoveryCategory}>{categoryToJapanese(category)}</Text>
          <Text style={styles.discoveryRarity}>レア度: {rarityStars}</Text>
        </View>
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.interpretation}>あなたにとって: {userInterpretation}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onAddToDictionary && onAddToDictionary(discovery)}
        >
          <Text style={styles.buttonText}>辞書に追加</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => onViewDetail && onViewDetail(discovery)}
        >
          <Text style={styles.secondaryButtonText}>詳細を見る</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// カテゴリの日本語表示
const categoryToJapanese = (category) => {
  const map = {
    'acidity': '酸味',
    'sweetness': '甘み',
    'bitterness': '苦味',
    'body': 'ボディ',
    'aroma': '香り',
    'aftertaste': '余韻',
    'general': '基本特性',
  };
  return map[category] || category;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    backgroundColor: '#8B5A2B',
    padding: 12,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 30,
  },
  discoveryInfo: {
    flex: 1,
  },
  discoveryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  discoveryCategory: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  discoveryRarity: {
    fontSize: 12,
    color: '#8B5A2B',
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F5DEB3',
  },
  description: {
    fontSize: 14,
    color: '#1E1E1E',
    marginBottom: 8,
    lineHeight: 20,
  },
  interpretation: {
    fontSize: 14,
    color: '#555555',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F5DEB3',
  },
  button: {
    flex: 1,
    backgroundColor: '#8B5A2B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#8B5A2B',
  },
  secondaryButtonText: {
    color: '#8B5A2B',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DiscoveryCard;
好みレベル: ${preferenceLevel}/5
気に入ったポイント: ${likedPoints}
違和感があったポイント: ${dislikedPoints}
再体験意向: ${wouldDrinkAgain}/5
飲みたいシーン: ${drinkingScene}

# 出力要件
以下の形式でJSON出力してください：
{
  "professionalDescription": "専門的な表現(2-3文)",
  "personalTranslation": "ユーザーにとってどういう意味か",
  "tasteProfile": {
    "acidity": 1-5の数値,
    "sweetness": 1-5の数値,
    "bitterness": 1-5の数値,
    "body": 1-5の数値,
    "complexity": 1-5の数値
  },
  "preferenceInsight": "好みの傾向についての洞察",
  "discoveredFlavor": {
    "name": "発見した特性の名前",
    "category": "カテゴリ",
    "description": "説明",
    "rarity": 1-5の数値,
    "userInterpretation": "ユーザーにとっての意味"
  },
  "nextExploration": "次に試すべきコーヒータイプや特性"
}
`;
```

#### 4.1.2 個人辞書構築プロンプト
```javascript
// 個人辞書エントリー生成プロンプト
const dictionaryEntryPrompt = `
あなたはコーヒーの個人辞書作成の専門家です。
ユーザーの過去の記録に基づいて、特定の味わい用語に対する個人的な解釈を生成してください。

# 用語情報
用語: ${term}
専門的定義: ${professionalDefinition}

# ユーザーの過去の記録
この用語に関連する記録:
${relatedRecords.map(r => `- ${r.description}`).join('\n')}

# 出力要件
以下の形式でJSON出力してください：
{
  "personalInterpretation": "ユーザーにとってのこの用語の意味",
  "examples": ["関連する具体例1", "関連する具体例2"],
  "connections": ["関連する他の用語1", "関連する他の用語2"],
  "personalNotes": "ユーザーのための個人的なメモ案"
}
`;
```

### 4.2 データモデル再設計

#### 4.2.1 コーヒー記録モデル
```typescript
interface CoffeeExploration {
  id: string;
  userId: string;
  createdAt: timestamp;
  // 基本情報
  coffeeInfo: {
    name: string;
    roaster?: string;
    origin?: string;
    photo?: string;
  };
  // マップ位置
  tasteMapPosition: {
    x: number; // 0-400
    y: number; // 0-400
  };
  // 好み評価
  preferences: {
    overallRating: number; // 1-5
    likedPoints: string[];
    likedPointsDetail?: string;
    dislikedPoints?: string[];
    dislikedPointsDetail?: string;
    wouldDrinkAgain: number; // 1-5
    drinkingScene: string[];
  };
  // 比較（2回目以降のみ）
  comparison?: {
    comparedToId: string; // 比較対象の記録ID
    preferenceCompared: 'better' | 'same' | 'worse';
    notedDifferences?: string;
  };
  // AI解析結果
  analysis: {
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
    discoveredFlavor?: {
      id: string;
      name: string;
      category: string;
      description: string;
      rarity: number;
      isFirstDiscovery: boolean;
    };
    nextExploration: string;
  };
}
```

#### 4.2.4 ミッションモデル
```typescript
interface ExplorationMission {
  id: string;
  userId: string;
  createdAt: timestamp;
  expiresAt: timestamp;
  // ミッション基本情報
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'discovery' | 'comparison' | 'challenge' | 'daily';
  // ミッション目標
  objectives: {
    targetFlavorId?: string;
    targetFlavorCategory?: string;
    targetRegionId?: string;
    comparisonCoffeeId?: string;
    specificTask?: string;
  };
  // ミッション状態
  status: 'active' | 'completed' | 'expired';
  completedAt?: timestamp;
  reward?: {
    badgeId?: string;
    experiencePoints: number;
    unlockFeatureId?: string;
  };
  // 関連データ
  relatedCoffeeRecommendations: string[]; // 推奨コーヒーID
  helpTips: string[]; // ヒント
}
```

### 4.3 画面遷移フロー

```
1. スプラッシュ画面
   └→ 2. ログイン/サインアップ（未認証時のみ）
      └→ 3. ホーム画面（今日の探検）
          ├→ 4. コーヒー解読フロー
          │   ├→ 4.1 基本情報入力
          │   ├→ 4.2 味わいマップ配置
          │   ├→ 4.3 好み質問回答
          │   ├→ 4.4 比較質問回答（該当時のみ）
          │   └→ 4.5 解読結果表示
          │       └→ 4.5.1 発見詳細表示
          │           └→ 3. ホーム画面に戻る
          ├→ 5. ミッション詳細
          │   └→ 3. ホーム画面に戻る
          ├→ 6. 翻訳辞書画面
          │   ├→ 6.1 用語検索
          │   ├→ 6.2 カテゴリー表示
          │   └→ 6.3 用語詳細表示
          │       ├→ 6.3.1 用語編集
          │       │   └→ 6.3 用語詳細表示に戻る
          │       └→ 6 翻訳辞書画面に戻る
          └→ 7. 味わい探検マップ画面
              ├→ 7.1 マップ詳細表示
              ├→ 7.2 好みプロファイル詳細
              ├→ 7.3 推奨リスト表示
              │   └→ 7 味わい探検マップ画面に戻る
              └→ 7.4 時系列変化表示
                  └→ 7 味わい探検マップ画面に戻る
```

---

## 5. 実装プラン

### 5.1 フェーズ分け

#### フェーズ1: 基盤構築（1-4週目）
- 新コンセプトに基づくUI/UX設計の完了
- コーヒー解読フローの再構築
- 味わいマップコンポーネントの実装
- AIプロンプトの再設計と実装
- 基本データモデルの再設計

#### フェーズ2: コア機能実装（5-8週目）
- 翻訳辞書機能の実装
- 探検マップの基本実装
- 発見カードと記録機能
- 好みプロファイル分析の実装
- ミッション生成システムの基本実装

#### フェーズ3: 探検体験強化（9-12週目）
- 探検マップの詳細化と視覚的強化
- 発見バッジとレベルアップシステム
- 次回探索推奨エンジンの強化
- ユーザーフィードバックに基づく調整
- パフォーマンス最適化

### 5.2 技術スタック

#### フロントエンド
- React Native (Expo)
- Zustand（状態管理）
- React Navigation
- NativeBase（UIコンポーネント）

#### バックエンド
- Firebase / Supabase
  - Authentication（認証）
  - Firestore / PostgreSQL（データベース）
  - Storage（画像保存）
  - Functions（サーバーレス関数）
- OpenAI API（GPT-3.5-turbo）

#### デザイン
- Figma（UI/UXデザイン）
- カラーパレット：元の仕様書のパレットを継続使用
- アイコン：Material Design + カスタムアイコン

### 5.3 リソース要件

#### 開発者リソース
- フロントエンドエンジニア: 1名
- バックエンド/AIエンジニア: 1名
- UIデザイナー: 1名（パートタイム可）

#### インフラリソース
- Firebase/Supabase: Spark/Hobby プラン（初期）
- OpenAI API: 予測使用量 1000ユーザー×月20回 = 20,000リクエスト/月
- 画像ストレージ: 初期5GB想定

#### 開発環境
- GitHub: プライベートリポジトリ
- CI/CD: GitHub Actions + Expo EAS
- テスト環境: Jest + React Native Testing Library

---

## 6. 具体的な実装指示

### 6.1 AIプロンプト実装

#### 解読プロンプトの実装例
```javascript
// services/openai/prompts.js

/**
 * ユーザー入力から解読プロンプトを生成する
 * @param {Object} userInput - ユーザーの入力データ
 * @return {String} OpenAIに送信するプロンプト
 */
export function buildDecodePrompt(userInput) {
  const {
    mapPosition,
    preferences,
    comparison,
    coffeeInfo
  } = userInput;
  
  // マップ位置から基本特性を抽出
  const mapCharacteristics = extractMapCharacteristics(mapPosition);
  
  return `
    あなたはコーヒーの味覚翻訳と解読の専門家です。
    ユーザーの主観的な感覚入力に基づいて、以下の出力を生成してください。
    
    # ユーザーの入力
    コーヒー情報: ${JSON.stringify(coffeeInfo)}
    味わいマップ位置: ${JSON.stringify(mapCharacteristics)}
    好みレベル: ${preferences.overallRating}/5
    気に入ったポイント: ${preferences.likedPoints.join(', ')}
    ${preferences.likedPointsDetail ? `詳細: ${preferences.likedPointsDetail}` : ''}
    ${preferences.dislikedPoints ? `違和感があったポイント: ${preferences.dislikedPoints.join(', ')}` : ''}
    ${preferences.dislikedPointsDetail ? `詳細: ${preferences.dislikedPointsDetail}` : ''}
    再体験意向: ${preferences.wouldDrinkAgain}/5
    飲みたいシーン: ${preferences.drinkingScene.join(', ')}
    ${comparison ? `前回との比較: ${comparison.preferenceCompared}, 違い: ${comparison.notedDifferences || 'なし'}` : ''}
    
    # 出力要件
    以下の形式でJSON出力してください：
    {
      "professionalDescription": "専門的な表現(2-3文)",
      "personalTranslation": "ユーザーにとってどういう意味か(平易な言葉で)",
      "tasteProfile": {
        "acidity": 1-5の数値,
        "sweetness": 1-5の数値,
        "bitterness": 1-5の数値,
        "body": 1-5の数値,
        "complexity": 1-5の数値
      },
      "preferenceInsight": "好みの傾向についての洞察",
      "discoveredFlavor": {
        "name": "発見した特性の名前",
        "category": "カテゴリ",
        "description": "説明",
        "rarity": 1-5の数値,
        "userInterpretation": "ユーザーにとっての意味"
      },
      "nextExploration": "次に試すべきコーヒータイプや特性"
    }
  `;
}

/**
 * マップ位置から基本特性を抽出する
 * @param {Object} position - x, y座標
 * @return {Object} 抽出された特性
 */
function extractMapCharacteristics(position) {
  const { x, y } = position;
  // マップの中心からの相対位置
  const centerX = 200;
  const centerY = 200;
  const relX = x - centerX; // 正：苦味方向、負：酸味方向
  const relY = centerY - y; // 正：軽い方向、負：重い方向
  
  // 軸に基づく特性の決定
  let acidity = '';
  let bitterness = '';
  let body = '';
  
  // X軸: 左が酸味多い、右が苦味多い
  if (relX < -80) acidity = "鮮明な酸";
  else if (relX < -30) acidity = "明るい酸";
  else if (relX < 30) acidity = "バランスの取れた酸";
  else if (relX < 80) bitterness = "軽い苦味";
  else bitterness = "しっかりした苦味";
  
  // Y軸: 上がライト、下がヘビー
  if (relY > 80) body = "軽やかなボディ";
  else if (relY > 30) body = "すっきりとしたボディ";
  else if (relY > -30) body = "ミディアムボディ";
  else if (relY > -80) body = "しっかりしたボディ";
  else body = "重厚なボディ";
  
  return {
    acidity: acidity || null,
    bitterness: bitterness || null,
    body,
    // 0-100のスケールに変換
    acidityLevel: Math.max(0, Math.min(100, 50 - relX / 2)),
    bitternessLevel: Math.max(0, Math.min(100, 50 + relX / 2)),
    bodyLevel: Math.max(0, Math.min(100, 50 - relY / 2))
  };
}

#### 4.2.2 味わい辞典モデル
```typescript
interface FlavorDictionaryEntry {
  id: string;
  userId: string;
  createdAt: timestamp;
  updatedAt: timestamp;
  // 基本情報
  term: string;
  category: 'acidity' | 'sweetness' | 'bitterness' | 'body' | 'aroma' | 'aftertaste' | 'other';
  // 定義
  professionalDefinition: string;
  personalInterpretation: string;
  // メタデータ
  masteryLevel: number; // 1-5
  discoveryCount: number;
  lastEncounteredAt: timestamp;
  firstDiscoveredAt: timestamp;
  // 関連データ
  relatedCoffeeIds: string[];
  relatedTerms: string[];
  examples: string[];
  personalNotes?: string;
  // 探検状態
  explorationStatus: 'discovered' | 'learning' | 'mastered';
}

#### 4.2.3 探検マップモデル
```typescript
interface TasteExplorationMap {
  id: string;
  userId: string;
  updatedAt: timestamp;
  // マップデータ
  exploredRegions: {
    regionId: string;
    name: string;
    position: {
      x: number;
      y: number;
    };
    size: number;
    explorationLevel: number; // 0-100%
    preferenceLevel: number; // 1-5
    relatedFlavorIds: string[];
    relatedCoffeeIds: string[];
  }[];
  // 好みプロファイル
  preferenceProfile: {
    acidity: number;
    sweetness: number;
    bitterness: number;
    body: number;
    brightness: number;
    complexity: number;
    // 時系列データ
    history: {
      timestamp: timestamp;
      values: {
        acidity: number;
        sweetness: number;
        bitterness: number;
        body: number;
        brightness: number;
        complexity: number;
      };
    }[];
  };
  // 探検進捗
  explorationProgress: {
    discoveredFlavors: number;
    totalFlavorsPossible: number;
    discoveredRegions: number;
    totalRegionsPossible: number;
    currentExplorationRank: string; // 「冒険者」「探検家」など
    nextRankRequirement: string;
  };
  // 冒険推奨
  recommendations: {
    forPreference: {
      coffeeId: string;
      coffeeName: string;
      reason: string;
      matchPercentage: number;
    }[];
    forExploration: {
      flavorId: string;
      flavorName: string;
      reason: string;
      difficultyLevel: number;
    }[];
  };
}
```
