import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Box, VStack, Heading, Text, HStack, Pressable, Icon, Button, useToast } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui/Card';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ScreenProps, CoffeeExploration, Mission } from '../../types';
import { getUserExplorations } from '../../services/firebase/exploration';
import { getUserActiveMissions } from '../../services/firebase/mission';
import { useAuth } from '../../hooks/useAuth';

/**
 * ホーム画面（今日の探検）
 */
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();
  const { user } = useAuth();
  
  // 最近の探検
  const [recentExplorations, setRecentExplorations] = useState<CoffeeExploration[]>([]);
  
  // アクティブなミッション
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  
  // ローディング状態
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // 初回データ取得
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  // 画面表示時にデータを更新
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      if (user) {
        fetchUserData();
      }
    });
    
    return unsubscribeFocus;
  }, [navigation, user]);
  
  // ユーザーデータの取得
  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      if (__DEV__) {
        // 開発環境ではモックデータを利用
        console.log('開発環境: モックデータを使用');
        
        // モックの探検データ
        const now = new Date();
        const mockExplorations: CoffeeExploration[] = [
          {
            id: 'mock-exploration-1',
            userId: user.id || 'mock-user',
            createdAt: now,
            coffeeInfo: {
              name: 'エチオピア イルガチェフェ',
              roaster: 'オニバスコーヒー',
              origin: 'エチオピア',
              photoURL: 'https://example.com/coffee1.jpg'
            },
            tasteMapPosition: { x: 150, y: 200 },
            preferences: {
              overallRating: 4,
              likedPoints: ['フルーティー', '明るい酸味'],
              likedPointsDetail: '何よりも明るい酸が印象的で、フルーツのような甘さがあった',
              wouldDrinkAgain: 4,
              drinkingScene: ['朝', '休日']
            },
            analysis: {
              professionalDescription: 'フローラルな香りとベリーのような風味を持つ明るい酸味のコーヒー。レモンやライムを思わせるシトラス感と、紅茶のような滑らかな後味が特徴。',
              personalTranslation: '花の香りがあり、さわやかな酸味が特徴的。飲んだ後に紅茶のような味わいが残る。',
              tasteProfile: {
                acidity: 4,
                sweetness: 3,
                bitterness: 2,
                body: 2,
                complexity: 4
              },
              preferenceInsight: 'あなたは明るい酸味を好む傾向があります。フルーティーな風味と花のような香りのコーヒーを特に気に入る傾向が見られます。',
              discoveredFlavor: {
                name: 'ベリー系フルーツの酸味',
                category: 'acidity',
                description: 'ブルーベリーやラズベリーを連想させる甘酸っぱさ',
                rarity: 3,
                userInterpretation: 'フルーツジュースのような爽やかさ'
              },
              nextExploration: 'ケニア産のコーヒーも試してみると良いでしょう。ケニア産は明るい酸味にトマトのようなうま味が加わり、複雑さが増します。'
            }
          },
          {
            id: 'mock-exploration-2',
            userId: user.id || 'mock-user',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2日前
            coffeeInfo: {
              name: 'ブラジル セラード',
              roaster: '丸山珈琲',
              origin: 'ブラジル',
              photoURL: 'https://example.com/coffee2.jpg'
            },
            tasteMapPosition: { x: 250, y: 300 },
            preferences: {
              overallRating: 3,
              likedPoints: ['コク', 'チョコレート感'],
              likedPointsDetail: '安定した味わいでチョコレートのような甘さが感じられた',
              dislikedPoints: ['単調さ'],
              dislikedPointsDetail: '少し特徴が薄く感じられた',
              wouldDrinkAgain: 3,
              drinkingScene: ['午後', '仕事中']
            },
            analysis: {
              professionalDescription: 'ナッツとチョコレート風味の低めの酸味とコクのあるバランスの取れたコーヒー。キャラメルのような甘さとスモーキーな後味が特徴。',
              personalTranslation: 'ナッツのような香ばしさとチョコレートのような甘さを感じる。どっしりとした飲み心地で、飲みやすい。',
              tasteProfile: {
                acidity: 2,
                sweetness: 3,
                bitterness: 3,
                body: 4,
                complexity: 2
              },
              preferenceInsight: 'バランスの取れたコーヒーも楽しめる傾向があります。特に香ばしさと甘みのバランスがよいコーヒーを好む傾向が見られます。',
              discoveredFlavor: {
                name: 'ナッツの香ばしさ',
                category: 'aroma',
                description: 'アーモンドやヘーゼルナッツを連想させる香ばしさ',
                rarity: 2,
                userInterpretation: '香ばしいクッキーのような香り'
              },
              nextExploration: 'コロンビア産のコーヒーも試してみると良いでしょう。ブラジルと似た安定感がありながらも、フルーティーさが加わって複雑さが増します。'
            }
          },
          {
            id: 'mock-exploration-3',
            userId: user.id || 'mock-user',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1週間前
            coffeeInfo: {
              name: 'グアテマラ アンティグア',
              roaster: 'スターバックス',
              origin: 'グアテマラ',
              photoURL: 'https://example.com/coffee3.jpg'
            },
            tasteMapPosition: { x: 200, y: 250 },
            preferences: {
              overallRating: 4,
              likedPoints: ['バランス', 'チョコレート感', '柑橘系の酸味'],
              likedPointsDetail: '酸味と苦味のバランスが良く、オレンジのような風味も感じられた',
              wouldDrinkAgain: 5,
              drinkingScene: ['いつでも', '食後']
            },
            comparison: {
              comparedToId: 'mock-exploration-1',
              preferenceCompared: 'same',
              notedDifferences: 'エチオピアより酸味は控えめですが、バランスが取れていて飲みやすいです'
            },
            analysis: {
              professionalDescription: 'チョコレートとオレンジピールのような風味を持つバランスの取れたコーヒー。中程度の酸味と滑らかなボディが特徴。',
              personalTranslation: 'チョコレートオレンジのお菓子のような香りと味わい。強すぎず弱すぎない、ちょうどいいバランス。',
              tasteProfile: {
                acidity: 3,
                sweetness: 3,
                bitterness: 3,
                body: 3,
                complexity: 3
              },
              preferenceInsight: 'バランスのとれたコーヒーを特に好む傾向があります。酸味と甘みが調和したコーヒーを最も評価していることが分かります。',
              discoveredFlavor: {
                name: 'チョコレートオレンジの風味',
                category: 'sweetness',
                description: 'ダークチョコレートとオレンジピールを組み合わせたような複雑な甘さ',
                rarity: 3,
                userInterpretation: 'チョコレートオレンジのお菓子のような味わい'
              },
              nextExploration: 'コスタリカ産のコーヒーも試してみると良いでしょう。バランスが取れていながらも、ハニーなどの処理方法によって様々な表情を見せてくれます。'
            }
          }
        ];
        
        // モックのミッションデータ
        const mockMissions: Mission[] = [
          {
            id: 'mock-mission-1',
            userId: user.id || 'mock-user',
            createdAt: now,
            expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1週間後
            title: '酸味と甘みのバランスを探す',
            description: '酸味と甘みのバランスが良いコーヒーを見つけて記録しましょう。バランスの取れた味わいは、多くのコーヒー愛好家に親しまれています。',
            difficulty: 'beginner',
            type: 'discovery',
            objectives: {
              targetFlavorCategory: 'acidity',
              specificTask: '酸味と甘みのバランスが取れたコーヒーを探す'
            },
            status: 'active',
            reward: {
              experiencePoints: 10
            },
            relatedCoffeeRecommendations: ['エチオピア イルガチェフェ', 'グアテマラ アンティグア'],
            helpTips: ['浅煎りのコーヒーを探してみましょう', '準備中の豆を確認してみましょう']
          },
          {
            id: 'mock-mission-2',
            userId: user.id || 'mock-user',
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1日前
            expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3日後
            title: 'フルーティーな味わいを比較する',
            description: '異なる産地のフルーティーなコーヒーを2種類飲み比べて、それぞれの違いを記録しましょう。味覚の比較は理解を深めます。',
            difficulty: 'intermediate',
            type: 'comparison',
            objectives: {
              targetFlavorCategory: 'aroma',
              comparisonCoffeeId: 'mock-exploration-1',
              specificTask: 'フルーティーな風味を持つ異なる2種類のコーヒーを比較する'
            },
            status: 'active',
            reward: {
              experiencePoints: 25,
              badgeId: 'taste-explorer'
            },
            relatedCoffeeRecommendations: ['ケニア ニエリ', 'エチオピア シダモ', 'コロンビア ウイラ'],
            helpTips: ['一つはすでに試したエチオピアとの比較がおすすめです', '時間を空けずに飲み比べると違いが分かりやすいです']
          },
          {
            id: 'mock-mission-3',
            userId: user.id || 'mock-user',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5日前
            expiresAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2日後
            title: '今日のコーヒー探検',
            description: '今日飲んだコーヒーの記録を登録しましょう。定期的な記録は味覚を育てます。',
            difficulty: 'beginner',
            type: 'daily',
            objectives: {
              specificTask: '今日飲んだコーヒーを記録する'
            },
            status: 'active',
            reward: {
              experiencePoints: 5
            },
            relatedCoffeeRecommendations: [],
            helpTips: ['普段飲み慣れているコーヒーでも、じっくり味わうと新しい発見があるかもしれません']
          }
        ];
        
        setRecentExplorations(mockExplorations);
        setActiveMissions(mockMissions);
      } else {
        // 本番環境では実際のデータを取得
        const [explorations, missions] = await Promise.all([
          getUserExplorations(user.id, { limit: 3 }),
          getUserActiveMissions(user.id, { limit: 3 })
        ]);
        
        setRecentExplorations(explorations);
        setActiveMissions(missions);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.show({
        title: "データ取得エラー",
        description: "データの読み込み中にエラーが発生しました",
        status: "error"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // リフレッシュ処理
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };
  
  // 新しい探検開始
  const handleStartExploration = () => {
    navigation.navigate(ROUTES.EXPLORATION_FLOW);
  };
  
  // ミッション詳細表示
  const handleMissionPress = (missionId: string) => {
    navigation.navigate(ROUTES.MISSION_DETAIL, { missionId });
  };
  
  // 探検詳細表示
  const handleExplorationPress = (explorationId: string) => {
    // TODO: 探検詳細画面に遷移
    toast.show({
      title: "準備中",
      description: "この機能は近日公開予定です",
      status: "info"
    });
  };
  
  // すべてのミッション表示
  const handleViewAllMissions = () => {
    navigation.navigate(ROUTES.MISSIONS);
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
        {/* 今日の探検ミッション */}
        <VStack space={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="md">今日の探検ミッション</Heading>
            {activeMissions.length > 0 && (
              <Pressable onPress={handleViewAllMissions}>
                <HStack alignItems="center">
                  <Text fontSize="sm" color={COLORS.primary[500]}>すべて表示</Text>
                  <Icon as={Ionicons} name="chevron-forward" size="sm" color={COLORS.primary[500]} />
                </HStack>
              </Pressable>
            )}
          </HStack>
          
          {loading ? (
            <Card>
              <Text textAlign="center" py={4}>読み込み中...</Text>
            </Card>
          ) : activeMissions.length > 0 ? (
            <VStack space={3}>
              {activeMissions.map((mission) => (
                <Pressable key={mission.id} onPress={() => handleMissionPress(mission.id)}>
                  <Card>
                    <VStack space={3}>
                      <HStack space={2} alignItems="center">
                        <Box
                          bg={getMissionTypeColor(mission.type)}
                          px={2}
                          py={1}
                          rounded="md"
                        >
                          <Text fontSize="xs" color="white" fontWeight="bold">
                            {translateMissionType(mission.type)}
                          </Text>
                        </Box>
                        <Box
                          bg={getMissionDifficultyColor(mission.difficulty)}
                          px={2}
                          py={1}
                          rounded="md"
                        >
                          <Text fontSize="xs" color="white" fontWeight="bold">
                            {translateDifficulty(mission.difficulty)}
                          </Text>
                        </Box>
                      </HStack>
                      
                      <Text fontWeight="bold" fontSize="md">{mission.title}</Text>
                      <Text numberOfLines={2} fontSize="sm" color={COLORS.text.secondary}>
                        {mission.description}
                      </Text>
                      
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="xs" color={COLORS.text.light}>
                          期限: {formatDate(mission.expiresAt)}
                        </Text>
                        <HStack alignItems="center">
                          <Icon as={Ionicons} name="trophy-outline" size="sm" color={COLORS.primary[500]} />
                          <Text fontSize="xs" color={COLORS.primary[500]} ml={1}>
                            {mission.reward?.experiencePoints || 0} EXP
                          </Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </Card>
                </Pressable>
              ))}
            </VStack>
          ) : (
            <Card>
              <VStack space={3} alignItems="center" py={4}>
                <Icon as={Ionicons} name="compass-outline" size="3xl" color={COLORS.primary[500]} />
                <Text textAlign="center" color={COLORS.text.secondary}>
                  現在アクティブなミッションはありません
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={handleViewAllMissions}
                  leftIcon={<Icon as={Ionicons} name="search" size="sm" />}
                >
                  ミッションを探す
                </Button>
              </VStack>
            </Card>
          )}
        </VStack>
        
        {/* 今日のコーヒーを解読 */}
        <VStack space={2}>
          <Heading size="md">今日のコーヒーを解読</Heading>
          <Card>
            <VStack alignItems="center" space={4} py={4}>
              <Box 
                bg={COLORS.secondary[500]} 
                p={4} 
                rounded="full"
              >
                <Icon 
                  as={Ionicons} 
                  name="flask-outline" 
                  size="xl" 
                  color={COLORS.primary[500]} 
                />
              </Box>
              <Text fontWeight="medium" textAlign="center">
                コーヒーを飲んだら、その味わいを解読してみましょう
              </Text>
              <Button
                leftIcon={<Icon as={Ionicons} name="cafe" size="sm" />}
                onPress={handleStartExploration}
              >
                探検を始める
              </Button>
            </VStack>
          </Card>
        </VStack>
        
        {/* あなたの探検記録 */}
        <VStack space={2}>
          <Heading size="md">あなたの探検記録</Heading>
          
          {loading ? (
            <Card>
              <Text textAlign="center" py={4}>読み込み中...</Text>
            </Card>
          ) : recentExplorations.length > 0 ? (
            <Card>
              <VStack divider={<Box bg={COLORS.text.light} h="1px" my={2} opacity={0.2} />}>
                {recentExplorations.map((exploration) => (
                  <Pressable 
                    key={exploration.id} 
                    onPress={() => handleExplorationPress(exploration.id)}
                    py={2}
                    _pressed={{ opacity: 0.7 }}
                  >
                    <HStack space={3} alignItems="center">
                      <VStack w="16" alignItems="center" justifyContent="center">
                        <Text color={COLORS.primary[500]} fontWeight="bold">
                          {formatDate(exploration.createdAt, true)}
                        </Text>
                      </VStack>
                      <VStack flex={1}>
                        <Text fontWeight="bold">{exploration.coffeeInfo.name}</Text>
                        <Text numberOfLines={1} fontSize="xs" color={COLORS.text.secondary}>
                          {exploration.analysis.personalTranslation}
                        </Text>
                      </VStack>
                      <Icon 
                        as={Ionicons} 
                        name="chevron-forward" 
                        size="sm" 
                        color={COLORS.text.light} 
                      />
                    </HStack>
                  </Pressable>
                ))}
              </VStack>
            </Card>
          ) : (
            <Card>
              <VStack space={3} alignItems="center" py={4}>
                <Icon as={Ionicons} name="book-outline" size="3xl" color={COLORS.primary[500]} />
                <Text textAlign="center" color={COLORS.text.secondary}>
                  まだ探検記録がありません
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={handleStartExploration}
                  leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
                >
                  最初の探検を始める
                </Button>
              </VStack>
            </Card>
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
};

// ミッションタイプに基づく色を取得
const getMissionTypeColor = (type: Mission['type']): string => {
  switch (type) {
    case 'discovery':
      return '#4CAF50'; // 緑
    case 'comparison':
      return '#2196F3'; // 青
    case 'challenge':
      return '#FF9800'; // オレンジ
    case 'daily':
      return '#9C27B0'; // 紫
    default:
      return COLORS.primary[500];
  }
};

// 難易度に基づく色を取得
const getMissionDifficultyColor = (difficulty: Mission['difficulty']): string => {
  switch (difficulty) {
    case 'beginner':
      return '#4CAF50'; // 緑
    case 'intermediate':
      return '#FF9800'; // オレンジ
    case 'advanced':
      return '#F44336'; // 赤
    default:
      return COLORS.primary[500];
  }
};

// ミッションタイプの日本語変換
const translateMissionType = (type: Mission['type']): string => {
  switch (type) {
    case 'discovery':
      return '発見';
    case 'comparison':
      return '比較';
    case 'challenge':
      return 'チャレンジ';
    case 'daily':
      return 'デイリー';
    default:
      return type;
  }
};

// 難易度の日本語変換
const translateDifficulty = (difficulty: Mission['difficulty']): string => {
  switch (difficulty) {
    case 'beginner':
      return '初級';
    case 'intermediate':
      return '中級';
    case 'advanced':
      return '上級';
    default:
      return difficulty;
  }
};

// 日付のフォーマット
const formatDate = (date: Date, short: boolean = false): string => {
  if (!date) return '';
  
  if (short) {
    // MM/DD形式
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
  
  // YYYY/MM/DD形式
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export default HomeScreen;