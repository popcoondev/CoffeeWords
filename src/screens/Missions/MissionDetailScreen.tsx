import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, HStack, Pressable, Icon, Button, useToast, Divider } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenProps, Mission } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';
import { useMissionStore } from '../../store/useMissionStore';
import { completeMission, getMission } from '../../services/firebase/mission';
import { useAuth } from '../../hooks/useAuth';

/**
 * ミッション詳細画面
 */
const MissionDetailScreen: React.FC = () => {
  const navigation = useNavigation<ScreenProps<'MissionDetail'>['navigation']>();
  const route = useRoute<ScreenProps<'MissionDetail'>['route']>();
  const toast = useToast();
  const { user } = useAuth();
  
  // ルートパラメータからミッションIDを取得
  const { missionId } = route.params;
  
  // ミッションストア
  const { setSelectedMission, completeMission: markMissionAsCompleted } = useMissionStore();
  
  // ミッション詳細
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  
  // ミッション詳細を取得
  useEffect(() => {
    fetchMissionDetail();
  }, [missionId]);
  
  // ミッション詳細取得
  const fetchMissionDetail = async () => {
    try {
      setLoading(true);
      
      // ミッション詳細を取得
      const missionDetail = await getMission(missionId);
      
      if (missionDetail) {
        setMission(missionDetail);
        setSelectedMission(missionDetail);
      } else {
        toast.show({
          title: "エラー",
          description: "ミッションが見つかりませんでした",
          status: "error"
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to fetch mission detail:', error);
      toast.show({
        title: "エラー",
        description: "ミッション情報の取得に失敗しました",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // ミッション開始
  const handleStartMission = () => {
    if (!mission) return;
    
    // 比較タイプのミッションの場合、比較対象のCoffeeIDを渡す
    if (mission.type === 'comparison' && mission.objectives.comparisonCoffeeId) {
      navigation.navigate(ROUTES.EXPLORATION_FLOW, { 
        missionId: mission.id,
        previousCoffeeId: mission.objectives.comparisonCoffeeId
      });
    } else {
      // 通常のミッション
      navigation.navigate(ROUTES.EXPLORATION_FLOW, { missionId: mission.id });
    }
  };
  
  // ミッション完了
  const handleCompleteMission = async () => {
    if (!mission || !user) return;
    
    try {
      setCompleting(true);
      
      // Firestoreでミッションを完了状態に更新
      await completeMission(mission.id);
      
      // ストア内のミッション状態も更新
      markMissionAsCompleted(mission.id);
      
      toast.show({
        title: "成功",
        description: "ミッションを完了しました！",
        status: "success"
      });
      
      // 一覧画面に戻る
      navigation.goBack();
    } catch (error) {
      console.error('Failed to complete mission:', error);
      toast.show({
        title: "エラー",
        description: "ミッション完了処理に失敗しました",
        status: "error"
      });
    } finally {
      setCompleting(false);
    }
  };
  
  // 戻るボタン
  const handleBack = () => {
    navigation.goBack();
  };
  
  if (loading) {
    return (
      <Box flex={1} bg={COLORS.background.primary} safeArea justifyContent="center" alignItems="center">
        <Text>読み込み中...</Text>
      </Box>
    );
  }
  
  if (!mission) {
    return (
      <Box flex={1} bg={COLORS.background.primary} safeArea justifyContent="center" alignItems="center">
        <Text>ミッション情報が見つかりませんでした</Text>
      </Box>
    );
  }
  
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={handleBack} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md">ミッション詳細</Heading>
        <Box w={10} /> {/* バランスのための空ボックス */}
      </HStack>
      
      <Box flex={1} px={4} py={2}>
        <VStack space={4} flex={1}>
          {/* ミッションヘッダー */}
          <VStack 
            bg={COLORS.primary[100]} 
            p={4} 
            rounded="xl"
            borderWidth={1}
            borderColor={COLORS.primary[300]}
          >
            <HStack space={2} alignItems="center" mb={2}>
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
            
            <Heading size="lg" mb={2}>{mission.title}</Heading>
            <Text fontSize="md" color={COLORS.text.secondary}>{mission.description}</Text>
            
            <HStack justifyContent="space-between" mt={4}>
              <VStack>
                <Text fontSize="xs" color={COLORS.text.light}>期限</Text>
                <Text>{formatDate(mission.expiresAt)}</Text>
              </VStack>
              
              <VStack alignItems="flex-end">
                <Text fontSize="xs" color={COLORS.text.light}>報酬</Text>
                <HStack alignItems="center">
                  <Icon as={Ionicons} name="trophy-outline" size="sm" color={COLORS.primary[500]} />
                  <Text fontSize="md" color={COLORS.primary[500]} ml={1} fontWeight="bold">
                    {mission.reward?.experiencePoints || 0} EXP
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
          
          {/* ミッション内容 */}
          <VStack space={4} flex={1}>
            {/* タスク内容 */}
            <VStack space={2}>
              <Heading size="sm">タスク</Heading>
              <Box
                bg={COLORS.background.secondary}
                p={3}
                rounded="md"
              >
                <Text>{mission.objectives.specificTask}</Text>
              </Box>
            </VStack>
            
            {/* ヒント */}
            {mission.helpTips && mission.helpTips.length > 0 && (
              <VStack space={2}>
                <Heading size="sm">ヒント</Heading>
                <Box
                  bg={COLORS.background.secondary}
                  p={3}
                  rounded="md"
                >
                  <VStack space={2} divider={<Divider bg={COLORS.background.primary} />}>
                    {mission.helpTips.map((tip, index) => (
                      <HStack key={index} space={2} alignItems="flex-start">
                        <Icon as={Ionicons} name="bulb-outline" size="sm" color={COLORS.warning[500]} mt={1} />
                        <Text flex={1}>{tip}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            )}
            
            {/* おすすめコーヒー */}
            {mission.relatedCoffeeRecommendations && mission.relatedCoffeeRecommendations.length > 0 && (
              <VStack space={2}>
                <Heading size="sm">おすすめコーヒー</Heading>
                <Box
                  bg={COLORS.background.secondary}
                  p={3}
                  rounded="md"
                >
                  <VStack space={1}>
                    {mission.relatedCoffeeRecommendations.map((coffee, index) => (
                      <HStack key={index} space={2} alignItems="center">
                        <Icon as={Ionicons} name="cafe-outline" size="sm" color={COLORS.primary[500]} />
                        <Text>{coffee}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            )}
          </VStack>
          
          {/* アクション */}
          <Box mb={4}>
            {mission.status === 'active' ? (
              <VStack space={3}>
                <Button
                  onPress={handleStartMission}
                  leftIcon={<Icon as={Ionicons} name="play" size="sm" />}
                  bg={COLORS.primary[500]}
                  _pressed={{ bg: COLORS.primary[600] }}
                >
                  ミッションを開始
                </Button>
                
                <Button
                  onPress={handleCompleteMission}
                  leftIcon={<Icon as={Ionicons} name="checkmark-circle" size="sm" />}
                  variant="outline"
                  isLoading={completing}
                  isDisabled={completing}
                >
                  完了としてマーク
                </Button>
              </VStack>
            ) : (
              <Button
                onPress={handleBack}
                leftIcon={<Icon as={Ionicons} name="arrow-back" size="sm" />}
                variant="outline"
              >
                戻る
              </Button>
            )}
          </Box>
        </VStack>
      </Box>
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

export default MissionDetailScreen;