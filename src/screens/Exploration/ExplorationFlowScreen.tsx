import React, { useEffect, useState } from 'react';
import { Box, VStack, Heading, Text, Button, Icon, Image, Center, useToast } from 'native-base';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { ScreenProps } from '../../types';
import { useMissionStore } from '../../store/useMissionStore';
import { useExplorationStore } from '../../store/useExplorationStore';

/**
 * 今日の探検フロー開始画面
 * 探検記録のためのフロー開始と説明を表示
 */
const ExplorationFlowScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();
  const { user } = useAuth();
  
  // ミッションストア
  const { activeMissions, fetchActiveMissions } = useMissionStore();
  
  // 探検ストア
  const { resetExploration } = useExplorationStore();
  
  // 関連ミッション (パラメーターから取得)
  const { missionId, previousCoffeeId } = route.params || {};
  const [selectedMission, setSelectedMission] = useState(null);
  
  // ローディング状態
  const [loading, setLoading] = useState(false);
  
  // 初期化
  useEffect(() => {
    resetExploration(); // 探検データをリセット
    
    // ミッションIDがある場合は対応するミッションを設定
    if (missionId && user) {
      setLoading(true);
      fetchActiveMissions(user.id)
        .then(missions => {
          const mission = missions.find(m => m.id === missionId);
          if (mission) {
            setSelectedMission(mission);
          }
        })
        .catch(error => {
          console.error('Failed to fetch missions:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [missionId, user]);
  
  // 探検を開始
  const handleStartExploration = () => {
    // コーヒー情報入力画面に遷移
    navigation.navigate(ROUTES.EXPLORATION_INFO);
  };
  
  // スキップして戻る
  const handleSkip = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: ROUTES.MAIN,
      })
    );
  };
  
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <VStack flex={1} px={6} py={4} justifyContent="space-between">
        <VStack space={6} alignItems="center" flex={1} justifyContent="center">
          <Icon 
            as={Ionicons} 
            name="cafe" 
            size="6xl" 
            color={COLORS.primary[500]} 
          />
          
          <VStack space={2} alignItems="center">
            <Heading size="xl" textAlign="center">
              今日の探検
            </Heading>
            <Text fontSize="md" textAlign="center" color={COLORS.text.secondary}>
              飲んだコーヒーを記録して、あなただけの味わい体験を解読しましょう。
            </Text>
          </VStack>
          
          {selectedMission && (
            <Box 
              bg={COLORS.primary[100]} 
              p={4} 
              rounded="xl" 
              borderWidth={1}
              borderColor={COLORS.primary[300]}
              w="full"
              mt={4}
            >
              <VStack space={2}>
                <HStack alignItems="center" space={2}>
                  <Icon as={Ionicons} name="trophy" color={COLORS.primary[500]} />
                  <Heading size="sm">今日のミッション</Heading>
                </HStack>
                <Text fontWeight="bold">{selectedMission.title}</Text>
                <Text fontSize="sm">{selectedMission.description}</Text>
              </VStack>
            </Box>
          )}
          
          {previousCoffeeId && (
            <Box 
              bg={COLORS.info[100]} 
              p={4} 
              rounded="xl" 
              borderWidth={1}
              borderColor={COLORS.info[300]}
              w="full"
              mt={2}
            >
              <VStack space={2}>
                <HStack alignItems="center" space={2}>
                  <Icon as={Ionicons} name="git-compare" color={COLORS.info[500]} />
                  <Heading size="sm">比較モード</Heading>
                </HStack>
                <Text fontSize="sm">
                  以前に記録したコーヒーと今回のコーヒーを比較します。違いを見つけて味覚を磨きましょう。
                </Text>
              </VStack>
            </Box>
          )}
        </VStack>
        
        <VStack space={4} w="full" mt={6}>
          <Button
            bg={COLORS.primary[500]}
            _pressed={{ bg: COLORS.primary[600] }}
            onPress={handleStartExploration}
            leftIcon={<Icon as={Ionicons} name="cafe" />}
            size="lg"
          >
            探検を始める
          </Button>
          
          <Button
            variant="ghost"
            onPress={handleSkip}
            _text={{ color: COLORS.text.light }}
          >
            今回はスキップ
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default ExplorationFlowScreen;