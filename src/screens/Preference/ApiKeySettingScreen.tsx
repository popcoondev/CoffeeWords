import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Icon, 
  HStack, 
  Pressable, 
  Text, 
  ScrollView,
  FormControl,
  Switch,
  Center,
  Spinner,
  Button as NativeBaseButton,
  useToast,
  Divider
} from 'native-base';
import { TextInput, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

import { Button } from '../../components/ui/Button';
import { RootStackParamList } from '../../types';
import { COLORS } from '../../constants/theme';
import { useLanguageGeneration } from '../../hooks/useLanguageGeneration';

type ApiKeyNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

const ApiKeySettingScreen: React.FC = () => {
  const navigation = useNavigation<ApiKeyNavigationProp>();
  const toast = useToast();
  
  const { 
    hasKey, 
    setupApiKey, 
    clearApiKey, 
    checkApiKey,
    loading
  } = useLanguageGeneration();
  
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 初期状態をチェック
  useEffect(() => {
    const checkKey = async () => {
      setIsLoading(true);
      await checkApiKey();
      setIsLoading(false);
    };
    
    checkKey();
  }, [checkApiKey]);
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const saveApiKey = async () => {
    if (!apiKey || apiKey.length < 10) {
      toast.show({
        title: "エラー",
        description: "有効なAPIキーを入力してください",
        status: "error"
      });
      return;
    }
    
    setIsLoading(true);
    const success = await setupApiKey(apiKey);
    setIsLoading(false);
    
    if (success) {
      setApiKey('');
      toast.show({
        title: "設定完了",
        description: "APIキーを保存しました",
        status: "success"
      });
    }
  };
  
  const deleteApiKey = async () => {
    setIsLoading(true);
    const success = await clearApiKey();
    setIsLoading(false);
    
    if (success) {
      toast.show({
        title: "削除完了",
        description: "APIキーを削除しました",
        status: "success"
      });
    }
  };
  
  const openOpenAiWebsite = () => {
    Linking.openURL('https://platform.openai.com/api-keys');
  };
  
  if (isLoading || loading) {
    return (
      <Box flex={1} bg={COLORS.background.primary} safeArea>
        <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
          <Pressable onPress={handleBack} hitSlop={8} p={2}>
            <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
          </Pressable>
          <Heading size="md">OpenAI API設定</Heading>
          <Box w={10} /> {/* バランスを取るための空のボックス */}
        </HStack>
        
        <Center flex={1}>
          <Spinner color={COLORS.primary[500]} size="lg" />
          <Text mt={2} color={COLORS.text.secondary}>読み込み中...</Text>
        </Center>
      </Box>
    );
  }
  
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={handleBack} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md">OpenAI API設定</Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>
      
      <ScrollView flex={1} px={6} py={4}>
        <VStack space={6}>
          {/* 説明セクション */}
          <VStack space={3}>
            <Heading size="sm">OpenAI APIキーについて</Heading>
            <Text>
              コーヒー言語化機能を利用するには、OpenAI APIキーが必要です。
              APIキーはあなたの端末内に安全に保存され、OpenAI以外の第三者には送信されません。
            </Text>
            
            <HStack space={2} alignItems="center" mt={2}>
              <Icon as={Ionicons} name="information-circle" color={COLORS.primary[500]} />
              <Text italic fontSize="sm">
                APIキーの詳細と取得方法は
                <Text underline color={COLORS.primary[500]} onPress={openOpenAiWebsite}>
                  OpenAIの公式サイト
                </Text>
                をご確認ください。
              </Text>
            </HStack>
          </VStack>
          
          <Divider />
          
          {/* 現在のステータス */}
          <VStack space={3}>
            <Heading size="sm">現在のステータス</Heading>
            <HStack alignItems="center" space={2}>
              <Icon 
                as={Ionicons} 
                name={hasKey ? "checkmark-circle" : "close-circle"} 
                color={hasKey ? COLORS.success : COLORS.error} 
                size="md" 
              />
              <Text>{hasKey ? "APIキーが設定されています" : "APIキーが設定されていません"}</Text>
            </HStack>
          </VStack>
          
          {/* APIキー入力フォーム */}
          <VStack space={3}>
            <Heading size="sm">{hasKey ? "APIキーを更新" : "APIキーを設定"}</Heading>
            <FormControl>
              <FormControl.Label>APIキー</FormControl.Label>
              <Box 
                borderWidth={1} 
                borderRadius="md"
                borderColor={COLORS.text.light}
              >
                <TextInput
                  style={styles.input}
                  value={apiKey}
                  onChangeText={setApiKey}
                  placeholder="sk-..."
                  secureTextEntry={!showApiKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                  fontFamily="monospace"
                />
              </Box>
              <FormControl.HelperText>
                接頭辞「sk-」で始まるOpenAI APIキーを入力してください
              </FormControl.HelperText>
            </FormControl>
            
            <HStack alignItems="center" space={2}>
              <Switch
                isChecked={showApiKey}
                onToggle={() => setShowApiKey(!showApiKey)}
                colorScheme="primary"
              />
              <Text>{showApiKey ? "キーを隠す" : "キーを表示"}</Text>
            </HStack>
            
            <Button
              label="APIキーを保存"
              onPress={saveApiKey}
              isDisabled={!apiKey}
              mt={2}
            />
          </VStack>
          
          {/* 削除ボタン */}
          {hasKey && (
            <VStack space={3} mt={4}>
              <Divider />
              <Heading size="sm">APIキーの削除</Heading>
              <Text color={COLORS.text.secondary}>
                APIキーを削除すると、コーヒー言語化機能が使用できなくなります。
              </Text>
              <NativeBaseButton
                onPress={deleteApiKey}
                colorScheme="danger"
                variant="outline"
                leftIcon={<Icon as={Ionicons} name="trash" size="sm" />}
              >
                APIキーを削除
              </NativeBaseButton>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    color: COLORS.text.primary,
    width: '100%',
    fontFamily: 'monospace',
  }
});

export default ApiKeySettingScreen;