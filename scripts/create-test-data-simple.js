/**
 * Firebase テストデータ作成スクリプト (シンプル版)
 * 
 * このスクリプトは、Firebase Admin SDKなしで直接Firebaseクライアント側APIを使用して
 * テストユーザーとミッションデータを作成します。
 * 
 * 使い方:
 * 1. node scripts/create-test-data-simple.js
 */

// Firebase APIをインポート
const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword,
  signOut
} = require('firebase/auth');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  serverTimestamp
} = require('firebase/firestore');

// Firebase設定
// 注: 環境変数の設定値を使用
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDEXsG6pd0s8iSPF8UUmrMqH-b85i2oEcM",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "coffee-words.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "coffee-words",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "coffee-words.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "788877142970",
  appId: process.env.FIREBASE_APP_ID || "1:788877142970:web:75cbe62ad77e5ab8c98b83",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-J470SREX25",
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// テストユーザー作成
async function createTestUser() {
  const email = 'test1@example.com';
  const password = 'password123';
  const displayName = 'テストユーザー1';
  
  try {
    // 新規ユーザー作成を試みる
    console.log(`新規ユーザーを作成します: ${email}`);
    
    try {
      // 新規ユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(`新規ユーザー作成成功: ${userCredential.user.uid}`);
      
      // ユーザープロファイル作成
      await createUserProfile(userCredential.user.uid, {
        displayName,
        email,
        experienceLevel: 'beginner',
      });
      
      // テスト用ミッション作成
      await createTestMissions(userCredential.user.uid);
      
      // 念のためサインアウト
      await signOut(auth);
      
      return userCredential.user;
    } catch (error) {
      // ユーザーが既に存在する場合
      if (error.code === 'auth/email-already-in-use') {
        console.log('ユーザーは既に存在します。テストミッションのみを作成します。');
        
        // ユーザーIDを生成 (既存ユーザーと同じIDにするため)
        const userId = Buffer.from(email).toString('hex');
        console.log(`既存ユーザーの推定ID: ${userId}`);
        
        // テスト用ミッション作成
        await createTestMissions(userId);
        
        return { uid: userId, email };
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('テストユーザー作成エラー:', error);
    throw error;
  }
}

// ユーザープロファイル作成
async function createUserProfile(userId, userData) {
  try {
    console.log(`ユーザープロファイルを作成/更新: ${userId}`);
    
    // Firestoreにユーザードキュメントを作成
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`ユーザープロファイル作成/更新完了: ${userId}`);
  } catch (error) {
    console.error('ユーザープロファイル作成エラー:', error);
    throw error;
  }
}

// テスト用ミッション作成
async function createTestMissions(userId) {
  try {
    const now = new Date();
    
    // デイリーミッション
    console.log('デイリーミッション作成中...');
    await addDoc(collection(db, 'missions'), {
      userId,
      title: '今日のコーヒー探検',
      description: '今日飲んだコーヒーの記録を登録しましょう。定期的な記録は味覚を育てます。',
      difficulty: 'beginner',
      type: 'daily',
      objectives: {
        specificTask: '今日飲んだコーヒーを記録する'
      },
      status: 'active',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1日前
      expiresAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6日後
      reward: {
        experiencePoints: 5
      },
      relatedCoffeeRecommendations: [],
      helpTips: ['普段飲み慣れているコーヒーでも、じっくり味わうと新しい発見があるかもしれません']
    });
    
    // 発見ミッション
    console.log('発見ミッション作成中...');
    await addDoc(collection(db, 'missions'), {
      userId,
      title: '酸味と甘みのバランスを探す',
      description: '酸味と甘みのバランスが良いコーヒーを見つけて記録しましょう。バランスの取れた味わいは、多くのコーヒー愛好家に親しまれています。',
      difficulty: 'beginner',
      type: 'discovery',
      objectives: {
        targetFlavorCategory: 'acidity',
        specificTask: '酸味と甘みのバランスが取れたコーヒーを探す'
      },
      status: 'active',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2日前
      expiresAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5日後
      reward: {
        experiencePoints: 10
      },
      relatedCoffeeRecommendations: ['エチオピア イルガチェフェ', 'グアテマラ アンティグア'],
      helpTips: ['浅煎りのコーヒーを探してみましょう', '準備中の豆を確認してみましょう']
    });
    
    // 比較ミッション
    console.log('比較ミッション作成中...');
    await addDoc(collection(db, 'missions'), {
      userId,
      title: 'フルーティーな味わいを比較する',
      description: '異なる産地のフルーティーなコーヒーを2種類飲み比べて、それぞれの違いを記録しましょう。味覚の比較は理解を深めます。',
      difficulty: 'intermediate',
      type: 'comparison',
      objectives: {
        targetFlavorCategory: 'aroma',
        specificTask: 'フルーティーな風味を持つ異なる2種類のコーヒーを比較する'
      },
      status: 'active',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3日前
      expiresAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4日後
      reward: {
        experiencePoints: 25,
        badgeId: 'taste-explorer'
      },
      relatedCoffeeRecommendations: ['ケニア ニエリ', 'エチオピア シダモ', 'コロンビア ウイラ'],
      helpTips: ['一つは果実のような風味のあるエチオピア産がおすすめです', '時間を空けずに飲み比べると違いが分かりやすいです']
    });
    
    console.log('テスト用ミッション作成完了');
  } catch (error) {
    console.error('テスト用ミッション作成エラー:', error);
    throw error;
  }
}

// メイン実行関数
async function main() {
  try {
    console.log('テストデータ作成開始...');
    
    // テストユーザー作成
    const user = await createTestUser();
    
    console.log('テストデータ作成完了!');
    console.log('------------------------');
    console.log('テストユーザー情報:');
    console.log('メールアドレス: test1@example.com');
    console.log('パスワード: password123');
    console.log('ユーザーID:', user.uid);
    console.log('------------------------');
    console.log('このアカウントでログインし、「今日の探検ミッション」を確認できます。');
    
    // 終了
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
main();