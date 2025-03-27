import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Box, Center, Text, Spinner, VStack } from 'native-base';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { RootStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';

// ナビゲーション型定義
type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

/**
 * スプラッシュ画面
 * アプリ起動時の初期化処理とユーザー認証状態の確認を行う
 */
const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { user, initialized, loading } = useAuth();

  // マウント時に実行する処理
  useEffect(() => {
    console.log('[Splash] スプラッシュ画面表示');
    
    // タイマーを設定して一定時間後に画面遷移
    const timer = setTimeout(() => {
      console.log('[Splash] タイマー経過、画面遷移判定 (initialized:', initialized, ', loading:', loading, ')');
      
      if (initialized) {
        // 認証状態に基づいて適切な画面に遷移
        console.log('[Splash] 認証状態確認:', !!user);
        
        let targetRoute;
        if (user) {
          // ユーザーがログイン済みの場合
          console.log('[Splash] ユーザーログイン済み:', user.id);
          
          if (!user.experienceLevel) {
            // 経験レベルが未設定の場合は経験レベル設定画面へ
            console.log('[Splash] 経験レベル未設定、経験レベル設定画面へ');
            targetRoute = ROUTES.EXPERIENCE_LEVEL;
          } else {
            // 経験レベルが設定済みの場合はメイン画面へ
            console.log('[Splash] メイン画面へ遷移');
            targetRoute = ROUTES.MAIN;
          }
        } else {
          // 未ログインの場合はオンボーディング画面へ
          console.log('[Splash] 未ログイン、オンボーディング画面へ');
          targetRoute = ROUTES.ONBOARDING;
        }
        
        // 画面遷移の実行
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: targetRoute }],
          })
        );
        
        console.log(`[Splash] 画面遷移完了: ${targetRoute}`);
      } else {
        // 初期化未完了の場合は一定時間後に強制遷移
        console.log('[Splash] 初期化未完了、5秒後に強制遷移');
        
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: ROUTES.ONBOARDING }],
            })
          );
          console.log('[Splash] 強制遷移実行: オンボーディング画面');
        }, 5000);
      }
    }, 2000); // 2秒間スプラッシュ画面を表示
    
    return () => clearTimeout(timer);
  }, [user, initialized, loading, navigation]);

  return (
    <Box flex={1} bg={COLORS.background.primary}>
      <Center flex={1}>
        <VStack space={8} alignItems="center">
          <Image
            source={require('../../assets/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color={COLORS.primary[500]}
          >
            CoffeeWords
          </Text>
          <Text fontSize="md" color={COLORS.text.secondary} mb={4}>
            あなたのコーヒー体験を言葉にする
          </Text>
          <Box mt={4}>
            <Spinner size="lg" color={COLORS.primary[500]} />
            <Text fontSize="xs" color={COLORS.text.light} mt={6} textAlign="center">
              初期化中...
            </Text>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};

// スタイル定義
const styles = StyleSheet.create({
  logo: {
    width: 160,
    height: 160,
  },
});

export default SplashScreen;