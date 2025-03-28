/**
 * テストデータ作成スクリプト
 * このスクリプトはFirebaseに以下のテストデータを作成します:
 * - テストユーザー
 * - 探検記録（コーヒーデータ）
 * - ミッション
 * - 辞書データ
 * 
 * 使用方法:
 * $ node scripts/create-test-data.js
 */

// .envファイルから環境変数を読み込む
require('dotenv').config();

// Firebase SDKの初期化
const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} = require('firebase/auth');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp, 
  Timestamp 
} = require('firebase/firestore');

// Firebase設定を環境変数から読み込む
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// 設定がない場合は表示して終了
if (!firebaseConfig.apiKey) {
  console.error('Firebase設定が見つかりません。.envファイルに正しい設定があることを確認してください。');
  console.error('以下の環境変数が必要です:');
  console.error('FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID');
  process.exit(1);
}

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// テストユーザー情報
const TEST_USERS = [
  {
    email: 'test1@example.com',
    password: 'password123',
    displayName: 'テストユーザー1',
    experienceLevel: 'beginner'
  },
  {
    email: 'test2@example.com',
    password: 'password123',
    displayName: 'テストユーザー2',
    experienceLevel: 'intermediate'
  },
  {
    email: 'test3@example.com',
    password: 'password123',
    displayName: 'テストユーザー3',
    experienceLevel: 'advanced'
  }
];

// ミッションデータ作成用関数
const createMissions = async (userId) => {
  console.log(`ユーザー ${userId} のミッションを作成します...`);
  
  try {
    // 現在の日時
    const now = new Date();
    
    // デイリーミッション
    await addDoc(collection(db, 'missions'), {
      userId: userId,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
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
    await addDoc(collection(db, 'missions'), {
      userId: userId,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)),
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
    await addDoc(collection(db, 'missions'), {
      userId: userId,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000)),
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
  } catch (error) {
    console.error(`ミッション作成中にエラーが発生しました: ${error}`);
  }
};

// 探検データ作成用関数
const createExplorations = async (userId) => {
  console.log(`ユーザー ${userId} の探検データを作成します...`);
  
  try {
    // 現在の日時
    const now = new Date();
    
    // エチオピア イルガチェフェ
    await addDoc(collection(db, 'explorations'), {
      userId: userId,
      createdAt: serverTimestamp(),
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
    
    // ブラジル セラード
    await addDoc(collection(db, 'explorations'), {
      userId: userId,
      createdAt: Timestamp.fromDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
      coffeeInfo: {
        name: 'ブラジル セラード',
        roaster: '丸山珈琲',
        origin: 'ブラジル',
        photoURL: 'https://example.com/coffee2.jpg'
      },
      tasteMapPosition: { x: 250, y: 300 },
      preferences: {
        overallRating: 3,
        likedPoints: ['コク', 'チョコレート感'],
        likedPointsDetail: '安定した味わいでチョコレートのような甘さが感じられた',
        dislikedPoints: ['単調さ'],
        dislikedPointsDetail: '少し特徴が薄く感じられた',
        wouldDrinkAgain: 3,
        drinkingScene: ['午後', '仕事中']
      },
      analysis: {
        professionalDescription: 'ナッツとチョコレート風味の低めの酸味とコクのあるバランスの取れたコーヒー。キャラメルのような甘さとスモーキーな後味が特徴。',
        personalTranslation: 'ナッツのような香ばしさとチョコレートのような甘さを感じる。どっしりとした飲み心地で、飲みやすい。',
        tasteProfile: {
          acidity: 2,
          sweetness: 3,
          bitterness: 3,
          body: 4,
          complexity: 2
        },
        preferenceInsight: 'バランスの取れたコーヒーも楽しめる傾向があります。特に香ばしさと甘みのバランスがよいコーヒーを好む傾向が見られます。',
        discoveredFlavor: {
          name: 'ナッツの香ばしさ',
          category: 'aroma',
          description: 'アーモンドやヘーゼルナッツを連想させる香ばしさ',
          rarity: 2,
          userInterpretation: '香ばしいクッキーのような香り'
        },
        nextExploration: 'コロンビア産のコーヒーも試してみると良いでしょう。ブラジルと似た安定感がありながらも、フルーティーさが加わって複雑さが増します。'
      }
    });
    
    console.log(`ユーザー ${userId} の探検データ作成に成功しました`);
  } catch (error) {
    console.error(`探検データ作成中にエラーが発生しました: ${error}`);
  }
};

// 辞書データ作成用関数
const createDictionaryTerms = async (userId) => {
  console.log(`ユーザー ${userId} の辞書データを作成します...`);
  
  try {
    // 現在の日時
    const now = new Date();
    
    // フルーティー
    await addDoc(collection(db, 'dictionary'), {
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      term: 'フルーティー',
      category: 'aroma',
      professionalDefinition: 'コーヒーの中に様々な果実の風味や香りが感じられる特徴。特に明るい酸味と共に現れることが多く、エチオピアやケニアなどのアフリカ産コーヒーに顕著。',
      personalInterpretation: '飲むとフルーツジュースのような爽やかさを感じる。特に酸味が明るいものに多い。',
      masteryLevel: 3,
      discoveryCount: 5,
      lastEncounteredAt: serverTimestamp(),
      firstDiscoveredAt: Timestamp.fromDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)),
      relatedCoffeeIds: [],
      relatedTerms: ['ベリー', 'シトラス', '酸味'],
      examples: ['エチオピア イルガチェフェ', 'ケニア ニエリ'],
      personalNotes: 'お気に入りの特徴の一つ。朝に飲むと気分が良い。',
      explorationStatus: 'learning'
    });
    
    // チョコレート感
    await addDoc(collection(db, 'dictionary'), {
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      term: 'チョコレート感',
      category: 'sweetness',
      professionalDefinition: 'コーヒーの中にカカオやチョコレートを思わせる風味や香り。中深煎りから深煎りのコーヒーに多く、甘さと苦味のバランスが特徴。',
      personalInterpretation: 'ダークチョコレートのような、甘さと苦さが混ざった風味。コクがあって飲みごたえを感じる。',
      masteryLevel: 2,
      discoveryCount: 3,
      lastEncounteredAt: serverTimestamp(),
      firstDiscoveredAt: Timestamp.fromDate(new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)),
      relatedCoffeeIds: [],
      relatedTerms: ['カカオ', 'ナッツ', 'コク'],
      examples: ['ブラジル セラード', 'グアテマラ アンティグア'],
      personalNotes: '午後や夕方に飲むのに良い。リラックスできる味わい。',
      explorationStatus: 'learning'
    });
    
    // 酸味
    await addDoc(collection(db, 'dictionary'), {
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      term: '酸味',
      category: 'acidity',
      professionalDefinition: 'コーヒーの基本的な味覚要素の一つ。爽やかさや生き生きとした印象を与え、品質の高いコーヒーには適切な酸味がある。浅煎りほど強く感じられる。',
      personalInterpretation: 'さわやかな刺激として感じる味わい。強すぎると酸っぱく、弱すぎると物足りない。',
      masteryLevel: 4,
      discoveryCount: 10,
      lastEncounteredAt: serverTimestamp(),
      firstDiscoveredAt: Timestamp.fromDate(new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)),
      relatedCoffeeIds: [],
      relatedTerms: ['シトラス', 'フルーティー', '明るさ'],
      examples: ['エチオピア イルガチェフェ', 'ケニア ニエリ', 'コロンビア ウイラ'],
      personalNotes: '好みの強さは中程度から強め。朝に飲むコーヒーには欠かせない要素。',
      explorationStatus: 'mastered'
    });
    
    console.log(`ユーザー ${userId} の辞書データ作成に成功しました`);
  } catch (error) {
    console.error(`辞書データ作成中にエラーが発生しました: ${error}`);
  }
};

