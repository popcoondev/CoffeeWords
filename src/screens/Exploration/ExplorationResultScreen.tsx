import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Box, VStack, Heading, Text, Button, HStack, Icon, Pressable, useToast, Spinner, Progress } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useExplorationStore } from '../../store/useExplorationStore';
import { ScreenProps, DecodeResult } from '../../types';
import { decodeCoffeeTaste } from '../../services/openai/api';
import DiscoveryCard from '../../components/discovery/DiscoveryCard';
import { createExploration } from '../../services/firebase/exploration';
import { useAuth } from '../../hooks/useAuth';

/**
 * 探検結果画面
 * コーヒーの解読結果を表示する
 */
const ExplorationResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();
  const { user } = useAuth();
  
  // パラメータから取得
  const { coffeeInfo, mapPosition, preferences, comparison } = route.params || {};
  
  // Exploration Store
  const { 
    decodeResult,
    setDecodeResult,
    setLoading,
    reset
  } = useExplorationStore();
  
  // ローカルステート
  const [isDecoding, setIsDecoding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // 進捗更新のシミュレーション
  useEffect(() => {
    if (isDecoding && !decodeResult) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (Math.random() * 5);
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [isDecoding, decodeResult]);
  
  // 解読実行
  useEffect(() => {
    if (!decodeResult && !isDecoding) {
      handleDecode();
    }
  }, []);
  
  // AIによる解読を実行
  const handleDecode = async () => {
    try {
      setIsDecoding(true);
      setProgress(0);
      
      // 入力データの準備
      const userInput = {
        coffeeInfo,
        mapPosition,
        preferences,
        comparison
      };
      
      // 解読APIの呼び出し
      const result = await decodeCoffeeTaste(userInput);
      
      // 結果をセット
      setDecodeResult(result);
      setProgress(100);
      
    } catch (error) {
      console.error('Decode error:', error);
      toast.show({
        title: "解読エラー",
        description: "コーヒーの解読中にエラーが発生しました",
        status: "error"
      });
    } finally {
      setIsDecoding(false);
    }
  };
  
  // 記録を保存
  const handleSave = async () => {
    if (!user || !decodeResult) return;
    
    try {
      setIsSaving(true);
      
      const explorationId = await createExploration(
        user.id,
        coffeeInfo,
        mapPosition,
        preferences,
        comparison,
        decodeResult
      );
      
      toast.show({
        title: "保存完了",
        description: "探検記録が保存されました",
        status: "success"
      });
      
      // ホーム画面に戻る
      reset(); // ストアをリセット
      navigation.navigate(ROUTES.HOME, { decodeResult });
      
    } catch (error) {
      console.error('Save error:', error);
      toast.show({
        title: "保存エラー",
        description: "記録の保存中にエラーが発生しました",
        status: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 辞書に追加
  const handleAddToDictionary = (discovery: any) => {
    // 翻訳辞書に追加
    navigation.navigate(ROUTES.DICTIONARY, { newDiscovery: discovery });
  };
  
  // 詳細表示
  const handleViewDetail = (discovery: any) => {
    // TODO: 発見詳細画面に遷移
    toast.show({
      title: "準備中",
      description: "この機能は近日公開予定です",
      status: "info"
    });
  };
  
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={navigation.goBack} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md">探検結果</Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>
      
      {isDecoding ? (
        // 解読中の表示
        <VStack flex={1} justifyContent="center" alignItems="center" space={6} px={6}>
          <Heading size="md" textAlign="center" color={COLORS.primary[500]}>
            コーヒーを解読中...
          </Heading>
          <Box w="full">
            <Progress value={progress} colorScheme="amber" size="lg" mb={4} />
            <HStack justifyContent="space-between">
              <Text fontSize="xs" color={COLORS.text.light}>データ収集</Text>
              <Text fontSize="xs" color={COLORS.text.light}>言語化</Text>
              <Text fontSize="xs" color={COLORS.text.light}>パターン分析</Text>
            </HStack>
          </Box>
          <VStack alignItems="center" px={10} space={4}>
            <Icon as={Ionicons} name="cafe" size="6xl" color={COLORS.primary[400]} />
            <Text textAlign="center" color={COLORS.text.secondary}>
              AIが味わいの特徴を解析し、あなた専用の翻訳結果を作成しています...
            </Text>
          </VStack>
        </VStack>
      ) : (
        // 結果表示
        <ScrollView flex={1} px={4} py={2}>
          {decodeResult ? (
            <VStack space={6}>
              {/* コーヒー情報 */}
              <Box w="full" rounded="lg" bg={COLORS.background.secondary} p={4}>
                <Text fontSize="lg" fontWeight="bold" color={COLORS.primary[500]} mb={2}>
                  {coffeeInfo.name}
                </Text>
                {coffeeInfo.roaster && (
                  <Text fontSize="sm" color={COLORS.text.secondary}>
                    焙煎: {coffeeInfo.roaster}
                  </Text>
                )}
              </Box>
              
              {/* プロの表現 */}
              <VStack space={3} bg="white" p={4} rounded="lg">
                <HStack alignItems="center" space={2}>
                  <Icon as={Ionicons} name="globe-outline" color={COLORS.primary[500]} />
                  <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
                    プロの言葉では
                  </Text>
                </HStack>
                <Text fontSize="md" color={COLORS.text.primary}>
                  {decodeResult.professionalDescription}
                </Text>
              </VStack>
              
              {/* あなた流の表現 */}
              <VStack space={3} bg="white" p={4} rounded="lg">
                <HStack alignItems="center" space={2}>
                  <Icon as={Ionicons} name="person-outline" color={COLORS.primary[500]} />
                  <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
                    あなた流に言うと
                  </Text>
                </HStack>
                <Text fontSize="md" color={COLORS.text.primary}>
                  {decodeResult.personalTranslation}
                </Text>
              </VStack>
              
              {/* 味わいプロファイル */}
              <VStack space={3} bg="white" p={4} rounded="lg">
                <HStack alignItems="center" space={2} mb={2}>
                  <Icon as={Ionicons} name="analytics-outline" color={COLORS.primary[500]} />
                  <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
                    味わいプロファイル
                  </Text>
                </HStack>
                
                {/* プロファイルグラフ */}
                {Object.entries(decodeResult.tasteProfile).map(([key, value]) => (
                  <VStack key={key} space={1} mb={2}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="sm" color={COLORS.text.secondary}>
                        {translateProfileKey(key)}
                      </Text>
                      <Text fontSize="xs" color={COLORS.text.light}>
                        {value}/5
                      </Text>
                    </HStack>
                    <Progress value={value * 20} colorScheme="amber" size="xs" />
                  </VStack>
                ))}
              </VStack>
              
              {/* 好みの傾向 */}
              <VStack space={3} bg="white" p={4} rounded="lg">
                <HStack alignItems="center" space={2}>
                  <Icon as={Ionicons} name="bulb-outline" color={COLORS.primary[500]} />
                  <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
                    あなたの好みの傾向
                  </Text>
                </HStack>
                <Text fontSize="md" color={COLORS.text.primary}>
                  {decodeResult.preferenceInsight}
                </Text>
              </VStack>
              
              {/* 発見カード */}
              <DiscoveryCard
                discovery={decodeResult.discoveredFlavor}
                onAddToDictionary={handleAddToDictionary}
                onViewDetail={handleViewDetail}
              />
              
              {/* 次の探検提案 */}
              <VStack space={3} bg="white" p={4} rounded="lg">
                <HStack alignItems="center" space={2}>
                  <Icon as={Ionicons} name="compass-outline" color={COLORS.primary[500]} />
                  <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
                    次の探検提案
                  </Text>
                </HStack>
                <Text fontSize="md" color={COLORS.text.primary}>
                  {decodeResult.nextExploration}
                </Text>
              </VStack>
            </VStack>
          ) : (
            <VStack space={4} alignItems="center" justifyContent="center" flex={1} mt={10}>
              <Icon as={Ionicons} name="alert-circle-outline" size="4xl" color={COLORS.semantic.warning} />
              <Text fontSize="md" color={COLORS.text.primary} textAlign="center">
                解読結果が見つかりません。もう一度試してください。
              </Text>
              <Button
                onPress={handleDecode}
                mt={4}
                leftIcon={<Icon as={Ionicons} name="refresh" size="sm" />}
              >
                再試行
              </Button>
            </VStack>
          )}
        </ScrollView>
      )}
      
      {/* 保存ボタン */}
      {!isDecoding && decodeResult && (
        <Box px={6} py={4} bg={COLORS.background.primary} borderTopWidth={1} borderTopColor={COLORS.background.secondary}>
          <Button
            onPress={handleSave}
            bg={COLORS.primary[500]}
            _pressed={{ bg: COLORS.primary[600] }}
            _text={{ color: 'white' }}
            isLoading={isSaving}
            isLoadingText="保存中..."
          >
            探検を記録する
          </Button>
        </Box>
      )}
    </Box>
  );
};

// プロファイルキーの翻訳
const translateProfileKey = (key: string): string => {
  const translations: Record<string, string> = {
    acidity: '酸味',
    sweetness: '甘み',
    bitterness: '苦味',
    body: 'ボディ',
    complexity: '複雑さ'
  };
  
  return translations[key] || key;
};

export default ExplorationResultScreen;