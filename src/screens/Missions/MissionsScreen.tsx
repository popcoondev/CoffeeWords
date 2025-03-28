import React, { useState, useEffect } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { Box, VStack, Heading, Text, HStack, Pressable, Icon, useToast, Divider } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenProps, Mission } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { getUserActiveMissions, getUserCompletedMissions } from '../../services/firebase/mission';

/**
 * ミッション一覧画面
 */
const MissionsScreen: React.FC = () => {
  const navigation = useNavigation<ScreenProps<'Missions'>['navigation']>();
  const toast = useToast();
  const { user } = useAuth();
  
  // ミッション一覧
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Mission[]>([]);
  
  // ローディング状態
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // 初期データ取得
  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);
  
  // ミッション一覧を取得
  const fetchMissions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // アクティブなミッションを取得
      const active = await getUserActiveMissions(user.id);
      setActiveMissions(active);
      
      // 完了したミッションを取得
      const completed = await getUserCompletedMissions(user.id);
      setCompletedMissions(completed);
    } catch (error) {
      console.error('Failed to fetch missions:', error);
      toast.show({
        title: "エラー",
        description: "ミッションの取得に失敗しました",
        status: "error"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // リフレッシュ
  const handleRefresh = () => {
    setRefreshing(true);
    fetchMissions();
  };
  
  // ミッション詳細表示
  const handleMissionPress = (mission: Mission) => {
    navigation.navigate(ROUTES.MISSION_DETAIL, { missionId: mission.id });
  };
  
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md">ミッション</Heading>
        <Box w={10} /> {/* バランスのための空ボックス */}
      </HStack>
      
      <ScrollView
        flex={1}
        px={4}
        py={2}
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
          {/* アクティブなミッション */}
          <VStack space={2}>
            <Heading size="sm" px={2}>アクティブなミッション</Heading>
            
            {loading ? (
              <Card>
                <Text textAlign="center" py={4}>読み込み中...</Text>
              </Card>
            ) : activeMissions.length > 0 ? (
              <VStack space={3}>
                {activeMissions.map((mission) => (
                  <Pressable key={mission.id} onPress={() => handleMissionPress(mission)}>
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
                  <Icon as={Ionicons} name="calendar-outline" size="3xl" color={COLORS.primary[500]} />
                  <Text textAlign="center" color={COLORS.text.secondary}>
                    現在アクティブなミッションはありません
                  </Text>
                </VStack>
              </Card>
            )}
          </VStack>
          
          {/* 完了したミッション */}
          <VStack space={2}>
            <Heading size="sm" px={2}>完了したミッション</Heading>
            
            {loading ? (
              <Card>
                <Text textAlign="center" py={4}>読み込み中...</Text>
              </Card>
            ) : completedMissions.length > 0 ? (
              <Card>
                <VStack divider={<Divider bg={COLORS.background.secondary} />}>
                  {completedMissions.map((mission) => (
                    <Pressable 
                      key={mission.id} 
                      onPress={() => handleMissionPress(mission)}
                      p={3}
                      _pressed={{ bg: COLORS.background.secondary }}
                    >
                      <HStack space={3} alignItems="center">
                        <Box
                          bg={COLORS.success[500]}
                          p={2}
                          rounded="full"
                        >
                          <Icon as={Ionicons} name="checkmark" size="sm" color="white" />
                        </Box>
                        <VStack flex={1}>
                          <Text fontWeight="bold">{mission.title}</Text>
                          <Text fontSize="xs" color={COLORS.text.secondary}>
                            完了: {formatDate(mission.completedAt || new Date())}
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
                  <Icon as={Ionicons} name="ribbon-outline" size="3xl" color={COLORS.primary[500]} />
                  <Text textAlign="center" color={COLORS.text.secondary}>
                    完了したミッションはまだありません
                  </Text>
                </VStack>
              </Card>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
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
const formatDate = (date: Date): string => {
  if (!date) return '';
  
  // YYYY/MM/DD形式
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export default MissionsScreen;