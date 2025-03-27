import { useEffect, useState, useCallback, useRef } from 'react';
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/useAuthStore';
import { auth, db } from '../services/firebase';
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

  // モック認証モードかどうかを確認
  const isMockAuthMode = () => {
    // 明示的に設定されていればその値を使用
    if (typeof (global as any).__FIREBASE_MOCK_MODE__ === 'boolean') {
      console.log('useAuth: モックモード設定値:', (global as any).__FIREBASE_MOCK_MODE__);
      return (global as any).__FIREBASE_MOCK_MODE__;
    }
    // 設定されていなければ本番モード
    console.log('useAuth: デフォルトモード設定 (本番)');
    return false;
  };

  // 開発環境用のモックユーザーを作成
  const createMockUser = useCallback((): User => {
    const mockUserId = 'mock-user-' + Math.random().toString(36).substring(2, 9);
    return {
      id: mockUserId,
      email: 'mock@example.com',
      displayName: 'モックユーザー',
      createdAt: new Date(),
      experienceLevel: 'beginner',
    };
  }, []);

  // 初期化状態を追跡する参照
  const initRef = useRef(false);
  
  // 認証状態の監視
  useEffect(() => {
    // 既に初期化済みの場合は実行しない（無限ループ防止）
    if (initRef.current) {
      console.log('[Auth] 既に初期化済み、認証監視をスキップ');
      return;
    }
    
    // 初期化フラグを設定
    initRef.current = true;
    
    console.log('[Auth] 認証状態の監視を開始');
    
    // 安全のため5秒後にローディング状態を強制解除するタイマーを設定
    const safetyTimer = setTimeout(() => {
      console.log('[Auth Safety] ローディング状態を強制解除');
      setLoading(false);
      setInitialized(true);
    }, 5000);
    
    // 現在のモードを確認 - ローカル関数として定義して依存関係を減らす
    const checkMockMode = () => {
      if (typeof (global as any).__FIREBASE_MOCK_MODE__ === 'boolean') {
        return (global as any).__FIREBASE_MOCK_MODE__;
      }
      return false; // デフォルトは本番モード
    };
    
    const mockMode = checkMockMode();
    console.log(`[Auth] 現在の認証モード: ${mockMode ? 'モック' : '本番'}`);
    
    // モックモードの場合はすぐに初期化完了
    if (mockMode) {
      console.log('[Auth Mock] モックモードでの初期化');
      
      // 未ログイン状態で初期化
      setFirebaseUser(null);
      setUser(null);
      setLoading(false);
      setInitialized(true);
      clearTimeout(safetyTimer);
      
      return () => clearTimeout(safetyTimer);
    }
    
    // 本番モードでの処理
    try {
      // 現在のユーザー状態を処理する関数
      const handleUser = (fbUser: FirebaseUser | null) => {
        console.log('[Auth] ユーザー状態処理:', fbUser ? `ログイン済み (${fbUser.uid})` : '未ログイン');
        
        // ユーザー状態の更新
        setFirebaseUser(fbUser);
        
        if (fbUser) {
          // getUserProfileの代わりに直接Firestoreから取得
          const getProfileDirectly = async (uid: string) => {
            try {
              // 直接Firestoreからユーザー情報を取得
              if (!db) {
                console.warn('[Auth] Firestoreが初期化されていません');
                return null;
              }
              
              // 明示的にモックモードの場合のみダミーデータを返す
              if ((global as any).__FIREBASE_MOCK_MODE__ === true) {
                console.log('[Auth] モックモードでダミーユーザー情報を返します');
                return {
                  id: uid,
                  email: fbUser.email || 'mock@example.com',
                  displayName: fbUser.displayName || 'モックユーザー',
                  createdAt: new Date(),
                  experienceLevel: 'beginner',
                };
              }
              
              try {
                const userDoc = await getDoc(doc(db, 'users', uid));
                if (userDoc.exists()) {
                  return userDoc.data() as User;
                }
                
                // ユーザードキュメントが存在しない場合は新規作成する
                console.log('[Auth] ユーザープロファイルが存在しないため新規作成します');
                const newUserData: User = {
                  id: uid,
                  email: fbUser.email || '',
                  displayName: fbUser.displayName || fbUser.email?.split('@')[0] || '名称未設定',
                  createdAt: new Date(),
                  experienceLevel: 'beginner',
                };
                
                try {
                  // ユーザードキュメントを作成
                  await setDoc(doc(db, 'users', uid), newUserData);
                  console.log('[Auth] 新規ユーザープロファイル作成成功:', uid);
                  return newUserData;
                } catch (createError) {
                  console.error('[Auth] 新規ユーザープロファイル作成エラー:', createError);
                  return newUserData; // エラーでも基本情報は返す
                }
              } catch (error) {
                console.error('[Auth] プロファイル取得エラー:', error);
                return null;
              }
            } catch (error) {
              console.error('[Auth] ユーザープロファイル取得エラー:', error);
              return null;
            }
          };
          
          // プロファイル取得
          getProfileDirectly(fbUser.uid)
            .then(userProfile => {
              if (userProfile) {
                console.log('[Auth] プロファイル取得成功');
                setUser(userProfile);
              } else {
                console.log('[Auth] プロファイル未取得、基本情報のみで作成');
                setUser({
                  id: fbUser.uid,
                  email: fbUser.email || '',
                  displayName: fbUser.displayName || fbUser.email?.split('@')[0] || '名称未設定',
                  createdAt: new Date(),
                  experienceLevel: 'beginner',
                });
              }
            })
            .catch(err => {
              console.error('[Auth] プロファイル取得エラー:', err);
              setUser({
                id: fbUser.uid,
                email: fbUser.email || '',
                displayName: fbUser.displayName || fbUser.email?.split('@')[0] || '名称未設定',
                createdAt: new Date(),
                experienceLevel: 'beginner',
              });
            })
            .finally(() => {
              console.log('[Auth] 認証処理完了');
              setLoading(false);
              setInitialized(true);
            });
        } else {
          // 未ログイン状態
          setUser(null);
          setLoading(false);
          setInitialized(true);
        }
      };
      
      if (!auth) {
        console.error('[Auth] Firebase Authが初期化されていません');
        setError('認証サービスが初期化されていません');
        setFirebaseUser(null);
        setUser(null);
        setLoading(false);
        setInitialized(true);
        return () => clearTimeout(safetyTimer);
      }
      
      // 現在のユーザー状態を取得
      const currentUser = auth.currentUser;
      
      // 認証状態の監視を設定
      const unsubscribe = onAuthStateChanged(
        auth, 
        handleUser,
        (error) => {
          console.error('[Auth] 監視エラー:', error);
          setError(error instanceof Error ? error.message : '認証状態の監視中にエラーが発生しました');
          setLoading(false);
          setInitialized(true);
        }
      );
      
      // 初回実行（現在のユーザー状態を即座に反映）
      handleUser(currentUser);
      
      // クリーンアップ
      return () => {
        unsubscribe();
        clearTimeout(safetyTimer);
      };
    } catch (error) {
      console.error('[Auth] 初期化エラー:', error);
      setError('認証システムの初期化に失敗しました');
      setLoading(false);
      setInitialized(true);
      return () => clearTimeout(safetyTimer);
    }
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
      
      // モックモードの場合
      if (isMockAuthMode()) {
        console.log('[Auth Mock] サインアップ処理:', email, displayName);
        
        // モックユーザー作成
        const mockUser: User = {
          id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
          email,
          displayName,
          createdAt: new Date(),
          experienceLevel: 'beginner',
        };
        
        // モック認証ユーザーを設定
        const mockFbUser = {
          uid: mockUser.id,
          email: mockUser.email,
          displayName: mockUser.displayName,
          emailVerified: true,
        } as FirebaseUser;
        
        setFirebaseUser(mockFbUser);
        setUser(mockUser);
        
        return true;
      }
      
      // 実際のFirebase Authでユーザー作成
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
      
      // 現在のモードを確認
      const mockMode = isMockAuthMode();
      console.log(`[Auth] ログイン試行: ${email} (モックモード: ${mockMode})`);
      
      // モックモードの場合
      if (mockMode) {
        console.log('[Auth Mock] モックユーザーでログイン処理開始');
        
        // モックユーザー作成
        const mockUser: User = {
          id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
          email,
          displayName: email.split('@')[0],
          createdAt: new Date(),
          experienceLevel: 'beginner',
        };
        
        // モック認証ユーザーを設定
        const mockFbUser = {
          uid: mockUser.id,
          email: mockUser.email,
          displayName: mockUser.displayName,
          emailVerified: true,
          toJSON: () => ({}),
          delete: () => Promise.resolve(),
          getIdToken: () => Promise.resolve('mock-id-token'),
          getIdTokenResult: () => Promise.resolve({
            token: 'mock-id-token',
            signInProvider: 'password',
            expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
            issuedAtTime: new Date().toISOString(),
            authTime: new Date().toISOString(),
            claims: { user_id: mockUser.id },
          }),
          reload: () => Promise.resolve(),
        } as unknown as FirebaseUser;
        
        // 状態を更新
        setFirebaseUser(mockFbUser);
        setUser(mockUser);
        
        console.log('[Auth Mock] モックユーザーでログイン成功:', mockUser.id);
        return true;
      }
      
      // 実際のFirebase Authでログイン
      try {
        console.log('[Auth] 本番モードでログイン試行');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        
        console.log('[Auth] Firebase認証成功:', fbUser.uid);
        setFirebaseUser(fbUser);
        
        try {
          // ユーザープロファイル取得
          console.log('[Auth] ユーザープロファイル取得開始');
          const userProfile = await getUserProfile(fbUser);
          console.log('[Auth] ユーザープロファイル取得完了:', userProfile ? 'success' : 'failed');
          setUser(userProfile);
          
          return true;
        } catch (profileError) {
          console.error('[Auth] プロファイル取得エラー:', profileError);
          // プロファイル取得に失敗しても認証自体は成功しているので、基本情報だけで続行
          setUser({
            id: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || email.split('@')[0],
            createdAt: new Date(),
            experienceLevel: 'beginner',
          });
          return true;
        }
      } catch (firebaseError: any) {
        console.error('[Auth] Firebase認証エラー:', firebaseError);
        
        // モックモードが明示的に設定されている場合のみフォールバック
        if ((global as any).__FIREBASE_MOCK_MODE__ === true) {
          console.log('[Auth] モックモードのため、フォールバックユーザーを使用');
          
          // フォールバック用のモックユーザーを作成
          const fallbackUser: User = {
            id: 'fallback-user-' + Math.random().toString(36).substring(2, 9),
            email,
            displayName: `${email.split('@')[0]} (モック)`,
            createdAt: new Date(),
            experienceLevel: 'beginner',
          };
          
          // フォールバック用のモック認証ユーザーを設定
          const fallbackFbUser = {
            uid: fallbackUser.id,
            email: fallbackUser.email,
            displayName: fallbackUser.displayName,
            emailVerified: true,
            toJSON: () => ({}),
            delete: () => Promise.resolve(),
            getIdToken: () => Promise.resolve('mock-id-token'),
            getIdTokenResult: () => Promise.resolve({
              token: 'mock-id-token',
              signInProvider: 'password',
              expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
              issuedAtTime: new Date().toISOString(),
              authTime: new Date().toISOString(),
              claims: { user_id: fallbackUser.id },
            }),
            reload: () => Promise.resolve(),
          } as unknown as FirebaseUser;
          
          setFirebaseUser(fallbackFbUser);
          setUser(fallbackUser);
          
          console.log('[Auth] モックユーザーでログイン成功:', fallbackUser.id);
          return true;
        }
        
        // エラーメッセージをわかりやすく変換
        let message = 'ログインに失敗しました';
        if (firebaseError.code === 'auth/invalid-credential') {
          message = 'メールアドレスまたはパスワードが間違っています';
        } else if (firebaseError.code === 'auth/user-disabled') {
          message = 'このアカウントは無効化されています';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          message = 'ログイン試行回数が多すぎます。しばらく時間をおいてください';
        } else if (firebaseError.code === 'auth/network-request-failed') {
          message = 'ネットワークエラーが発生しました。接続を確認して再試行してください';
        }
        
        setError(message);
        return false;
      }
    } catch (error: any) {
      console.error('[Auth] 予期せぬエラー:', error);
      setError('予期せぬエラーが発生しました。もう一度お試しください');
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
      
      // モックモードの場合
      if (isMockAuthMode()) {
        console.log('[Auth Mock] ログアウト処理');
        storeSignOut();
        return true;
      }
      
      // 実際のFirebase Authでログアウト
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