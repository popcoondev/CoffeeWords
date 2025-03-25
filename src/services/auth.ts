import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';
import { userAPI } from './api';
import { User } from '../types';

// サインアップ
export const signUp = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

// ログイン
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};

// ログアウト
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

// ユーザープロファイルの作成
export const createUserProfile = async (
  firebaseUser: FirebaseUser, 
  userData: Partial<User>
): Promise<void> => {
  try {
    await userAPI.createUser(firebaseUser.uid, {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      ...userData,
    });
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
};

// 認証状態リスナー
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