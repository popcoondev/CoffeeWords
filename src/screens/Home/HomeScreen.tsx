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
  const navigation = useNavigation<ScreenProps<'Home'>['navigation']>();
  const route = useRoute<ScreenProps<'Home'>['route']>();
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
      
      // 並列でデータを取得
      const [explorations, missions] = await Promise.all([
        getUserExplorations(user.id, { limit: 3 }),
        getUserActiveMissions(user.id, { limit: 3 })
      ]);
      
      setRecentExplorations(explorations);
      setActiveMissions(missions);
      
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
      px={4}
      pt={2}
      pb={6}
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
                          {exploration.analysis.shortDescription}
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