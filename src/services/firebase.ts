import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// environment variables (from react-native-dotenv)
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MODE
} from '@env';

// Firebase設定値を読み込み、ログ出力
console.log('環境変数読み込み状況:');
console.log('FIREBASE_API_KEY:', FIREBASE_API_KEY ? '設定あり' : '未設定');
console.log('FIREBASE_AUTH_DOMAIN:', FIREBASE_AUTH_DOMAIN ? '設定あり' : '未設定');
console.log('FIREBASE_PROJECT_ID:', FIREBASE_PROJECT_ID ? '設定あり' : '未設定');
console.log('FIREBASE_MODE:', FIREBASE_MODE || '未設定');

// Firebase設定
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Firebaseモードの設定
// グローバル変数の設定状況を確認
console.log('Firebase認証モードの現在値:', (global as any).__FIREBASE_MODE__);

// FIREBASE_MODE環境変数を取得
const envFirebaseMode = FIREBASE_MODE || process.env.FIREBASE_MODE;
console.log('FIREBASE_MODE環境変数:', envFirebaseMode || 'なし');

// モードを決定:
// 1. グローバル変数が既に設定されている場合はそれを優先
// 2. 環境変数がある場合はそれを使用
// 3. 何もなければ常に本番モードをデフォルトに
let firebaseMode;
if ((global as any).__FIREBASE_MODE__ !== undefined) {
  firebaseMode = (global as any).__FIREBASE_MODE__;
  console.log('グローバル変数の設定値を使用:', firebaseMode);
} else if (envFirebaseMode) {
  firebaseMode = envFirebaseMode;
  console.log('環境変数の設定値を使用:', firebaseMode);
} else {
  firebaseMode = 'production';
  console.log('デフォルト値を使用（本番モード）:', firebaseMode);
}

// 設定をグローバル変数に保存
(global as any).__FIREBASE_MODE__ = firebaseMode;
(global as any).__FIREBASE_MOCK_MODE__ = firebaseMode === 'mock';
(global as any).__FIREBASE_REAL_MODE__ = firebaseMode === 'production';

console.log(`Firebase mode設定完了: ${firebaseMode}`);
console.log('モックモード:', (global as any).__FIREBASE_MOCK_MODE__);
console.log('本番モード:', (global as any).__FIREBASE_REAL_MODE__);

// モードに応じたログ出力
const currentMode = (global as any).__FIREBASE_MODE__;
if ((global as any).__FIREBASE_MOCK_MODE__) {
  console.warn('FirebaseモックモードでAPIを実行します。実際のFirebase操作はシミュレートされます。');
} else if ((global as any).__FIREBASE_REAL_MODE__) {
  console.log('Firebase本番モードでAPIを実行します。実際のFirebaseサービスに接続します。');
} else {
  console.warn(`不明なFirebaseモード「${currentMode}」です。'mock'または'production'を指定してください。`);
  // デフォルトはモックモード
  (global as any).__FIREBASE_MOCK_MODE__ = true;
  (global as any).__FIREBASE_REAL_MODE__ = false;
}

// モックモードかどうかを確認
const isMockMode = (global as any).__FIREBASE_MOCK_MODE__ === true;

// 設定値が存在するかチェック (少なくともapiKeyとprojectIdは必須)
const isConfigIncomplete = !firebaseConfig.apiKey || !firebaseConfig.projectId;

// モックモードの場合は常にダミー値を設定
if (isMockMode) {
  console.log('モックモード: ダミーのFirebase設定を使用します');
  
  // 必要なFirebase設定値のダミー値を設定
  firebaseConfig.apiKey = 'DUMMY_API_KEY_FOR_DEV';
  firebaseConfig.authDomain = 'dummy-app.firebaseapp.com';
  firebaseConfig.projectId = 'dummy-project-id';
  firebaseConfig.storageBucket = 'dummy-app.appspot.com';
  firebaseConfig.messagingSenderId = '000000000000';
  firebaseConfig.appId = '1:000000000000:web:0000000000000000000000';
} else if (isConfigIncomplete) {
  // 本番モードで設定が不完全な場合
  console.error(
    'Firebase設定が不完全です。環境変数が正しく設定されているか確認してください。\n' +
    'モックモードに切り替えるには設定画面で変更してアプリを再起動してください。\n' +
    '詳細: https://firebase.google.com/docs/web/setup'
  );
  
  // エラーをスローせず、ダミー値で初期化（アプリがクラッシュするのを防ぐため）
  if (!firebaseConfig.apiKey) firebaseConfig.apiKey = 'INVALID_API_KEY';
  if (!firebaseConfig.projectId) firebaseConfig.projectId = 'invalid-project-id';
}

