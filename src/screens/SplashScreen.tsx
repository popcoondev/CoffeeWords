import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Box, Text, VStack, Center, Spinner } from 'native-base';
import { useNavigation, CommonActions } from '@react-navigation/native';

import { ROUTES } from '../constants/routes';
import { COLORS } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

/**
 * スプラッシュ画面
 * アプリ起動時に表示され、認証状態を確認してから適切な画面に遷移する
 */
const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, loading, initialized, error } = useAuth();
  
  // 認証状態に基づいて適切な画面に遷移
  useEffect(() => {
    console.log('[SplashScreen] 認証状態チェック', { loading, initialized, hasUser: !!user });
    
    if (!initialized) {
      console.log('[SplashScreen] 認証初期化待機中...');
      return;
    }
    
    if (loading) {
      console.log('[SplashScreen] 認証情報読み込み中...');
      return;
    }
    
    // 遷移先を決定
    let nextRouteName = ROUTES.ONBOARDING;
    
    if (user) {
      console.log('[SplashScreen] ユーザー認証済み UID:', user.id);
      
      // 経験レベルが設定されていない場合はオンボーディングへ
      if (!user.experienceLevel) {
        console.log('[SplashScreen] 経験レベル未設定 -> 経験レベル設定画面へ');
        nextRouteName = ROUTES.EXPERIENCE_LEVEL;
      } else {
        // 認証済みかつ経験レベルも設定済みならメイン画面へ
        console.log('[SplashScreen] ユーザー設定完了 -> メイン画面へ');
        nextRouteName = ROUTES.MAIN;
      }
    } else {
      // 未認証の場合はオンボーディングへ
      console.log('[SplashScreen] 未認証 -> オンボーディング画面へ');
      nextRouteName = ROUTES.ONBOARDING;
    }
    
    console.log('[SplashScreen] 遷移先決定:', nextRouteName);
    
    // 1秒待ってから画面遷移（スプラッシュ画面を少し表示するため）
    const timer = setTimeout(() => {
      console.log('[SplashScreen] 画面遷移実行:', nextRouteName);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: nextRouteName }]
        })
      );
    }, 1000);
    
    // クリーンアップ
    return () => clearTimeout(timer);
  }, [navigation, user, loading, initialized]);
  
  return (
    <Box flex={1} bg={COLORS.primary[500]} safeArea justifyContent="center" alignItems="center">
      <VStack space={8} alignItems="center">
        {/* ロゴまたはアイコン */}
        <Image
          source={require('../../assets/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* アプリ名 */}
        <Text fontSize="3xl" fontWeight="bold" color="white">
          Coffee Words
        </Text>
        
        {/* ローディングインジケーター */}
        <Box mt={6}>
          <Spinner size="lg" color="white" />
        </Box>
        
        {/* 初期化エラーがある場合 */}
        {error && (
          <Box mt={4} px={4}>
            <Text color="white" textAlign="center">
              {error}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;