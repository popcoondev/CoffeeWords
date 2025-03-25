import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authStateListener, signIn, signUp, signOut as authSignOut, createUserProfile } from '../services/auth';
import { userAPI } from '../services/api';

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

  // 認証状態の監視
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = authStateListener(
      async (firebaseUser) => {
        setFirebaseUser(firebaseUser);
        
        try {
          const userProfile = await userAPI.getUser(firebaseUser.uid);
          setUser(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('ユーザープロファイルの取得に失敗しました');
        }
        
        setLoading(false);
        setInitialized(true);
      },
      () => {
        setFirebaseUser(null);
        setUser(null);
        setLoading(false);
        setInitialized(true);
      }
    );
    
    return () => unsubscribe();
  }, []);

  // ログイン関数
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const fbUser = await signIn(email, password);
      setFirebaseUser(fbUser);
      
      const userProfile = await userAPI.getUser(fbUser.uid);
      setUser(userProfile);
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'ログインに失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // サインアップ関数
  const register = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      const fbUser = await signUp(email, password);
      setFirebaseUser(fbUser);
      
      // ユーザープロファイルの作成
      await createUserProfile(fbUser, {
        displayName,
        experienceLevel: 'beginner',
      });
      
      const userProfile = await userAPI.getUser(fbUser.uid);
      setUser(userProfile);
      
      return true;
    } catch (error: any) {
      console.error('Register error:', error);
      setError(error.message || 'アカウント作成に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト関数
  const logout = async () => {
    try {
      setLoading(true);
      await authSignOut();
      storeSignOut();
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'ログアウトに失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    firebaseUser,
    loading,
    error,
    initialized,
    login,
    register,
    logout,
  };
};