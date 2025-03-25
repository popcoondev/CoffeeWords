import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Platform } from 'react-native';
import { Box, VStack, Heading, Icon, HStack, Pressable, Text, ScrollView, Center, Spinner, useToast, Modal, FormControl } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../../components/ui/Button';
import { ChoiceButton } from '../../components/ui/ChoiceButton';
import { Tag } from '../../components/ui/Tag';
import { RootStackParamList } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';
import { useCoffeeRecord } from '../../hooks/useCoffeeRecord';
import { useCoffeeStorage } from '../../hooks/useCoffeeStorage';
import { useLanguageGeneration } from '../../hooks/useLanguageGeneration';

type CoffeeTasteNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CoffeeRecordFlow'>;

// 選択肢の設定
const bodyOptions = [
  { value: 'light', label: '軽い', icon: '🍃' },
  { value: 'medium', label: 'ミディアム', icon: '⚖️' },
  { value: 'heavy', label: '重い', icon: '🪨' },
];

const flavorOptions = [
  { value: 'fruity', label: '果実系', description: 'ベリー、柑橘類、トロピカルフルーツの風味' },
  { value: 'nutty', label: 'ナッツ系', description: 'アーモンド、ヘーゼルナッツ、ピーナッツの風味' },
  { value: 'chocolate', label: 'チョコレート系', description: 'カカオ、ダークチョコ、ミルクチョコの風味' },
  { value: 'floral', label: '花系', description: 'ジャスミン、バラ、オレンジブロッサムの風味' },
  { value: 'spicy', label: 'スパイス系', description: 'シナモン、ナツメグ、カルダモンの風味' },
];

const aftertasteOptions = [
  { value: 'short', label: '短い', description: '飲んだ後すぐに消える' },
  { value: 'medium', label: '中程度', description: '数秒間続く' },
  { value: 'long', label: '長い', description: '口の中に余韻が長く残る' },
];

