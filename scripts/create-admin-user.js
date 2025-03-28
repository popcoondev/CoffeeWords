/**
 * Firebase 管理者ユーザー作成スクリプト
 * 
 * このスクリプトは管理者ユーザーを作成し、必要な権限を付与します。
 * 
 * 使い方:
 * 1. node scripts/create-admin-user.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const readline = require('readline');

// Firebase Admin初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firestore参照を取得
const db = admin.firestore();
// Authentication参照を取得
const auth = admin.auth();

// CLIインターフェース
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * ユーザー入力を受け取る
 */
function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * 管理者ユーザー作成
 */
async function createAdminUser(email, password, displayName) {
  try {
    // ユーザーが既に存在するか確認
    try {
      const userRecord = await auth.getUserByEmail(email);
      console.log(`ユーザーは既に存在します: ${email} (${userRecord.uid})`);
      
      // カスタムクレームを設定（管理者権限）
      await auth.setCustomUserClaims(userRecord.uid, { admin: true });
      console.log(`管理者権限を付与しました: ${userRecord.uid}`);
      
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
        
        // カスタムクレームを設定（管理者権限）
        await auth.setCustomUserClaims(userRecord.uid, { admin: true });
        console.log(`管理者権限を付与しました: ${userRecord.uid}`);
        
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
        role: 'admin',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`ユーザープロファイルを更新しました: ${userId}`);
    } else {
      // 新しいユーザープロファイルを作成
      await userRef.set({
        ...userData,
        id: userId,
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`新しい管理者プロファイルを作成しました: ${userId}`);
    }
  } catch (error) {
    console.error('ユーザープロファイル作成エラー:', error);
    throw error;
  }
}

/**
 * インタラクティブに管理者ユーザーを作成
 */
async function createAdminUserInteractive() {
  try {
    console.log('Firebase 管理者ユーザー作成ツール');
    console.log('--------------------------------');
    
    const email = await promptUser('メールアドレスを入力してください: ');
    const password = await promptUser('パスワードを入力してください（8文字以上）: ');
    const displayName = await promptUser('表示名を入力してください: ');
    
    if (!email || !password || !displayName) {
      console.error('すべての情報を入力してください。');
      process.exit(1);
    }
    
    if (password.length < 8) {
      console.error('パスワードは8文字以上である必要があります。');
      process.exit(1);
    }
    
    // 管理者ユーザーの作成
    const adminUser = await createAdminUser(email, password, displayName);
    
    // 管理者プロファイルの作成
    await createUserProfile(adminUser.uid, {
      displayName,
      email,
      experienceLevel: 'advanced',
      photoURL: null
    });
    
    console.log(`管理者ユーザー ${email} の作成が完了しました。`);
  } catch (error) {
    console.error('管理者ユーザー作成エラー:', error);
  } finally {
    // CLIインターフェースを終了
    rl.close();
    // Firebase接続を終了
    process.exit(0);
  }
}

// スクリプト実行
createAdminUserInteractive();