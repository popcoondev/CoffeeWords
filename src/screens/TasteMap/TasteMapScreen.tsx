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
          },
          {
            id: 'mock-exploration-4',
            userId: user.id || 'mock-user',
            createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 2週間前
            coffeeInfo: {
              name: 'インドネシア マンデリン',
              roaster: 'カルディ',
              origin: 'インドネシア',
              photoURL: 'https://example.com/coffee4.jpg'
            },
            tasteMapPosition: { x: 300, y: 350 },
            preferences: {
              overallRating: 3,
              likedPoints: ['複雑さ', '独特な風味'],
              likedPointsDetail: 'ハーブのようなスパイシーさがあって、他のコーヒーと一味違う',
              dislikedPoints: ['クセの強さ'],
              dislikedPointsDetail: '少し土っぽさが強いのが苦手',
              wouldDrinkAgain: 2,
              drinkingScene: ['夜', '特別な時']
            },
            analysis: {
              professionalDescription: 'ハーブのような複雑さとアースリーな風味を持つ重厚なコーヒー。ダークチョコレートのような苦味と長い余韻が特徴。',
              personalTranslation: '土っぽさとスパイシーさが混ざった独特な味わい。飲んだ後も口の中に長く風味が残る。',
              tasteProfile: {
                acidity: 1,
                sweetness: 2,
                bitterness: 4,
                body: 5,
                complexity: 4
              },
              preferenceInsight: 'クセの強いコーヒーは好みが分かれるようです。あなたは明るい風味のコーヒーをより好む傾向があるかもしれません。',
              discoveredFlavor: {
                name: 'アースリーな風味',
                category: 'other',
                description: '大地や森林を連想させる土っぽさとハーブ感',
                rarity: 4,
                userInterpretation: '山椒のようなスパイシーさと、森を歩いているような香り'
              },
              nextExploration: 'スマトラ産のコーヒーも試してみると、インドネシアの独特な風味の違いを発見できるかもしれません。'
            }
          },
          {
            id: 'mock-exploration-5',
            userId: user.id || 'mock-user',
            createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), // 3週間前
            coffeeInfo: {
              name: 'コロンビア スプレモ',
              roaster: 'ブルーボトル',
              origin: 'コロンビア',
              photoURL: 'https://example.com/coffee5.jpg'
            },
            tasteMapPosition: { x: 180, y: 270 },
            preferences: {
              overallRating: 5,
              likedPoints: ['クリーンな味わい', 'カラメルの甘さ', 'ジューシーさ'],
              likedPointsDetail: 'とてもバランスが良く、甘さと酸味が絶妙で万人に好まれそう',
              wouldDrinkAgain: 5,
              drinkingScene: ['いつでも', '人と一緒に']
            },
            analysis: {
              professionalDescription: 'カラメルの甘さとりんごのようなジューシーさを持つバランスの取れたコーヒー。クリーンな後味とシルキーなマウスフィールが特徴。',
              personalTranslation: '誰にでも飲みやすい、バランスの取れた味わい。キャラメルアップルのような甘酸っぱさがとても心地よい。',
              tasteProfile: {
                acidity: 3,
                sweetness: 4,
                bitterness: 2,
                body: 3,
                complexity: 3
              },
              preferenceInsight: 'バランスの取れたコーヒーが最も高く評価されています。特に甘みと軽やかさのある味わいを好む傾向があります。',
              discoveredFlavor: {
                name: 'カラメルアップルの風味',
                category: 'sweetness',
                description: 'キャラメルの甘さとりんごの爽やかさが融合した風味',
                rarity: 3,
                userInterpretation: 'キャラメルりんご飴のような甘酸っぱさ'
              },
              nextExploration: 'パナマ産のゲイシャ種も試してみると、さらに洗練されたクリーンな味わいを楽しめるかもしれません。'
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