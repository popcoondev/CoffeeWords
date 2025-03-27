import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Box, VStack, Heading, Text, Button, HStack, Icon, Pressable, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui/Card';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ScreenProps, CoffeeExploration } from '../../types';
import { getUserExplorations } from '../../services/firebase/exploration';
import { useAuth } from '../../hooks/useAuth';
import TasteMap from '../../components/map/TasteMap';

/**
 * 味わい探検マップ画面
 */
const TasteMapScreen: React.FC = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const { user } = useAuth();
  
  // ユーザーの探検記録
  const [explorations, setExplorations] = useState<CoffeeExploration[]>([]);
  
  // 好みのサマリーデータ
  const [preferenceSummary, setPreferenceSummary] = useState({
    acidity: 0,
    sweetness: 0,
    bitterness: 0,
    body: 0,
    complexity: 0,
  });
  
  // 探検領域のカバレッジ（0-100%）
  const [explorationCoverage, setExplorationCoverage] = useState(0);
  
  // ローディング状態
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // 初回データ取得
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  // ユーザーデータの取得
  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      if (__DEV__) {
        // 開発環境ではモックデータを利用
        console.log('開発環境: モックデータを使用');
        
        // モックの探検データ
        const mockExplorations: CoffeeExploration[] = [
          {
            id: 'mock-exploration-1',
            userId: user.id || 'mock-user',
            createdAt: new Date(),
            coffeeInfo: {
              name: 'エチオピア イルガチェフェ',
              roaster: 'モックロースター',
              origin: 'エチオピア'
            },
            tasteMapPosition: { x: 150, y: 200 },
            preferences: {
              overallRating: 4,
              likedPoints: ['フルーティー', '明るい酸味'],
              wouldDrinkAgain: 4,
              drinkingScene: ['朝']
            },
            analysis: {
              professionalDescription: 'フローラルな香りとベリーのような風味を持つ明るい酸味のコーヒー',
              personalTranslation: '花の香りがあり、さわやかな酸味が特徴的',
              tasteProfile: {
                acidity: 4,
                sweetness: 3,
                bitterness: 2,
                body: 2,
                complexity: 4
              },
              preferenceInsight: 'あなたは明るい酸味を好む傾向があります',
              discoveredFlavor: {
                name: 'ベリー系フルーツの酸味',
                category: 'acidity',
                description: 'ブルーベリーやラズベリーを連想させる甘酸っぱさ',
                rarity: 3,
                userInterpretation: 'フルーツジュースのような爽やかさ'
              },
              nextExploration: 'ケニア産のコーヒーも試してみると良いでしょう'
            }
          },
          {
            id: 'mock-exploration-2',
            userId: user.id || 'mock-user',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            coffeeInfo: {
              name: 'ブラジル サントス',
              roaster: 'モックロースター',
              origin: 'ブラジル'
            },
            tasteMapPosition: { x: 250, y: 300 },
            preferences: {
              overallRating: 3,
              likedPoints: ['コク', 'チョコレート感'],
              wouldDrinkAgain: 3,
              drinkingScene: ['午後']
            },
            analysis: {
              professionalDescription: 'ナッツとチョコレート風味の低めの酸味とコクのあるバランスの取れたコーヒー',
              personalTranslation: 'ナッツのような香ばしさとチョコレートのような甘さを感じる',
              tasteProfile: {
                acidity: 2,
                sweetness: 3,
                bitterness: 3,
                body: 4,
                complexity: 3
              },
              preferenceInsight: 'コクのあるコーヒーも楽しめる傾向があります',
              discoveredFlavor: {
                name: 'ナッツの香ばしさ',
                category: 'aroma',
                description: 'アーモンドやヘーゼルナッツを連想させる香ばしさ',
                rarity: 2,
                userInterpretation: '香ばしいクッキーのような香り'
              },
              nextExploration: 'コロンビア産のコーヒーも試してみると良いでしょう'
            }
          }
        ];
        
        setExplorations(mockExplorations);
        
        // 好みのサマリーを計算
        calculatePreferenceSummary(mockExplorations);
        
        // 探検領域のカバレッジを計算（仮実装）
        const coverage = Math.min(100, mockExplorations.length * 10);
        setExplorationCoverage(coverage);
        
      } else {
        // 本番環境では実際のデータを取得
        const userExplorations = await getUserExplorations(user.id, { limit: 20 });
        setExplorations(userExplorations);
        
        // 好みのサマリーを計算
        calculatePreferenceSummary(userExplorations);
        
        // 探検領域のカバレッジを計算（仮実装）
        const coverage = Math.min(100, userExplorations.length * 5);
        setExplorationCoverage(coverage);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.show({
        title: "データ取得エラー",
        description: "味わい探検マップの読み込み中にエラーが発生しました",
        status: "error"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // 好みのサマリーを計算
  const calculatePreferenceSummary = (data: CoffeeExploration[]) => {
    if (data.length === 0) return;
    
    let totals = {
      acidity: 0,
      sweetness: 0,
      bitterness: 0,
      body: 0,
      complexity: 0,
    };
    
    data.forEach(exploration => {
      const { tasteProfile } = exploration.analysis;
      
      totals.acidity += tasteProfile.acidity;
      totals.sweetness += tasteProfile.sweetness;
      totals.bitterness += tasteProfile.bitterness;
      totals.body += tasteProfile.body;
      totals.complexity += tasteProfile.complexity;
    });
    
    // 平均値を計算
    const count = data.length;
    Object.keys(totals).forEach(key => {
      totals[key as keyof typeof totals] = +(totals[key as keyof typeof totals] / count).toFixed(1);
    });
    
    setPreferenceSummary(totals);
  };
  
  // リフレッシュ処理
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };
  
  // 好みプロファイル詳細
  const handleViewPreferenceProfile = () => {
    navigation.navigate(ROUTES.PREFERENCE_PROFILE);
  };
  
  // 探検履歴
  const handleViewExplorationHistory = () => {
    navigation.navigate(ROUTES.EXPLORATION_HISTORY);
  };
  
  // おすすめ一覧
  const handleViewRecommendations = () => {
    navigation.navigate(ROUTES.RECOMMENDATIONS);
  };
  
  return (
    <ScrollView
      flex={1}
      bg={COLORS.background.primary}
      px={6}
      pt={4}
      pb={8}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[COLORS.primary[500]]}
          tintColor={COLORS.primary[500]}
        />
      }
    >
      <VStack space={6}>
        {/* 探検マップ */}
        <VStack space={2}>
          <Heading size="md">あなたの味わい探検マップ</Heading>
          <Card>
            <VStack space={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize="sm" color={COLORS.text.secondary}>
                  探検領域: {explorationCoverage}%
                </Text>
                <HStack alignItems="center">
                  <Icon as={Ionicons} name="flag" size="sm" color={COLORS.primary[500]} />
                  <Text fontSize="sm" color={COLORS.primary[500]} ml={1}>
                    {explorations.length} 探検
                  </Text>
                </HStack>
              </HStack>
              
              {/* プレースホルダーマップ */}
              <Box 
                h={300} 
                bg={COLORS.background.secondary} 
                rounded="lg"
                position="relative"
                overflow="hidden"
              >
                {loading ? (
                  <Box flex={1} justifyContent="center" alignItems="center">
                    <Text>マップ読み込み中...</Text>
                  </Box>
                ) : (
                  <>
                    {/* 実際の地図コンポーネントはここに実装 */}
                    <TasteMap
                      size="large"
                      interactive={false}
                    />
                    
                    {/* 探検ポイント（マーカー） */}
                    {explorations.map((exploration, index) => (
                      <Box
                        key={exploration.id}
                        position="absolute"
                        bg={COLORS.primary[500]}
                        opacity={0.7}
                        w={3}
                        h={3}
                        rounded="full"
                        top={exploration.tasteMapPosition?.y || 200}
                        left={exploration.tasteMapPosition?.x || 200}
                        style={{ transform: [{ translateX: -6 }, { translateY: -6 }] }}
                      />
                    ))}
                    
                    {/* 未探索領域を示すオーバーレイ */}
                    <Box
                      position="absolute"
                      top={0}
                      right={0}
                      bottom={0}
                      w={`${100 - Math.min(50, explorationCoverage / 2)}%`}
                      bg="rgba(0,0,0,0.1)"
                      borderLeftWidth={1}
                      borderLeftColor="rgba(0,0,0,0.1)"
                    >
                      <VStack h="full" justifyContent="center" alignItems="center">
                        <Icon as={Ionicons} name="compass" color="rgba(0,0,0,0.2)" size="xl" />
                        <Text fontSize="xs" color="rgba(0,0,0,0.3)" mt={2}>
                          未探索領域
                        </Text>
                      </VStack>
                    </Box>
                  </>
                )}
              </Box>
              
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Icon as={Ionicons} name="expand-outline" size="sm" />}
                onPress={() => navigation.navigate(ROUTES.TASTE_MAP_DETAIL, { regionId: 'all' })}
              >
                マップを拡大
              </Button>
            </VStack>
          </Card>
        </VStack>
        
        {/* 好みプロファイル */}
        <VStack space={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="md">あなたの好みプロファイル</Heading>
            <Pressable onPress={handleViewPreferenceProfile}>
              <HStack alignItems="center">
                <Text fontSize="sm" color={COLORS.primary[500]}>詳細</Text>
                <Icon as={Ionicons} name="chevron-forward" size="sm" color={COLORS.primary[500]} />
              </HStack>
            </Pressable>
          </HStack>
          
          <Card>
            <VStack space={4}>
              {/* 好みプロファイルのレーダーチャートの代わりにバー表示 */}
              {Object.entries(preferenceSummary).map(([key, value]) => (
                <VStack key={key} space={1}>
                  <HStack justifyContent="space-between">
                    <Text fontSize="sm" color={COLORS.text.secondary}>
                      {translateProfileKey(key)}
                    </Text>
                    <Text fontSize="xs" color={COLORS.text.light}>
                      {value}/5
                    </Text>
                  </HStack>
                  <Box 
                    w="full" 
                    h={3} 
                    bg="rgba(0,0,0,0.05)" 
                    rounded="full" 
                    overflow="hidden"
                  >
                    <Box 
                      h="full" 
                      bg={getProfileColor(key)} 
                      w={`${value * 20}%`} 
                      rounded="full" 
                    />
                  </Box>
                </VStack>
              ))}
              
              {/* 好みの特徴 */}
              <VStack bg={COLORS.background.secondary} p={3} rounded="md" mt={2}>
                <Text fontSize="sm" fontWeight="bold" color={COLORS.text.primary} mb={1}>
                  あなたの好みの特徴:
                </Text>
                <Text fontSize="sm" color={COLORS.text.secondary}>
                  {getPreferenceSummaryText(preferenceSummary)}
                </Text>
              </VStack>
            </VStack>
          </Card>
        </VStack>
        
        {/* アクション */}
        <VStack space={3}>
          <Pressable
            onPress={handleViewExplorationHistory}
            bg="white"
            p={4}
            rounded="lg"
            shadow={1}
          >
            <HStack alignItems="center" justifyContent="space-between">
              <HStack space={3} alignItems="center">
                <Icon as={Ionicons} name="time-outline" size="md" color={COLORS.primary[500]} />
                <VStack>
                  <Text fontWeight="bold">探検の履歴</Text>
                  <Text fontSize="xs" color={COLORS.text.secondary}>
                    これまでの探検記録をすべて見る
                  </Text>
                </VStack>
              </HStack>
              <Icon as={Ionicons} name="chevron-forward" size="sm" color={COLORS.text.light} />
            </HStack>
          </Pressable>
          
          <Pressable
            onPress={handleViewRecommendations}
            bg="white"
            p={4}
            rounded="lg"
            shadow={1}
          >
            <HStack alignItems="center" justifyContent="space-between">
              <HStack space={3} alignItems="center">
                <Icon as={Ionicons} name="star-outline" size="md" color={COLORS.primary[500]} />
                <VStack>
                  <Text fontWeight="bold">あなたへのおすすめ</Text>
                  <Text fontSize="xs" color={COLORS.text.secondary}>
                    好みに合った次の探検先
                  </Text>
                </VStack>
              </HStack>
              <Icon as={Ionicons} name="chevron-forward" size="sm" color={COLORS.text.light} />
            </HStack>
          </Pressable>
          
          <Pressable
            onPress={() => navigation.navigate(ROUTES.EXPLORATION_FLOW)}
            bg="white"
            p={4}
            rounded="lg"
            shadow={1}
          >
            <HStack alignItems="center" justifyContent="space-between">
              <HStack space={3} alignItems="center">
                <Icon as={Ionicons} name="add-circle-outline" size="md" color={COLORS.primary[500]} />
                <VStack>
                  <Text fontWeight="bold">新しい探検</Text>
                  <Text fontSize="xs" color={COLORS.text.secondary}>
                    新しいコーヒーを解読する
                  </Text>
                </VStack>
              </HStack>
              <Icon as={Ionicons} name="chevron-forward" size="sm" color={COLORS.text.light} />
            </HStack>
          </Pressable>
        </VStack>
      </VStack>
    </ScrollView>
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

// プロファイル要素ごとの色を取得
const getProfileColor = (key: string): string => {
  const colors: Record<string, string> = {
    acidity: '#FFD700',     // 黄色（酸味）
    sweetness: '#FF9800',   // オレンジ（甘み）
    bitterness: '#8B4513',  // 茶色（苦味）
    body: '#A0522D',        // 赤茶色（ボディ）
    complexity: '#9370DB'   // 紫（複雑さ）
  };
  
  return colors[key] || COLORS.primary[500];
};

// 好みプロファイルのサマリーテキストを生成
const getPreferenceSummaryText = (profile: any): string => {
  // プロファイルから最も高い値と最も低い値を見つける
  const entries = Object.entries(profile);
  const maxEntry = entries.reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
  const minEntry = entries.reduce((min, current) => current[1] < min[1] ? current : min, ['', 5]);
  
  // データがなければデフォルトテキスト
  if (maxEntry[1] === 0) {
    return 'まだ十分なデータがありません。もっと探検を記録しましょう。';
  }
  
  // 高い値と低い値に基づいてテキスト生成
  return `あなたは${translateProfileKey(maxEntry[0])}が強めのコーヒーを好む傾向があります。一方、${translateProfileKey(minEntry[0])}はそれほど重視していません。`;
};

export default TasteMapScreen;