import React, { useState } from 'react';
import { Box, VStack, Heading, Icon, HStack, Pressable, Text, ScrollView, Center, Spinner, useToast } from 'native-base';
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
  
  // Firebase連携のためのフック
  const { generateLanguage, loading: firebaseLoading, error: firebaseError } = useCoffeeStorage();
  
  // ローカルステート
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // 言語化生成
  const handleGenerateLanguage = async () => {
    setIsGenerating(true);
    
    try {
      // Firebase AIサービスを使用して言語化を生成
      const responses = {
        body,
        flavor,
        aftertaste
      };
      
      const result = await generateLanguage(responses);
      
      if (result) {
        // 結果をZustandストアに保存
        setLanguageResult(result.text);
        setTags(result.tags || []);
        
        // 結果画面に遷移
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
        description: firebaseError || "言語化の生成に失敗しました",
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
              このコーヒーは口の中でどのように感じましたか？
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
              どのような風味を感じましたか？（複数選択可）
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
              味わいの余韻はどのくらい続きましたか？
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
        <Heading size="md">質問 {currentQuestion + 1}/3</Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>

      <ScrollView flex={1} px={6} py={4}>
        {renderQuestionContent()}
      </ScrollView>

      <Box px={6} py={4} bg={COLORS.background.primary}>
        {isGenerating ? (
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
    </Box>
  );
};

export default CoffeeTasteScreen;