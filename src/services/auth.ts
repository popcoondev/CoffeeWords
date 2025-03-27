import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import { userAPI } from './api';
import { User } from '../types';

/**
 * モック認証モードかどうかを確認
 * グローバル変数が設定されていない場合はデフォルトで本番モード
 */
const isMockAuthMode = () => {
  // 明示的に設定されていればその値を使用
  if (typeof (global as any).__FIREBASE_MOCK_MODE__ === 'boolean') {
    return (global as any).__FIREBASE_MOCK_MODE__;
  }
  // 設定されていなければ本番モード
  return false;
};

/**
 * サインアップ
 */
export const signUp = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<FirebaseUser> => {
  try {
    // モック認証モードの場合
    if (isMockAuthMode()) {
      console.log('[Auth Mock] メール/パスワードで新規登録:', email, displayName);
      const userCredential = createMockUserCredential(email, displayName);
      return userCredential.user;
    }

    // 実際のFirebase認証
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 表示名が指定されている場合は設定
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

/**
 * ログイン
 */
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    // モック認証モードの場合
    if (isMockAuthMode()) {
      console.log('[Auth Mock] メール/パスワードでログイン:', email);
      const userCredential = createMockUserCredential(email);
      return userCredential.user;
    }

    // 実際のFirebase認証
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};

/**
 * ログアウト
 */
export const signOut = async (): Promise<void> => {
  try {
    // モック認証モードの場合
    if (isMockAuthMode()) {
      console.log('[Auth Mock] ログアウト');
      return;
    }

    // 実際のFirebase認証
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

/**
 * ユーザープロファイルの作成
 */
export const createUserProfile = async (
  firebaseUser: FirebaseUser, 
  userData: Partial<User>
): Promise<void> => {
  try {
    // モック認証モードの場合
    if (isMockAuthMode()) {
      console.log('[Auth Mock] ユーザープロファイル作成:', firebaseUser.uid, userData);
      return;
    }

    // 実際のFirebase Firestoreへの保存
    await userAPI.createUser(firebaseUser.uid, {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: new Date(),
      ...userData,
    });
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
};

/**
 * 認証状態リスナー
 */
export const authStateListener = (
  onUserAuthenticated: (user: FirebaseUser) => void,
  onUserNotAuthenticated: () => void
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      onUserAuthenticated(user);
    } else {
      onUserNotAuthenticated();
    }
  });
};

/**
 * ユーザーが認証されているか確認
 */
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

/**
 * 現在のユーザーを取得
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * 開発環境用のモックユーザーを生成
 */
const createMockUserCredential = (email: string, displayName?: string): UserCredential => {
  const mockUser = {
    uid: 'mock-user-' + Math.random().toString(36).substring(2, 10),
    email,
    displayName: displayName || email.split('@')[0],
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    providerData: [
      {
        providerId: 'password',
        uid: email,
        displayName: displayName || email.split('@')[0],
        email,
        phoneNumber: null,
        photoURL: null,
      }
    ],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: () => Promise.resolve(),
    getIdToken: () => Promise.resolve('mock-id-token'),
    getIdTokenResult: () => Promise.resolve({
      token: 'mock-id-token',
      signInProvider: 'password',
      expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      authTime: new Date().toISOString(),
      claims: {
        user_id: 'mock-user-id',
      },
    }),
    reload: () => Promise.resolve(),
    toJSON: () => ({}),
  } as unknown as FirebaseUser;

  return {
    user: mockUser,
    providerId: 'password',
    operationType: 'signIn',
  } as UserCredential;
};