import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, VStack, Heading, Text, Button, HStack, Icon, Pressable, useToast, Radio, Checkbox, TextArea } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useExplorationStore } from '../../store/useExplorationStore';
import { ScreenProps, CoffeeExploration } from '../../types';

/**
 * 好み評価画面
 * コーヒーの主観的な評価や感想を入力する
 */
const ExplorationPreferencesScreen: React.FC = () => {
  const navigation = useNavigation<ScreenProps<'ExplorationPreferences'>['navigation']>();
  const route = useRoute<ScreenProps<'ExplorationPreferences'>['route']>();
  const toast = useToast();
  
  // パラメータから取得
  const { coffeeInfo, mapPosition, mapCharacteristics } = route.params || {};
  
  // Exploration Store
  const { 
    preferences,
    comparison,
    setPreferences
  } = useExplorationStore();
  
  // 戻るボタン
  const handleBack = () => {
    navigation.goBack();
  };
  
  // 次へボタン
  const handleNext = () => {
    // 必須項目のチェック
    if (preferences.likedPoints.length === 0) {
      toast.show({
        title: "必須項目",
        description: "少なくとも1つの気に入ったポイントを選択してください",
        status: "warning"
      });
      return;
    }
    
    // 以前のコーヒー記録があり比較が必要な場合
    if (route.params?.comparedToId) {
      navigation.navigate(ROUTES.EXPLORATION_COMPARISON, {
        coffeeInfo,
        mapPosition,
        preferences,
        comparedToId: route.params.comparedToId
      });
      return;
    }
    
    // 解読処理へ進む
    handleRequestDecode();
  };
  
  // 解読リクエスト
  const handleRequestDecode = () => {
    // 次の画面（結果画面）へのパラメータ
    // 本来はここでAPIリクエストをするが、今はNavigateのみ
    navigation.navigate(ROUTES.EXPLORATION_RESULT, {
      coffeeInfo,
      mapPosition,
      preferences,
      comparison,
      // decodeResultは次の画面で取得する
    });
  };
  
  // 好み度選択
  const handleRatingChange = (value: string) => {
    setPreferences({ overallRating: parseInt(value) });
  };
  
  // 再体験意向選択
  const handleWouldDrinkAgainChange = (value: string) => {
    setPreferences({ wouldDrinkAgain: parseInt(value) });
  };
  
  // 気に入ったポイント選択
  const handleLikedPointsChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setPreferences({
        likedPoints: [...preferences.likedPoints, value]
      });
    } else {
      setPreferences({
        likedPoints: preferences.likedPoints.filter(point => point !== value)
      });
    }
  };
  
  // 飲みたいシーン選択
  const handleDrinkingSceneChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setPreferences({
        drinkingScene: [...preferences.drinkingScene, value]
      });
    } else {
      setPreferences({
        drinkingScene: preferences.drinkingScene.filter(scene => scene !== value)
      });
    }
  };
  
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={handleBack} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md">好みの評価</Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>
      
      <ScrollView flex={1} px={4} py={2}>
        <VStack space={6}>
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
          
          {/* 好み度評価 */}
          <VStack space={3} bg="white" p={4} rounded="lg">
            <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
              このコーヒーはどのくらい好みでしたか？
            </Text>
            <Radio.Group
              name="rating"
              value={preferences.overallRating.toString()}
              onChange={handleRatingChange}
            >
              <HStack justifyContent="space-between" w="full">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Radio
                    key={rating}
                    value={rating.toString()}
                    colorScheme="amber"
                    size="md"
                    my={1}
                  >
                    <Text fontSize="md" ml={1}>{rating}</Text>
                  </Radio>
                ))}
              </HStack>
            </Radio.Group>
            <HStack justifyContent="space-between" w="full" px={2}>
              <Text fontSize="xs" color={COLORS.text.light}>好みではない</Text>
              <Text fontSize="xs" color={COLORS.text.light}>とても好み</Text>
            </HStack>
          </VStack>
          
          {/* 気に入ったポイント */}
          <VStack space={3} bg="white" p={4} rounded="lg">
            <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
              特に気に入ったポイントは？
            </Text>
            <Text fontSize="xs" color={COLORS.text.secondary} mb={2}>
              当てはまるものをすべて選択してください
            </Text>
            <VStack space={2} px={2}>
              {[
                { value: '酸味', icon: 'leaf-outline' },
                { value: '甘み', icon: 'water-outline' },
                { value: '苦味', icon: 'nutrition-outline' },
                { value: 'コク/ボディ', icon: 'body-outline' },
                { value: '香り', icon: 'flower-outline' },
                { value: '余韻', icon: 'time-outline' },
                { value: 'バランス', icon: 'scale-outline' },
                { value: 'クリーン', icon: 'sparkles-outline' }
              ].map(item => (
                <Checkbox
                  key={item.value}
                  value={item.value}
                  isChecked={preferences.likedPoints.includes(item.value)}
                  onChange={isSelected => handleLikedPointsChange(item.value, isSelected)}
                  colorScheme="amber"
                  size="md"
                >
                  <HStack alignItems="center">
                    <Icon as={Ionicons} name={item.icon} color={COLORS.primary[500]} size="sm" mr={2} />
                    <Text fontSize="md">{item.value}</Text>
                  </HStack>
                </Checkbox>
              ))}
            </VStack>
            
            <TextArea
              h={20}
              placeholder="気に入ったポイントの詳細を自由に記入してください..."
              value={preferences.likedPointsDetail}
              onChangeText={value => setPreferences({ likedPointsDetail: value })}
              autoCompleteType={undefined}
              mt={2}
            />
          </VStack>
          
          {/* 違和感ポイント (オプション) */}
          <VStack space={3} bg="white" p={4} rounded="lg">
            <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
              違和感を感じたポイントは？ (任意)
            </Text>
            <TextArea
              h={20}
              placeholder="気になった点や改善点があれば記入してください..."
              value={preferences.dislikedPointsDetail}
              onChangeText={value => setPreferences({ dislikedPointsDetail: value })}
              autoCompleteType={undefined}
            />
          </VStack>
          
          {/* 再体験意向 */}
          <VStack space={3} bg="white" p={4} rounded="lg">
            <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
              また飲みたいと思いますか？
            </Text>
            <Radio.Group
              name="wouldDrinkAgain"
              value={preferences.wouldDrinkAgain.toString()}
              onChange={handleWouldDrinkAgainChange}
            >
              <HStack justifyContent="space-between" w="full">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Radio
                    key={rating}
                    value={rating.toString()}
                    colorScheme="amber"
                    size="md"
                    my={1}
                  >
                    <Text fontSize="md" ml={1}>{rating}</Text>
                  </Radio>
                ))}
              </HStack>
            </Radio.Group>
            <HStack justifyContent="space-between" w="full" px={2}>
              <Text fontSize="xs" color={COLORS.text.light}>思わない</Text>
              <Text fontSize="xs" color={COLORS.text.light}>ぜひ飲みたい</Text>
            </HStack>
          </VStack>
          
          {/* 飲みたいシーン */}
          <VStack space={3} bg="white" p={4} rounded="lg">
            <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary}>
              どのような場面で飲みたいですか？
            </Text>
            <Text fontSize="xs" color={COLORS.text.secondary} mb={2}>
              当てはまるものを選択してください
            </Text>
            <VStack space={2} px={2}>
              {[
                { value: '朝のスタート', icon: 'sunny-outline' },
                { value: '仕事の休憩', icon: 'briefcase-outline' },
                { value: 'リラックスタイム', icon: 'book-outline' },
                { value: '食後', icon: 'restaurant-outline' },
                { value: '集中したい時', icon: 'flash-outline' },
                { value: '特別な日', icon: 'gift-outline' }
              ].map(item => (
                <Checkbox
                  key={item.value}
                  value={item.value}
                  isChecked={preferences.drinkingScene.includes(item.value)}
                  onChange={isSelected => handleDrinkingSceneChange(item.value, isSelected)}
                  colorScheme="amber"
                  size="md"
                >
                  <HStack alignItems="center">
                    <Icon as={Ionicons} name={item.icon} color={COLORS.primary[500]} size="sm" mr={2} />
                    <Text fontSize="md">{item.value}</Text>
                  </HStack>
                </Checkbox>
              ))}
            </VStack>
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
          {route.params?.comparedToId ? '比較を入力する' : '解読する'}
        </Button>
      </Box>
    </Box>
  );
};

export default ExplorationPreferencesScreen;