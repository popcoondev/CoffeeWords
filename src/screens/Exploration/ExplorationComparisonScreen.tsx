import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Box, VStack, Heading, Text, Button, HStack, Icon, Pressable, useToast, Radio, TextArea } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useExplorationStore } from '../../store/useExplorationStore';
import { ScreenProps, CoffeeExploration } from '../../types';
import { getExploration } from '../../services/firebase/exploration';

/**
 * 探検比較画面
 * 以前のコーヒー記録と比較する
 */
const ExplorationComparisonScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();
  
  // パラメータから取得
  const { coffeeInfo, mapPosition, preferences, comparedToId } = route.params || {};
  
  // Exploration Store
  const { 
    comparison, 
    setComparison 
  } = useExplorationStore();
  
  // 以前のコーヒー記録
  const [previousCoffee, setPreviousCoffee] = useState<CoffeeExploration | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 比較するコーヒーの取得
  useEffect(() => {
    if (comparedToId) {
      fetchPreviousCoffee(comparedToId);
    }
  }, [comparedToId]);
  
  const fetchPreviousCoffee = async (id: string) => {
    try {
      setLoading(true);
      const coffeeData = await getExploration(id);
      setPreviousCoffee(coffeeData);
    } catch (error) {
      console.error('Error fetching previous coffee:', error);
      toast.show({
        title: "エラー",
        description: "以前のコーヒー記録の取得に失敗しました",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 戻るボタン
  const handleBack = () => {
    navigation.goBack();
  };
  
  // 好み比較の変更
  const handlePreferenceComparedChange = (value: string) => {
    const preferenceCompared = value as 'better' | 'same' | 'worse';
    setComparison({
      ...comparison,
      comparedToId,
      preferenceCompared
    });
  };
  
  // 違いの説明の変更
  const handleDifferencesChange = (text: string) => {
    setComparison({
      ...comparison,
      comparedToId,
      notedDifferences: text
    });
  };
  
  // 次へボタン
  const handleNext = () => {
    if (!comparison || !comparison.preferenceCompared) {
      toast.show({
        title: "必須項目",
        description: "好み比較を選択してください",
        status: "warning"
      });
      return;
    }
    
    // 解読リクエストへ進む
    navigation.navigate(ROUTES.EXPLORATION_RESULT, {
      coffeeInfo,
      mapPosition,
      preferences,
      comparison,
      // decodeResultは次の画面で取得する
    });
  };
  
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={handleBack} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md">比較</Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>
      
      <ScrollView flex={1} px={4} py={2}>
        <VStack space={6}>
          {/* 現在のコーヒー */}
          <Box w="full" rounded="lg" bg={COLORS.background.secondary} p={4}>
            <HStack alignItems="center" space={2} mb={1}>
              <Icon as={Ionicons} name="cafe" color={COLORS.primary[500]} />
              <Text fontSize="sm" color={COLORS.text.secondary}>今回のコーヒー</Text>
            </HStack>
            <Text fontSize="lg" fontWeight="bold" color={COLORS.primary[500]} mb={1}>
              {coffeeInfo.name}
            </Text>
            {coffeeInfo.roaster && (
              <Text fontSize="sm" color={COLORS.text.secondary}>
                焙煎: {coffeeInfo.roaster}
              </Text>
            )}
          </Box>
          
          {/* 以前のコーヒー */}
          <Box w="full" rounded="lg" bg={COLORS.background.secondary} p={4}>
            <HStack alignItems="center" space={2} mb={1}>
              <Icon as={Ionicons} name="time-outline" color={COLORS.text.secondary} />
              <Text fontSize="sm" color={COLORS.text.secondary}>以前のコーヒー</Text>
            </HStack>
            
            {loading ? (
              <Text>読み込み中...</Text>
            ) : previousCoffee ? (
              <>
                <Text fontSize="lg" fontWeight="bold" color={COLORS.text.primary} mb={1}>
                  {previousCoffee.coffeeInfo.name}
                </Text>
                {previousCoffee.coffeeInfo.roaster && (
                  <Text fontSize="sm" color={COLORS.text.secondary}>
                    焙煎: {previousCoffee.coffeeInfo.roaster}
                  </Text>
                )}
                <HStack mt={2} space={1}>
                  <Text fontSize="xs" color={COLORS.text.light}>記録日:</Text>
                  <Text fontSize="xs" color={COLORS.text.light}>
                    {new Date(previousCoffee.createdAt).toLocaleDateString()}
                  </Text>
                </HStack>
              </>
            ) : (
              <Text fontSize="md" color={COLORS.text.secondary}>
                以前のコーヒー記録が見つかりませんでした
              </Text>
            )}
          </Box>
          
          {/* 好み比較 */}
          <VStack space={3} bg="white" p={4} rounded="lg">
            <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
              以前のコーヒーと比べてどうですか？
            </Text>
            <Radio.Group
              name="preferenceCompared"
              value={comparison?.preferenceCompared || 'same'}
              onChange={handlePreferenceComparedChange}
            >
              <VStack space={3} mt={2}>
                <Radio value="better" colorScheme="amber" size="md">
                  <Text ml={2} fontSize="md">今回の方が好み</Text>
                </Radio>
                <Radio value="same" colorScheme="amber" size="md">
                  <Text ml={2} fontSize="md">同じくらい</Text>
                </Radio>
                <Radio value="worse" colorScheme="amber" size="md">
                  <Text ml={2} fontSize="md">前回の方が好み</Text>
                </Radio>
              </VStack>
            </Radio.Group>
          </VStack>
          
          {/* 違いの説明 */}
          <VStack space={3} bg="white" p={4} rounded="lg">
            <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
              どのような違いを感じましたか？（任意）
            </Text>
            <Text fontSize="xs" color={COLORS.text.secondary} mb={2}>
              違いを自由に記述してください
            </Text>
            <TextArea
              h={24}
              placeholder="例：今回の方が酸味が強く感じられた、前回の方が香りが豊かだった、など"
              value={comparison?.notedDifferences || ''}
              onChangeText={handleDifferencesChange}
              autoCompleteType={undefined}
            />
          </VStack>
        </VStack>
      </ScrollView>
      
      <Box px={6} py={4} bg={COLORS.background.primary} borderTopWidth={1} borderTopColor={COLORS.background.secondary}>
        <Button
          onPress={handleNext}
          bg={COLORS.primary[500]}
          _pressed={{ bg: COLORS.primary[600] }}
          _text={{ color: 'white' }}
        >
          解読する
        </Button>
      </Box>
    </Box>
  );
};

export default ExplorationComparisonScreen;