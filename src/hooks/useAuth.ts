import { useEffect, useState, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import { useAuthStore } from '../store/useAuthStore';
import { auth } from '../services/firebase';
import { useFirestore } from './useFirestore';
import { User } from '../types';

/**
 * 認証機能のためのカスタムフック
 */
export const useAuth = () => {
  const { 
    user, 
    firebaseUser, 
    loading, 
    error, 
    initialized,
    setUser, 
    setFirebaseUser, 
    setLoading, 
    setError,
    setInitialized,
    signOut: storeSignOut
  } = useAuthStore();

  const [verifying, setVerifying] = useState(false);
  
  // Firestoreフックの初期化
  const {
    getDocument: getUser,
    setDocument: setUserDoc,
    updateDocument: updateUserDoc
  } = useFirestore<User>('users');

  /**
   * ユーザプロファイルを取得または作成
   */
  const getUserProfile = useCallback(async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      // Firestoreからユーザー情報を取得
      let userProfile = await getUser(firebaseUser.uid);
      
      // プロファイルが存在しない場合は新規作成
      if (!userProfile) {
        const userData: Partial<User> = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || undefined,
          experienceLevel: 'beginner'
        };
        
        await setUserDoc(firebaseUser.uid, userData as User);
        userProfile = await getUser(firebaseUser.uid);
      }
      
      return userProfile;
    } catch (err) {
      console.error('Error fetching/creating user profile:', err);
      setError(err instanceof Error ? err.message : 'ユーザープロファイルの取得に失敗しました');
      return null;
    }
  }, [getUser, setUserDoc]);

  // 認証状態の監視
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setFirebaseUser(fbUser);
          
          const userProfile = await getUserProfile(fbUser);
          setUser(userProfile);
        } else {
          setFirebaseUser(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    });
    
    return () => unsubscribe();
  }, []);

  /**
   * メール/パスワードでのサインアップ
   */
  const register = useCallback(async (
    email: string, 
    password: string, 
    displayName: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Firebase Authでユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      
      // Firebase Authプロファイル更新
      await updateProfile(fbUser, { displayName });
      
      // メール認証送信(オプション)
      // await sendEmailVerification(fbUser);
      
      // Firestoreのユーザードキュメント作成
      const userData: Partial<User> = {
        id: fbUser.uid,
        email: fbUser.email || '',
        displayName,
        experienceLevel: 'beginner',
      };
      
      await setUserDoc(fbUser.uid, userData as User);
      
      setFirebaseUser(fbUser);
      
      // ユーザープロファイル取得
      const userProfile = await getUser(fbUser.uid);
      setUser(userProfile);
      
      return true;
    } catch (error: any) {
      console.error('Register error:', error);
      
      // エラーメッセージをわかりやすく変換
      let message = 'アカウント作成に失敗しました';
      if (error.code === 'auth/email-already-in-use') {
        message = 'このメールアドレスは既に使用されています';
      } else if (error.code === 'auth/invalid-email') {
        message = 'メールアドレスの形式が正しくありません';
      } else if (error.code === 'auth/weak-password') {
        message = 'パスワードが弱すぎます。6文字以上のパスワードを設定してください';
      }
      
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUserDoc, getUser]);

  /**
   * メール/パスワードでのログイン
   */
  const login = useCallback(async (
    email: string, 
    password: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      setFirebaseUser(fbUser);
      
      // ユーザープロファイル取得
      const userProfile = await getUserProfile(fbUser);
      setUser(userProfile);
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // エラーメッセージをわかりやすく変換
      let message = 'ログインに失敗しました';
      if (error.code === 'auth/invalid-credential') {
        message = 'メールアドレスまたはパスワードが間違っています';
      } else if (error.code === 'auth/user-disabled') {
        message = 'このアカウントは無効化されています';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'ログイン試行回数が多すぎます。しばらく時間をおいてください';
      }
      
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getUserProfile]);

  /**
   * ログアウト
   */
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      storeSignOut();
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'ログアウトに失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  }, [storeSignOut]);

  /**
   * パスワードリセットメール送信
   */
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      let message = 'パスワードリセットメールの送信に失敗しました';
      if (error.code === 'auth/invalid-email') {
        message = 'メールアドレスの形式が正しくありません';
      } else if (error.code === 'auth/user-not-found') {
        message = 'このメールアドレスのユーザーが見つかりません';
      }
      
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * メールアドレス認証メール送信
   */
  const verifyEmail = useCallback(async (): Promise<boolean> => {
    if (!firebaseUser) {
      setError('ログインしていません');
      return false;
    }
    
    try {
      setVerifying(true);
      await sendEmailVerification(firebaseUser);
      return true;
    } catch (error: any) {
      console.error('Email verification error:', error);
      setError(error.message || 'メール認証の送信に失敗しました');
      return false;
    } finally {
      setVerifying(false);
    }
  }, [firebaseUser]);

  /**
   * プロフィール更新（名前、写真など）
   */
  const updateUserProfile = useCallback(async (
    userData: { displayName?: string; photoURL?: string; experienceLevel?: string }
  ): Promise<boolean> => {
    if (!firebaseUser || !user) {
      setError('ログインしていません');
      return false;
    }
    
    try {
      setLoading(true);
      
      // Firebase Authプロファイル更新 (displayName, photoURLのみ)
      const authUpdates: { displayName?: string; photoURL?: string } = {};
      if (userData.displayName) authUpdates.displayName = userData.displayName;
      if (userData.photoURL) authUpdates.photoURL = userData.photoURL;
      
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(firebaseUser, authUpdates);
      }
      
      // Firestoreユーザードキュメント更新
      await updateUserDoc(user.id, userData);
      
      // ローカルユーザー状態更新
      setUser({
        ...user,
        ...userData,
      });
      
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error);
      setError(error.message || 'プロフィールの更新に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, user, updateUserDoc]);

  /**
   * メールアドレス更新（再認証が必要）
   */
  const updateUserEmail = useCallback(async (
    currentPassword: string,
    newEmail: string
  ): Promise<boolean> => {
    if (!firebaseUser || !user) {
      setError('ログインしていません');
      return false;
    }
    
    try {
      setLoading(true);
      
      // 再認証
      const credential = EmailAuthProvider.credential(
        firebaseUser.email || '',
        currentPassword
      );
      
      await reauthenticateWithCredential(firebaseUser, credential);
      
      // メールアドレス更新
      await updateEmail(firebaseUser, newEmail);
      
      // Firestoreのデータも更新
      await updateUserDoc(user.id, { email: newEmail });
      
      // ローカルユーザー状態更新
      setUser({
        ...user,
        email: newEmail,
      });
      
      return true;
    } catch (error: any) {
      console.error('Update email error:', error);
      
      let message = 'メールアドレスの更新に失敗しました';
      if (error.code === 'auth/invalid-credential') {
        message = 'パスワードが間違っています';
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'このメールアドレスは既に使用されています';
      } else if (error.code === 'auth/invalid-email') {
        message = 'メールアドレスの形式が正しくありません';
      } else if (error.code === 'auth/requires-recent-login') {
        message = '再度ログインしてからお試しください';
      }
      
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, user, updateUserDoc]);

  /**
   * パスワード更新（再認証が必要）
   */
  const updateUserPassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!firebaseUser) {
      setError('ログインしていません');
      return false;
    }
    
    try {
      setLoading(true);
      
      // 再認証
      const credential = EmailAuthProvider.credential(
        firebaseUser.email || '',
        currentPassword
      );
      
      await reauthenticateWithCredential(firebaseUser, credential);
      
      // パスワード更新
      await updatePassword(firebaseUser, newPassword);
      
      return true;
    } catch (error: any) {
      console.error('Update password error:', error);
      
      let message = 'パスワードの更新に失敗しました';
      if (error.code === 'auth/invalid-credential') {
        message = '現在のパスワードが間違っています';
      } else if (error.code === 'auth/weak-password') {
        message = '新しいパスワードが弱すぎます。6文字以上のパスワードを設定してください';
      } else if (error.code === 'auth/requires-recent-login') {
        message = '再度ログインしてからお試しください';
      }
      
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  /**
   * アカウント削除（再認証が必要）
   */
  const deleteAccount = useCallback(async (
    password: string
  ): Promise<boolean> => {
    if (!firebaseUser || !user) {
      setError('ログインしていません');
      return false;
    }
    
    try {
      setLoading(true);
      
      // 再認証
      const credential = EmailAuthProvider.credential(
        firebaseUser.email || '',
        password
      );
      
      await reauthenticateWithCredential(firebaseUser, credential);
      
      // アカウント削除
      await deleteUser(firebaseUser);
      
      // ストアをクリア
      storeSignOut();
      
      return true;
    } catch (error: any) {
      console.error('Delete account error:', error);
      
      let message = 'アカウントの削除に失敗しました';
      if (error.code === 'auth/invalid-credential') {
        message = 'パスワードが間違っています';
      } else if (error.code === 'auth/requires-recent-login') {
        message = '再度ログインしてからお試しください';
      }
      
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, user, storeSignOut]);

  return {
    // 認証状態
    user,
    firebaseUser,
    loading,
    verifying,
    error,
    initialized,
    
    // 認証機能
    register,
    login,
    logout,
    resetPassword,
    verifyEmail,
    
    // プロファイル管理
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteAccount,
  };
};