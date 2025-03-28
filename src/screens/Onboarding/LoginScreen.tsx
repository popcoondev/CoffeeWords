import React, { useState } from 'react';
import { Box, VStack, Heading, Text, FormControl, Button, HStack, Link, useToast, Icon, Pressable } from 'native-base';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
      // 開発環境ではメール/パスワード認証をバイパスする
      if (__DEV__) {
        console.log('開発環境: 認証バイパス');
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.MAIN }],
        });
        return;
      }
      
      const success = await login(email.trim(), password);
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.MAIN }],
        });
      } else if (error) {
        toast.show({
          title: 'ログインエラー',
          description: error,
          status: 'error',
        });
      }
    } catch (err) {
      console.error('ログイン処理エラー:', err);
      toast.show({
        title: 'ログインエラー',
        description: 'ログイン処理中にエラーが発生しました。開発環境では、Firebaseが正しく設定されていない可能性があります。',
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