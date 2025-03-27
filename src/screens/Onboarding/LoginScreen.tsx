import React, { useState } from 'react';
import { Box, VStack, Heading, Text, FormControl, Button, HStack, Link, useToast, Icon, Pressable } from 'native-base';
import { TextInput } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const toast = useToast();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 現在のFirebaseモードを取得
  const firebaseMode = (global as any).__FIREBASE_REAL_MODE__ ? 'production' : 'mock';

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.show({
        title: 'エラー',
        description: 'メールアドレスとパスワードを入力してください',
        status: 'error',
      });
      return;
    }

    try {
      console.log('[Login] ログイン試行開始:', email);
      
      // グローバル変数の設定を強制
      (global as any).__FIREBASE_MODE__ = 'production';
      (global as any).__FIREBASE_MOCK_MODE__ = false;
      (global as any).__FIREBASE_REAL_MODE__ = true;
      
      const success = await login(email.trim(), password);
      
      if (success) {
        console.log('[Login] ログイン成功、メイン画面に遷移します');
        
        // Firebaseの認証状態を設定するため少し待つ
        setTimeout(() => {
          try {
            console.log('[Login] 強制的に今日の探索画面へ遷移');
          
            // 今日の探索画面(EXPLORATION_FLOW)に直接遷移
            navigation.dispatch(
              CommonActions.navigate({
                name: ROUTES.MAIN,
              })
            );
            
            // 少し待ってから探索画面へ
            setTimeout(() => {
              navigation.navigate(ROUTES.EXPLORATION_FLOW);
            }, 300);
            
          } catch (navError) {
            console.error('[Login] ナビゲーションエラー:', navError);
          
            // 最終手段: Appを再起動
            console.log('[Login] ナビゲーション失敗、最終手段を試行');
            alert('ログインに成功しました。アプリを再起動します。');
          }
        }, 500);
      } else if (error) {
        console.log('[Login] ログインエラー:', error);
        toast.show({
          title: 'ログインエラー',
          description: error,
          status: 'error',
        });
      }
    } catch (err) {
      console.error('[Login] ログイン処理エラー:', err);
      toast.show({
        title: 'ログインエラー',
        description: 'ログイン処理中にエラーが発生しました。インターネット接続を確認し、再度お試しください。',
        status: 'error',
      });
    }
  };

  const handleForgotPassword = () => {
    // パスワードリセット機能は将来実装予定
    toast.show({
      title: '準備中',
      description: 'パスワードリセット機能は近日公開予定です',
      status: 'info',
    });
  };

  return (
    <Box flex={1} bg={COLORS.background.primary} p={6} safeArea>
      <VStack space={5} alignItems="center" justifyContent="center" flex={1}>
        <Box w="full" alignItems="center" mb={6}>
          <Heading size="xl" color={COLORS.primary[500]} mb={2}>
            CoffeeWords
          </Heading>
          <Text fontSize="md" color={COLORS.text.secondary} textAlign="center">
            あなたのコーヒー体験を言葉にする
          </Text>
          <Text fontSize="xs" color={firebaseMode === 'production' ? COLORS.semantic.success : COLORS.semantic.warning} textAlign="center" mt={1}>
            {firebaseMode === 'production' ? '本番認証モード' : 'モック認証モード'}
          </Text>
        </Box>

        <VStack space={4} w="full">
          <FormControl>
            <FormControl.Label>メールアドレス</FormControl.Label>
            <TextInput
              style={{
                height: 48,
                borderWidth: 1,
                borderColor: COLORS.text.light + '40',
                borderRadius: 8,
                paddingHorizontal: 12,
                fontSize: 16,
                width: '100%',
                color: COLORS.text.primary
              }}
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>パスワード</FormControl.Label>
            <Box position="relative">
              <TextInput
                style={{
                  height: 48,
                  borderWidth: 1,
                  borderColor: COLORS.text.light + '40',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingRight: 40, // アイコンのスペース
                  fontSize: 16,
                  width: '100%',
                  color: COLORS.text.primary
                }}
                value={password}
                onChangeText={setPassword}
                placeholder="パスワード"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable 
                onPress={() => setShowPassword(!showPassword)}
                position="absolute"
                right={2}
                top="50%"
                style={{transform: [{translateY: -12}]}}
                p={2}
              >
                <Icon
                  as={Ionicons}
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  color={COLORS.text.light}
                  size="sm"
                />
              </Pressable>
            </Box>
            <Link
              alignSelf="flex-end"
              _text={{ color: COLORS.primary[500], fontSize: 'xs' }}
              onPress={handleForgotPassword}
              mt={1}
            >
              パスワードをお忘れですか？
            </Link>
          </FormControl>

          <Button
            mt={4}
            bg={COLORS.primary[500]}
            _pressed={{ bg: COLORS.primary[600] }}
            isLoading={loading}
            isLoadingText="ログイン中..."
            onPress={handleLogin}
          >
            ログイン
          </Button>
        </VStack>

        <HStack mt={6} space={1} justifyContent="center">
          <Text color={COLORS.text.secondary}>アカウントをお持ちでないですか？</Text>
          <Link
            _text={{ color: COLORS.primary[500], fontWeight: 'medium' }}
            onPress={() => navigation.navigate(ROUTES.SIGNUP)}
          >
            新規登録
          </Link>
        </HStack>

        <Button
          variant="ghost"
          colorScheme="primary"
          onPress={() => navigation.navigate(ROUTES.MAIN)}
          mt={4}
        >
          スキップ（体験モード）
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginScreen;