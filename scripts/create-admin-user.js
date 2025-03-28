/**
 * テストユーザー作成スクリプト
 * 
 * このスクリプトは、Firebase Authenticationを使用して
 * テスト用のユーザーアカウントを作成します。
 * 
 * 使用方法:
 * 1. アプリをローカルで実行
 * 2. コンソールにこのスクリプトをコピーして実行
 */

// テストユーザー情報
const TEST_USER = {
  email: 'admin@example.com',
  password: 'admin123',
  displayName: '管理者ユーザー',
  experienceLevel: 'advanced'
};

// ユーザー作成関数
const createAdminUser = async () => {
  try {
    console.log('管理者ユーザー作成を開始します...');
    
    // Firebaseがすでに初期化されているか確認
    let auth, db;
    try {
      auth = firebase.auth();
      db = firebase.firestore();
    } catch (error) {
      console.error('Firebase SDKが見つかりません。このスクリプトはFirebase SDKが初期化されているアプリ内で実行する必要があります。', error);
      return false;
    }
    
    // ユーザー作成ロジック
    let userId;
    
    try {
      // 既存のユーザーかどうかをチェック
      try {
        console.log(`ユーザー ${TEST_USER.email} でログイン試行...`);
        const userCredential = await auth.signInWithEmailAndPassword(TEST_USER.email, TEST_USER.password);
        userId = userCredential.user.uid;
        console.log(`既存ユーザー ${TEST_USER.email} でログインしました (ID: ${userId})`);
        return { success: true, userId, message: `既存ユーザー ${TEST_USER.email} でログインしました` };
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
          return { success: true, userId, message: `ユーザー ${TEST_USER.email} を新規作成しました` };
        } else {
          throw loginError;
        }
      }
    } catch (error) {
      console.error(`ユーザー処理中にエラーが発生しました: ${error}`);
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error(`予期せぬエラーが発生しました: ${error}`);
    return { success: false, error: error.message };
  }
};

// Node.js環境でのスクリプト実行用（ブラウザでは不要）
if (typeof module !== 'undefined') {
  module.exports = { createAdminUser };
}

// ブラウザで実行
if (typeof window !== 'undefined') {
  createAdminUser().then(result => {
    console.log('結果:', result);
    alert(`ユーザー作成${result.success ? '成功' : '失敗'}: ${result.message || result.error}`);
  });
}