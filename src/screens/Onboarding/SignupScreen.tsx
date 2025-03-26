import React, { useState } from 'react';
import { Box, VStack, Heading, Text, FormControl, Input, Button, HStack, Link, useToast, Icon, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
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

    // サインアップ処理
    const success = await register(email.trim(), password, name.trim());
    if (success) {
      // サインアップ成功、体験レベル選択へ
      navigation.navigate(ROUTES.EXPERIENCE_LEVEL);
    } else if (error) {
      toast.show({
        title: '登録エラー',
        description: error,
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
            <Input
              value={name}
              onChangeText={setName}
              placeholder="あなたの名前またはニックネーム"
              borderColor={COLORS.text.light + '40'}
              _focus={{ borderColor: COLORS.primary[500] }}
              size="lg"
              leftElement={
                <Icon
                  as={Ionicons}
                  name="person-outline"
                  color={COLORS.text.light}
                  size="sm"
                  ml={2}
                />
              }
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>メールアドレス</FormControl.Label>
            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              borderColor={COLORS.text.light + '40'}
              _focus={{ borderColor: COLORS.primary[500] }}
              size="lg"
              leftElement={
                <Icon
                  as={Ionicons}
                  name="mail-outline"
                  color={COLORS.text.light}
                  size="sm"
                  ml={2}
                />
              }
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>パスワード</FormControl.Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChangeText={setPassword}
              placeholder="6文字以上のパスワード"
              borderColor={COLORS.text.light + '40'}
              _focus={{ borderColor: COLORS.primary[500] }}
              size="lg"
              leftElement={
                <Icon
                  as={Ionicons}
                  name="lock-closed-outline"
                  color={COLORS.text.light}
                  size="sm"
                  ml={2}
                />
              }
              rightElement={
                <Pressable onPress={() => setShowPassword(!showPassword)} mr={2}>
                  <Icon
                    as={Ionicons}
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    color={COLORS.text.light}
                    size="sm"
                  />
                </Pressable>
              }
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>パスワード（確認用）</FormControl.Label>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="パスワードを再入力"
              borderColor={COLORS.text.light + '40'}
              _focus={{ borderColor: COLORS.primary[500] }}
              size="lg"
              leftElement={
                <Icon
                  as={Ionicons}
                  name="shield-checkmark-outline"
                  color={COLORS.text.light}
                  size="sm"
                  ml={2}
                />
              }
              rightElement={
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} mr={2}>
                  <Icon
                    as={Ionicons}
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    color={COLORS.text.light}
                    size="sm"
                  />
                </Pressable>
              }
            />
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