// メイン処理
const main = async () => {
  try {
    // テストユーザーごとに処理
    for (const userData of TEST_USERS) {
      console.log(`ユーザー ${userData.email} の処理を開始します...`);
      
      let userId;
      
      try {
        // ユーザーを新規作成（既に存在する場合はエラーになる）
        console.log(`ユーザー ${userData.email} の作成を試みます...`);
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        userId = userCredential.user.uid;
        console.log(`ユーザー ${userData.email} を作成しました (ID: ${userId})`);
        
        // プロファイルデータをFirestoreに保存
        await setDoc(doc(db, 'users', userId), {
          id: userId,
          email: userData.email,
          displayName: userData.displayName,
          experienceLevel: userData.experienceLevel,
          createdAt: serverTimestamp()
        });
        console.log(`ユーザー ${userData.email} のプロファイルを作成しました`);
      } catch (error) {
        // ユーザーが既に存在する場合はサインインしてIDを取得
        if (error.code === 'auth/email-already-in-use') {
          console.log(`ユーザー ${userData.email} は既に存在します。サインインします...`);
          const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
          userId = userCredential.user.uid;
          console.log(`ユーザー ${userData.email} にサインインしました (ID: ${userId})`);
        } else {
          // その他のエラーがあれば表示してスキップ
          console.error(`ユーザー ${userData.email} の作成/サインインに失敗しました: ${error.message}`);
          continue;
        }
      }
      
      // 各種データを作成
      await createMissions(userId);
      await createExplorations(userId);
      await createDictionaryTerms(userId);
      
      console.log(`ユーザー ${userData.email} の処理が完了しました`);
    }
    
    console.log('すべてのデータ作成が完了しました。');
  } catch (error) {
    console.error(`エラーが発生しました: ${error}`);
  } finally {
    // 処理が終わったらアプリを終了
    process.exit(0);
  }
};

// スクリプトを実行
main().catch(error => {
  console.error('致命的なエラーが発生しました:', error);
  process.exit(1);
});