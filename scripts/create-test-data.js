/**
 * Firebase テストデータ作成スクリプト
 * 
 * 使い方:
 * 1. node scripts/create-test-data.js
 * 
 * このスクリプトは以下を行います：
 * 1. Firebase Adminを使用してテストユーザーを作成
 * 2. Firestoreにテスト用ミッションデータを追加
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Firebase Admin初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firestore参照を取得
const db = admin.firestore();
// Authentication参照を取得
const auth = admin.auth();

/**
 * テストユーザー作成
 */
async function createTestUser(email, password, displayName) {
  try {
    // ユーザーが既に存在するか確認
    try {
      const userRecord = await auth.getUserByEmail(email);
      console.log(`ユーザーは既に存在します: ${email} (${userRecord.uid})`);
      return userRecord;
    } catch (error) {
      // ユーザーが存在しない場合は新規作成
      if (error.code === 'auth/user-not-found') {
        const userRecord = await auth.createUser({
          email,
          password,
          displayName,
          emailVerified: true,
        });
        console.log(`新しいユーザーを作成しました: ${email} (${userRecord.uid})`);
        return userRecord;
      }
      throw error;
    }
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    throw error;
  }
}

/**
 * ユーザープロフィール作成
 */
async function createUserProfile(userId, userData) {
  try {
    // ユーザードキュメントが既に存在するか確認
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    
    if (doc.exists) {
      // 既存のユーザープロファイルを更新
      await userRef.update({
        ...userData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`ユーザープロファイルを更新しました: ${userId}`);
    } else {
      // 新しいユーザープロファイルを作成
      await userRef.set({
        ...userData,
        id: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`新しいユーザープロファイルを作成しました: ${userId}`);
    }
  } catch (error) {
    console.error('ユーザープロファイル作成エラー:', error);
    throw error;
  }
}

/**
 * ミッションデータ作成
 */
async function createMission(missionData) {
  try {
    // ミッションコレクションに追加
    const missionRef = await db.collection('missions').add({
      ...missionData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(missionData.expiresAt)
    });
    
    console.log(`新しいミッションを作成しました: ${missionRef.id}`);
    return missionRef.id;
  } catch (error) {
    console.error('ミッション作成エラー:', error);
    throw error;
  }
}

/**
 * テストデータの作成を実行
 */
async function createTestData() {
  try {
    // 1. テストユーザーの作成
    const testUser = await createTestUser(
      'test@example.com', 
      'password123', 
      'テストユーザー'
    );
    
    // 2. ユーザープロファイルの作成
    await createUserProfile(testUser.uid, {
      displayName: 'テストユーザー',
      email: 'test@example.com',
      experienceLevel: 'beginner',
      photoURL: null
    });
    
    // 3. テスト用ミッションの作成
    const now = new Date();
    
    // 日次ミッション
    await createMission({
      userId: testUser.uid,
      title: '今日のコーヒー探検',
      description: '今日飲んだコーヒーの記録を登録しましょう。定期的な記録は味覚を育てます。',
      difficulty: 'beginner',
      type: 'daily',
      objectives: {
        specificTask: '今日飲んだコーヒーを記録する'
      },
      status: 'active',
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1週間後
      reward: {
        experiencePoints: 5
      },
      relatedCoffeeRecommendations: [],
      helpTips: ['普段飲み慣れているコーヒーでも、じっくり味わうと新しい発見があるかもしれません']
    });
    
    // 発見ミッション
    await createMission({
      userId: testUser.uid,
      title: '酸味と甘みのバランスを探す',
      description: '酸味と甘みのバランスが良いコーヒーを見つけて記録しましょう。バランスの取れた味わいは、多くのコーヒー愛好家に親しまれています。',
      difficulty: 'beginner',
      type: 'discovery',
      objectives: {
        targetFlavorCategory: 'acidity',
        specificTask: '酸味と甘みのバランスが取れたコーヒーを探す'
      },
      status: 'active',
      expiresAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10日後
      reward: {
        experiencePoints: 10
      },
      relatedCoffeeRecommendations: ['エチオピア イルガチェフェ', 'グアテマラ アンティグア'],
      helpTips: ['浅煎りのコーヒーを探してみましょう', '異なる抽出方法を試してみましょう']
    });
    
    // 比較ミッション
    await createMission({
      userId: testUser.uid,
      title: 'フルーティーな味わいを比較する',
      description: '異なる産地のフルーティーなコーヒーを2種類飲み比べて、それぞれの違いを記録しましょう。味覚の比較は理解を深めます。',
      difficulty: 'intermediate',
      type: 'comparison',
      objectives: {
        targetFlavorCategory: 'aroma',
        specificTask: 'フルーティーな風味を持つ異なる2種類のコーヒーを比較する'
      },
      status: 'active',
      expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2週間後
      reward: {
        experiencePoints: 25,
        badgeId: 'taste-explorer'
      },
      relatedCoffeeRecommendations: ['ケニア ニエリ', 'エチオピア シダモ', 'コロンビア ウイラ'],
      helpTips: ['一つは果実のような風味のあるエチオピア産がおすすめです', '時間を空けずに飲み比べると違いが分かりやすいです']
    });
    
    console.log('テストデータの作成が完了しました。');
  } catch (error) {
    console.error('テストデータ作成エラー:', error);
  } finally {
    // Firebase接続を終了
    process.exit(0);
  }
}

// スクリプト実行
createTestData();