const CoffeeTasteScreen: React.FC = () => {
  const navigation = useNavigation<CoffeeTasteNavigationProp>();
  const toast = useToast();
  
  // 従来のZustandのステート管理
  const {
    name,
    roaster,
    photoURL,
    body,
    flavor,
    aftertaste,
    setBody,
    setFlavor,
    setAftertaste,
    setLanguageResult,
    setTags,
    isSubmitting,
  } = useCoffeeRecord();
  
  // Firebase連携のためのフック (バックアップとして保持)
  const { loading: firebaseLoading, error: firebaseError } = useCoffeeStorage();
  
  // OpenAI APIを使った言語化生成フック
  const { 
    loading, 
    error, 
    result,
    hasKey,
    generateLanguage, 
    checkApiKey,
    setupApiKey
  } = useLanguageGeneration();
  
  // ローカルステート
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // APIキーチェック
  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (currentQuestion < 2) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleGenerateLanguage();
    }
  };

  // 複数選択の処理
  const handleFlavorToggle = (value: string) => {
    if (flavor.includes(value)) {
      setFlavor(flavor.filter(item => item !== value));
    } else {
      setFlavor([...flavor, value]);
    }
  };

  // APIキー設定モーダルのハンドラ
  const handleSaveApiKey = async () => {
    if (!apiKey || apiKey.length < 10) {
      toast.show({
        title: "エラー",
        description: "有効なAPIキーを入力してください",
        status: "error"
      });
      return;
    }
    
    const success = await setupApiKey(apiKey);
    if (success) {
      setShowApiKeyModal(false);
      setApiKey('');
      toast.show({
        title: "設定完了",
        description: "APIキーを設定しました",
        status: "success"
      });
    }
  };

  // 言語化生成
  const handleGenerateLanguage = async () => {
    // APIキーがない場合は設定モーダルを表示
    if (hasKey === false) {
      setShowApiKeyModal(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // OpenAI APIを使用して言語化を生成
      const responses = {
        body,
        flavor,
        aftertaste
      };
      
      const languageResult = await generateLanguage(responses);
      
      if (languageResult) {
        // 結果をZustandストアに保存
        try {
          if (typeof setLanguageResult === 'function') {
            setLanguageResult(languageResult.shortDescription);
            if (typeof setTags === 'function') {
              setTags(languageResult.tags || []);
            }
          } else {
            console.error("setLanguageResult is not a function", typeof setLanguageResult);
            // エラーが発生してもユーザー体験を中断しないようにする
            console.log("Using fallback values instead");
          }
        } catch (err) {
          console.error("Error setting language results:", err);
        }
        
        // 結果画面に遷移（エラーが発生しても遷移する）
        navigation.navigate(ROUTES.COFFEE_RECORD_RESULT);
        
        toast.show({
          title: "言語化完了",
          description: "あなたのコーヒー体験を言語化しました",
          status: "success"
        });
      } else {
        toast.show({
          title: "エラー",
          description: "言語化の生成に失敗しました。もう一度お試しください。",
          status: "error"
        });
      }
    } catch (error) {
      console.error("Language generation error:", error);
      toast.show({
        title: "エラー",
        description: error instanceof Error ? error.message : "言語化の生成に失敗しました",
        status: "error"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 現在の質問に応じたコンテンツをレンダリング
  const renderQuestionContent = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <VStack space={4}>
            <Heading size="md">
              <Text>このコーヒーは口の中でどのように感じましたか？</Text>
            </Heading>
            {bodyOptions.map((option) => (
              <ChoiceButton
                key={option.value}
                label={option.label}
                icon={option.icon}
                isSelected={body === option.value}
                onPress={() => setBody(option.value as any)}
              />
            ))}
          </VStack>
        );
      case 1:
        return (
          <VStack space={4}>
            <Heading size="md">
              <Text>どのような風味を感じましたか？（複数選択可）</Text>
            </Heading>
            {flavorOptions.map((option) => (
              <ChoiceButton
                key={option.value}
                label={option.label}
                description={option.description}
                isSelected={flavor.includes(option.value)}
                onPress={() => handleFlavorToggle(option.value)}
              />
            ))}
            {flavor.length > 0 && (
              <HStack flexWrap="wrap" mt={2}>
                {flavor.map((f) => {
                  const option = flavorOptions.find(opt => opt.value === f);
                  return (
                    <Tag
                      key={f}
                      label={option?.label || f}
                      onRemove={() => handleFlavorToggle(f)}
                    />
                  );
                })}
              </HStack>
            )}
          </VStack>
        );
      case 2:
        return (
          <VStack space={4}>
            <Heading size="md">
              <Text>味わいの余韻はどのくらい続きましたか？</Text>
            </Heading>
            {aftertasteOptions.map((option) => (
              <ChoiceButton
                key={option.value}
                label={option.label}
                description={option.description}
                isSelected={aftertaste === option.value}
                onPress={() => setAftertaste(option.value as any)}
              />
            ))}
          </VStack>
        );
      default:
        return null;
    }
  };

  // 次へボタンを無効にする条件
  const isNextDisabled = () => {
    switch (currentQuestion) {
      case 0:
        return body === null;
      case 1:
        return flavor.length === 0;
      case 2:
        return aftertaste === null;
      default:
        return false;
    }
  };

  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={handleBack} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md"><Text>質問 {currentQuestion + 1}/3</Text></Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>

      <ScrollView flex={1} px={6} py={4}>
        {renderQuestionContent()}
      </ScrollView>

      <Box px={6} py={4} bg={COLORS.background.primary}>
        {isGenerating || loading ? (
          <Center py={2}>
            <Spinner color={COLORS.primary[500]} size="lg" />
            <Text mt={2} color={COLORS.text.secondary}>言語化しています...</Text>
          </Center>
        ) : (
          <Button
            label={currentQuestion < 2 ? "次へ" : "結果を見る"}
            onPress={handleNext}
            isDisabled={isNextDisabled() || isSubmitting}
            opacity={isNextDisabled() || isSubmitting ? 0.5 : 1}
          />
        )}
      </Box>
      
      {/* OpenAI APIキー設定モーダル */}
      <Modal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header><Text>OpenAI APIキーの設定</Text></Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Text>
                コーヒー言語化機能を使用するには、OpenAI APIキーが必要です。
                APIキーをお持ちでない場合は、OpenAIのウェブサイトで取得してください。
              </Text>
              <FormControl isRequired>
                <FormControl.Label><Text>APIキー</Text></FormControl.Label>
                <Box borderWidth={1} borderColor={COLORS.primary[300]} borderRadius="md" p={2}>
                  <TextInput
                    value={apiKey}
                    onChangeText={setApiKey}
                    placeholder="sk-..."
                    secureTextEntry={true}
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                </Box>
                <FormControl.HelperText>
                  <Text>APIキーは端末内に安全に保存され、OpenAI以外には送信されません。</Text>
                </FormControl.HelperText>
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              label="キャンセル"
              variant="outline"
              onPress={() => setShowApiKeyModal(false)}
              mr={2}
            />
            <Button
              label="保存"
              onPress={handleSaveApiKey}
            />
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

// スタイル定義
const styles = StyleSheet.create({
  textInput: {
    padding: Platform.OS === 'ios' ? 8 : 0,
    color: COLORS.text.primary,
    fontSize: 16,
    width: '100%',
  }
});

export default CoffeeTasteScreen;