/**
 * OpenAI APIで利用するプロンプトを生成する関数群
 */

/**
 * マップ位置から基本特性を抽出する
 * @param position - x, y座標 (0-400の範囲)
 * @returns 抽出された特性
 */
export function extractMapCharacteristics(position: { x: number; y: number }) {
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

/**
 * ユーザー入力から解読プロンプトを生成する
 * @param userInput - ユーザーの入力データ
 * @return OpenAIに送信するプロンプト
 */
export function buildDecodePrompt(userInput: any): string {
  const {
    coffeeInfo,
    mapPosition,
    preferences,
    comparison
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
        "category": "acidity, sweetness, bitterness, body, aroma, aftertasteのいずれか",
        "description": "説明",
        "rarity": 1-5の数値,
        "userInterpretation": "ユーザーにとっての意味"
      },
      "nextExploration": "次に試すべきコーヒータイプや特性"
    }
  `;
}

/**
 * 個人辞書エントリー生成プロンプト
 * @param term - 用語
 * @param professionalDefinition - 専門的定義
 * @param relatedRecords - 関連する記録
 * @returns プロンプト
 */
export function buildDictionaryEntryPrompt(
  term: string,
  professionalDefinition: string,
  relatedRecords: any[]
): string {
  return `
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
}

/**
 * 探検ミッション生成プロンプト
 * @param userProfile - ユーザープロファイル
 * @param explorationHistory - 探検履歴
 * @returns プロンプト
 */
export function buildMissionGenerationPrompt(
  userProfile: any,
  explorationHistory: any
): string {
  return `
    あなたはコーヒーの味わい探検ガイドです。
    ユーザーのプロファイルと過去の探検履歴に基づいて、新しい探検ミッションを提案してください。
    
    # ユーザープロファイル
    好みの傾向: ${JSON.stringify(userProfile.preferences)}
    経験レベル: ${userProfile.experienceLevel}
    発見済み特性: ${userProfile.discoveredFlavors.join(', ')}
    
    # 探検履歴
    最近の探検:
    ${explorationHistory.map((h: any) => 
      `- ${h.coffeeInfo.name}: ${h.analysis.shortDescription}`
    ).join('\n')}
    
    # 出力要件
    以下の形式でJSON出力してください：
    {
      "title": "ミッションのタイトル",
      "description": "ミッションの詳細説明(2-3文)",
      "difficulty": "beginner, intermediate, advancedのいずれか",
      "type": "discovery, comparison, challenge, dailyのいずれか",
      "objectives": {
        "targetFlavorCategory": "ターゲットとなる味わいカテゴリ",
        "specificTask": "具体的なタスクの説明"
      },
      "recommendations": ["おすすめのコーヒー1", "おすすめのコーヒー2"],
      "helpTips": ["ヒント1", "ヒント2"]
    }
  `;
}