/**
 * シンプルなテストデータ作成スクリプト
 * このスクリプトはFirebase Web SDKを使用してクライアント側からテストデータを作成します。
 * Admin SDKを必要としないため、直接アプリから実行できます。
 * 
 * 使用方法:
 * 1. アプリをローカルで実行し、ログイン画面を表示する
 * 2. このスクリプトの内容をコンソールにコピペして実行
 * または
 * 1. アプリ内にこのスクリプトを一時的に組み込んで実行
 */

// Firebase設定（アプリのFirebaseConfig値をここに設定）
const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "FIREBASE_AUTH_DOMAIN",
  projectId: "FIREBASE_PROJECT_ID",
  storageBucket: "FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
  appId: "FIREBASE_APP_ID"
};

// Firebase初期化（既に初期化されている場合はスキップ）
// 注: アプリ内で実行する場合は、すでにFirebaseは初期化されているので以下の部分は不要です
let app, auth, db;
try {
  if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
  auth = firebase.auth();
  db = firebase.firestore();
  console.log('Firebase SDKが利用可能です。初期化または既存のインスタンスを使用します。');
} catch (error) {
  console.error('Firebase SDKが見つかりません。このスクリプトはFirebase SDKが初期化されているアプリ内で実行する必要があります。', error);
}

// テストユーザー情報
const TEST_USER = {
  email: 'test1@example.com',
  password: 'password123',
  displayName: 'テストユーザー1',
  experienceLevel: 'beginner'
};

// ミッションデータ作成用関数
const createMissions = async (userId) => {
  console.log(`ユーザー ${userId} のミッションを作成します...`);
  
  try {
    // 現在の日時
    const now = new Date();
    
    // デイリーミッション
    await db.collection('missions').add({
      userId: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      title: '今日のコーヒー探検',
      description: '今日飲んだコーヒーの記録を登録しましょう。定期的な記録は味覚を育てます。',
      difficulty: 'beginner',
      type: 'daily',
      objectives: {
        specificTask: '今日飲んだコーヒーを記録する'
      },
      status: 'active',
      reward: {
        experiencePoints: 5
      },
      relatedCoffeeRecommendations: [],
      helpTips: ['普段飲み慣れているコーヒーでも、じっくり味わうと新しい発見があるかもしれません']
    });
    
    // 発見ミッション
    await db.collection('missions').add({
      userId: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      expiresAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      title: '酸味と甘みのバランスを探す',
      description: '酸味と甘みのバランスが良いコーヒーを見つけて記録しましょう。バランスの取れた味わいは、多くのコーヒー愛好家に親しまれています。',
      difficulty: 'beginner',
      type: 'discovery',
      objectives: {
        targetFlavorCategory: 'acidity',
        specificTask: '酸味と甘みのバランスが取れたコーヒーを探す'
      },
      status: 'active',
      reward: {
        experiencePoints: 10
      },
      relatedCoffeeRecommendations: ['エチオピア イルガチェフェ', 'グアテマラ アンティグア'],
      helpTips: ['浅煎りのコーヒーを探してみましょう', '準備中の豆を確認してみましょう']
    });
    
    // 比較ミッション
    await db.collection('missions').add({
      userId: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      expiresAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      title: 'フルーティーな味わいを比較する',
      description: '異なる産地のフルーティーなコーヒーを2種類飲み比べて、それぞれの違いを記録しましょう。味覚の比較は理解を深めます。',
      difficulty: 'intermediate',
      type: 'comparison',
      objectives: {
        targetFlavorCategory: 'aroma',
        specificTask: 'フルーティーな風味を持つ異なる2種類のコーヒーを比較する'
      },
      status: 'active',
      reward: {
        experiencePoints: 25,
        badgeId: 'taste-explorer'
      },
      relatedCoffeeRecommendations: ['ケニア ニエリ', 'エチオピア シダモ', 'コロンビア ウイラ'],
      helpTips: ['一つは果実のような風味のあるエチオピア産がおすすめです', '時間を空けずに飲み比べると違いが分かりやすいです']
    });
    
    console.log(`ユーザー ${userId} のミッション作成に成功しました`);
    return true;
  } catch (error) {
    console.error(`ミッション作成中にエラーが発生しました: ${error}`);
    return false;
  }
};

// 探検データ作成用関数
const createExplorations = async (userId) => {
  console.log(`ユーザー ${userId} の探検データを作成します...`);
  
  try {
    // 現在の日時
    const now = new Date();
    
    // エチオピア イルガチェフェ
    await db.collection('explorations').add({
      userId: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      coffeeInfo: {
        name: 'エチオピア イルガチェフェ',
        roaster: 'オニバスコーヒー',
        origin: 'エチオピア',
        photoURL: 'https://example.com/coffee1.jpg'
      },
      tasteMapPosition: { x: 150, y: 200 },
      preferences: {
        overallRating: 4,
        likedPoints: ['フルーティー', '明るい酸味'],
        likedPointsDetail: '何よりも明るい酸が印象的で、フルーツのような甘さがあった',
        wouldDrinkAgain: 4,
        drinkingScene: ['朝', '休日']
      },
      analysis: {
        professionalDescription: 'フローラルな香りとベリーのような風味を持つ明るい酸味のコーヒー。レモンやライムを思わせるシトラス感と、紅茶のような滑らかな後味が特徴。',
        personalTranslation: '花の香りがあり、さわやかな酸味が特徴的。飲んだ後に紅茶のような味わいが残る。',
        tasteProfile: {
          acidity: 4,
          sweetness: 3,
          bitterness: 2,
          body: 2,
          complexity: 4
        },
        preferenceInsight: 'あなたは明るい酸味を好む傾向があります。フルーティーな風味と花のような香りのコーヒーを特に気に入る傾向が見られます。',
        discoveredFlavor: {
          name: 'ベリー系フルーツの酸味',
          category: 'acidity',
          description: 'ブルーベリーやラズベリーを連想させる甘酸っぱさ',
          rarity: 3,
          userInterpretation: 'フルーツジュースのような爽やかさ'
        },
        nextExploration: 'ケニア産のコーヒーも試してみると良いでしょう。ケニア産は明るい酸味にトマトのようなうま味が加わり、複雑さが増します。'
      }
    });
    
    console.log(`ユーザー ${userId} の探検データ作成に成功しました`);
    return true;
  } catch (error) {
    console.error(`探検データ作成中にエラーが発生しました: ${error}`);
    return false;
  }
};