// デバッグ用に設定値をログ出力（※APIキー先頭5文字だけ表示し、安全に）
console.log('Firebase Config Values:');
console.log('API Key:', firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 5)}...` : 'undefined');
console.log('Auth Domain:', firebaseConfig.authDomain || 'undefined');
console.log('Project ID:', firebaseConfig.projectId || 'undefined');
console.log('Storage Bucket:', firebaseConfig.storageBucket || 'undefined');

// Firebaseの初期化
import { getApps, getApp } from 'firebase/app';

let app;
try {
  // 既に初期化されている場合は既存のアプリを使用
  if (getApps().length > 0) {
    console.log('Firebase: 既存のアプリインスタンスを使用します');
    app = getApp();
  } else {
    console.log('Firebase: 新しいアプリインスタンスを初期化します');
    app = initializeApp(firebaseConfig);
  }
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // エラーをスローせずに続行（開発環境では）
  if (__DEV__) {
    console.warn('Firebase initialization failed in development mode, continuing with limited functionality');
    // 既に初期化されている場合は既存のアプリを使用（エラー回避のため）
    try {
      app = getApps().length > 0 ? getApp() : undefined;
    } catch (innerError) {
      console.error('Could not get existing Firebase app:', innerError);
    }
  } else {
    throw error;  // 本番環境ではエラーをスロー
  }
}

// 各サービスのエクスポート
let auth, db, storage, functions;

try {
  if (!app) {
    console.error('Firebase app is undefined, cannot initialize Auth');
    auth = undefined;
  } else {
    try {
      // Firebaseアプリからauthオブジェクトを取得
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });
      console.log('Firebase Auth initialized successfully');
    } catch (authError) {
      console.error('Firebase Auth initialization error:', authError);
      
      // 開発環境ではエラーをキャッチして続行
      if (__DEV__) {
        console.warn('Auth initialization failed in dev mode, using mock authentication');
        // モックモードに切り替え
        (global as any).__FIREBASE_MOCK_MODE__ = true;
        (global as any).__FIREBASE_REAL_MODE__ = false;
      } else {
        throw authError;  // 本番環境ではエラーをスロー
      }
    }
  }
} catch (error) {
  console.error('Firebase Auth setup error:', error);
  
  // 開発環境では続行
  if (__DEV__) {
    console.warn('Continuing with mock authentication due to error');
    // モックモードに切り替え
    (global as any).__FIREBASE_MOCK_MODE__ = true;
    (global as any).__FIREBASE_REAL_MODE__ = false;
  } else {
    throw error;  // 本番環境ではエラーをスロー
  }
}

try {
  if (app) {
    db = getFirestore(app);
    console.log('Firebase Firestore initialized successfully');
  } else {
    console.warn('Firebase app is undefined, cannot initialize Firestore');
  }
} catch (error) {
  console.error('Firebase Firestore initialization error:', error);
  // 開発環境では続行
  if (!__DEV__) throw error;
}

try {
  if (app) {
    storage = getStorage(app);
    console.log('Firebase Storage initialized successfully');
  } else {
    console.warn('Firebase app is undefined, cannot initialize Storage');
  }
} catch (error) {
  console.error('Firebase Storage initialization error:', error);
  // 開発環境では続行
  if (!__DEV__) throw error;
}

try {
  if (app) {
    functions = getFunctions(app);
    console.log('Firebase Functions initialized successfully');
  } else {
    console.warn('Firebase app is undefined, cannot initialize Functions');
  }
} catch (error) {
  console.error('Firebase Functions initialization error:', error);
  // 開発環境では続行
  if (!__DEV__) throw error;
}

export { auth, db, storage, functions };

// Analyticsのサポートチェック
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(error => console.log('Analytics not supported:', error));

export { analytics };

export default app;