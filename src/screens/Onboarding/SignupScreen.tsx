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

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const toast = useToast();
  const { register, loading, error } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    // 入力バリデーション
    if (!name.trim()) {
      toast.show({
        title: 'エラー',
        description: 'ニックネームを入力してください',
        status: 'error',
      });
      return;
    }

    if (!email.trim()) {
      toast.show({
        title: 'エラー',
        description: 'メールアドレスを入力してください',
        status: 'error',
      });
      return;
    }

    if (!password.trim()) {
      toast.show({
        title: 'エラー',
        description: 'パスワードを入力してください',
        status: 'error',
      });
      return;
    }

    if (password.length < 6) {
      toast.show({
        title: 'エラー',
        description: 'パスワードは6文字以上で設定してください',
        status: 'error',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.show({
        title: 'エラー',
        description: 'パスワードと確認用パスワードが一致しません',
        status: 'error',
      });
      return;
    }

    try {
      // サインアップ処理
      const success = await register(email.trim(), password, name.trim());
      if (success) {
        console.log('[Signup] サインアップ成功、体験レベル選択へ');
        
        // 体験レベル選択画面に遷移する強制的なリセット
        try {
          // 不要な遅延をなくして即座に実行
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: ROUTES.EXPERIENCE_LEVEL }],
          });
          
          // グローバルにリセットを試みる
          const nav = navigation.getParent() || navigation;
          nav.dispatch(resetAction);
          
          console.log('[Signup] 強制ナビゲーションリセット完了');
        } catch (navError) {
          console.error('[Signup] ナビゲーションエラー:', navError);
          
          // フォールバック: 通常のナビゲーション
          navigation.reset({
            index: 0,
            routes: [{ name: ROUTES.EXPERIENCE_LEVEL }],
          });
        }
      } else if (error) {
        toast.show({
          title: '登録エラー',
          description: error,
          status: 'error',
        });
      }
    } catch (err) {
      console.error('サインアップ処理エラー:', err);
      toast.show({
        title: '登録エラー',
        description: 'サインアップ処理中にエラーが発生しました。開発環境では、Firebaseが正しく設定されていない可能性があります。',
        status: 'error',
      });
    }
  };

  return (
    <Box flex={1} bg={COLORS.background.primary} p={6} safeArea>
      <VStack space={5} alignItems="center" justifyContent="center" flex={1}>
        <Box w="full" alignItems="center" mb={6}>
          <Heading size="xl" color={COLORS.primary[500]} mb={2}>
            アカウント作成
          </Heading>
          <Text fontSize="md" color={COLORS.text.secondary} textAlign="center">
            あなたのコーヒー体験を記録するアカウントを作成します
          </Text>
        </Box>

        <VStack space={4} w="full">
          <FormControl>
            <FormControl.Label>ニックネーム</FormControl.Label>
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
              value={name}
              onChangeText={setName}
              placeholder="あなたの名前またはニックネーム"
            />
          </FormControl>

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
                placeholder="6文字以上のパスワード"
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
          </FormControl>

          <FormControl>
            <FormControl.Label>パスワード（確認用）</FormControl.Label>
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
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="パスワードを再入力"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <Pressable 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                position="absolute"
                right={2}
                top="50%"
                style={{transform: [{translateY: -12}]}}
                p={2}
              >
                <Icon
                  as={Ionicons}
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  color={COLORS.text.light}
                  size="sm"
                />
              </Pressable>
            </Box>
          </FormControl>

          <Button
            mt={4}
            bg={COLORS.primary[500]}
            _pressed={{ bg: COLORS.primary[600] }}
            isLoading={loading}
            isLoadingText="登録中..."
            onPress={handleSignup}
          >
            アカウント作成
          </Button>
        </VStack>

        <HStack mt={6} space={1} justifyContent="center">
          <Text color={COLORS.text.secondary}>すでにアカウントをお持ちですか？</Text>
          <Link
            _text={{ color: COLORS.primary[500], fontWeight: 'medium' }}
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
          >
            ログイン
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

export default SignupScreen;