// 辞書データ作成用関数
const createDictionaryTerms = async (userId) => {
  console.log(`ユーザー ${userId} の辞書データを作成します...`);
  
  try {
    // 現在の日時
    const now = new Date();
    
    // フルーティー
    await db.collection('dictionary').add({
      userId: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      term: 'フルーティー',
      category: 'aroma',
      professionalDefinition: 'コーヒーの中に様々な果実の風味や香りが感じられる特徴。特に明るい酸味と共に現れることが多く、エチオピアやケニアなどのアフリカ産コーヒーに顕著。',
      personalInterpretation: '飲むとフルーツジュースのような爽やかさを感じる。特に酸味が明るいものに多い。',
      masteryLevel: 3,
      discoveryCount: 5,
      lastEncounteredAt: firebase.firestore.FieldValue.serverTimestamp(),
      firstDiscoveredAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      relatedCoffeeIds: [],
      relatedTerms: ['ベリー', 'シトラス', '酸味'],
      examples: ['エチオピア イルガチェフェ', 'ケニア ニエリ'],
      personalNotes: 'お気に入りの特徴の一つ。朝に飲むと気分が良い。',
      explorationStatus: 'learning'
    });
    
    // 酸味
    await db.collection('dictionary').add({
      userId: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      term: '酸味',
      category: 'acidity',
      professionalDefinition: 'コーヒーの基本的な味覚要素の一つ。爽やかさや生き生きとした印象を与え、品質の高いコーヒーには適切な酸味がある。浅煎りほど強く感じられる。',
      personalInterpretation: 'さわやかな刺激として感じる味わい。強すぎると酸っぱく、弱すぎると物足りない。',
      masteryLevel: 4,
      discoveryCount: 10,
      lastEncounteredAt: firebase.firestore.FieldValue.serverTimestamp(),
      firstDiscoveredAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      relatedCoffeeIds: [],
      relatedTerms: ['シトラス', 'フルーティー', '明るさ'],
      examples: ['エチオピア イルガチェフェ', 'ケニア ニエリ', 'コロンビア ウイラ'],
      personalNotes: '好みの強さは中程度から強め。朝に飲むコーヒーには欠かせない要素。',
      explorationStatus: 'mastered'
    });
    
    console.log(`ユーザー ${userId} の辞書データ作成に成功しました`);
    return true;
  } catch (error) {
    console.error(`辞書データ作成中にエラーが発生しました: ${error}`);
    return false;
  }
};

// メイン処理
const createTestData = async () => {
  try {
    console.log('テストデータ作成を開始します...');
    
    // ユーザー作成
    let userId;
    
    try {
      // 既存のユーザーかどうかをチェック
      console.log(`ユーザー ${TEST_USER.email} でログイン試行...`);
      try {
        const userCredential = await auth.signInWithEmailAndPassword(TEST_USER.email, TEST_USER.password);
        userId = userCredential.user.uid;
        console.log(`既存ユーザー ${TEST_USER.email} でログインしました (ID: ${userId})`);
      } catch (loginError) {
        // ログインに失敗したら新規作成
        if (loginError.code === 'auth/user-not-found') {
          console.log(`ユーザー ${TEST_USER.email} は存在しないため新規作成します...`);
          const userCredential = await auth.createUserWithEmailAndPassword(TEST_USER.email, TEST_USER.password);
          userId = userCredential.user.uid;
          
          // 表示名を更新
          await userCredential.user.updateProfile({
            displayName: TEST_USER.displayName
          });
          
          console.log(`ユーザー ${TEST_USER.email} を作成しました (ID: ${userId})`);
          
          // プロファイルデータをFirestoreに保存
          await db.collection('users').doc(userId).set({
            id: userId,
            email: TEST_USER.email,
            displayName: TEST_USER.displayName,
            experienceLevel: TEST_USER.experienceLevel,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          console.log(`ユーザー ${TEST_USER.email} のプロファイルを作成しました`);
        } else {
          throw loginError;
        }
      }
    } catch (error) {
      console.error(`ユーザー処理中にエラーが発生しました: ${error}`);
      return false;
    }
    
    // 各種データを作成（すべて並行処理）
    const results = await Promise.all([
      createMissions(userId),
      createExplorations(userId),
      createDictionaryTerms(userId)
    ]);
    
    // すべての処理が成功したかチェック
    const success = results.every(result => result === true);
    
    if (success) {
      console.log('すべてのデータ作成が完了しました。');
      return true;
    } else {
      console.warn('一部のデータ作成に失敗しました。');
      return false;
    }
  } catch (error) {
    console.error(`エラーが発生しました: ${error}`);
    return false;
  }
};

// Node.js環境でのスクリプト実行用（ブラウザでは不要）
if (typeof module !== 'undefined') {
  module.exports = { createTestData };
}

// 実行
createTestData().then(result => {
  console.log(`テストデータ作成処理終了: ${result ? '成功' : '失敗'}`);
});