import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, VStack, HStack, Text, Heading, Icon, Pressable, Button, useToast } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui/Card';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ScreenProps, DictionaryTerm } from '../../types';
import { useDictionaryStore } from '../../store/useDictionaryStore';
import { getDictionaryTerm, incrementDiscoveryCount, updateDictionaryTerm } from '../../services/firebase/dictionary';

/**
 * 用語詳細画面
 * 用語の詳細情報を表示し、マスターレベルの更新や関連用語の閲覧ができる
 */
const TermDetailScreen: React.FC = () => {
  const navigation = useNavigation<ScreenProps<'TermDetail'>['navigation']>();
  const route = useRoute<ScreenProps<'TermDetail'>['route']>();
  const toast = useToast();
  const termId = route.params?.termId;
  
  // 辞書ストア
  const { 
    selectedTerm, 
    setSelectedTerm,
    incrementMasteryLevel: incrementStoreMasteryLevel
  } = useDictionaryStore();
  
  // ローカルステート
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState<DictionaryTerm | null>(selectedTerm);
  
  // 用語データの取得
  useEffect(() => {
    if (!termId) {
      navigation.goBack();
      return;
    }
    
    if (!selectedTerm || selectedTerm.id !== termId) {
      fetchTermData();
    }
  }, [termId]);
  
  // 用語データの取得
  const fetchTermData = async () => {
    if (!termId) return;
    
    try {
      setLoading(true);
      const termData = await getDictionaryTerm(termId);
      
      if (termData) {
        setTerm(termData);
        setSelectedTerm(termData);
      } else {
        toast.show({
          title: "エラー",
          description: "用語が見つかりませんでした",
          status: "error"
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching term data:', error);
      toast.show({
        title: "データ取得エラー",
        description: "用語データの読み込み中にエラーが発生しました",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // マスターレベルを上げる
  const handleIncreaseMasteryLevel = async () => {
    if (!term) return;
    
    try {
      setLoading(true);
      
      // マスターレベルが最大値未満の場合のみ増加
      if (term.masteryLevel < 5) {
        // Firestoreの更新
        await updateDictionaryTerm(term.id, { 
          masteryLevel: term.masteryLevel + 1,
          // マスターレベルに応じて探検状態を更新
          explorationStatus: term.masteryLevel + 1 >= 4 ? 'mastered' : 
                            term.masteryLevel + 1 >= 2 ? 'learning' : 'discovered'
        });
        
        // ストアの更新
        incrementStoreMasteryLevel(term.id);
        
        // ローカルステートの更新
        setTerm(prev => {
          if (!prev) return null;
          
          const newMasteryLevel = prev.masteryLevel + 1;
          let explorationStatus = prev.explorationStatus;
          
          if (newMasteryLevel >= 4) {
            explorationStatus = 'mastered';
          } else if (newMasteryLevel >= 2) {
            explorationStatus = 'learning';
          }
          
          return {
            ...prev,
            masteryLevel: newMasteryLevel,
            explorationStatus,
            updatedAt: new Date()
          };
        });
        
        toast.show({
          title: "マスターレベルアップ",
          description: `「${term.term}」のマスターレベルが上がりました`,
          status: "success"
        });
      } else {
        toast.show({
          title: "マスターレベル最大",
          description: "すでに最高レベルに達しています",
          status: "info"
        });
      }
    } catch (error) {
      console.error('Error updating mastery level:', error);
      toast.show({
        title: "更新エラー",
        description: "マスターレベルの更新中にエラーが発生しました",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 発見回数を増やす
  const handleIncrementDiscoveryCount = async () => {
    if (!term) return;
    
    try {
      setLoading(true);
      
      // Firestoreの更新
      await incrementDiscoveryCount(term.id);
      
      // ローカルステートの更新
      setTerm(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          discoveryCount: prev.discoveryCount + 1,
          lastEncounteredAt: new Date(),
          updatedAt: new Date()
        };
      });
      
      toast.show({
        title: "発見回数増加",
        description: `「${term.term}」の発見回数が増えました`,
        status: "success"
      });
    } catch (error) {
      console.error('Error incrementing discovery count:', error);
      toast.show({
        title: "更新エラー",
        description: "発見回数の更新中にエラーが発生しました",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 編集画面に遷移
  const handleEdit = () => {
    if (!term) return;
    navigation.navigate(ROUTES.TERM_EDIT, { termId: term.id, termData: term });
  };
  
  // 関連用語の詳細画面に遷移
  const handleRelatedTermPress = (relatedTermId: string) => {
    navigation.navigate(ROUTES.TERM_DETAIL, { termId: relatedTermId });
  };
  
  if (loading || !term) {
    return (
      <Box flex={1} bg={COLORS.background.primary} p={4} justifyContent="center" alignItems="center">
        <Text>読み込み中...</Text>
      </Box>
    );
  }
  
  return (
    <ScrollView flex={1} bg={COLORS.background.primary} px={4} pt={2} pb={6}>
      <VStack space={6}>
        {/* ヘッダー */}
        <VStack space={1}>
          <HStack space={2} alignItems="center">
            <Heading size="lg">{term.term}</Heading>
            <Box
              px={2}
              py={1}
              bg={getCategoryColor(term.category)}
              rounded="md"
            >
              <Text fontSize="xs" color="white" fontWeight="bold">
                {translateCategory(term.category)}
              </Text>
            </Box>
          </HStack>
          
          <HStack space={2} alignItems="center">
            <HStack alignItems="center" space={1}>
              <Icon as={Ionicons} name="star" size="xs" color={COLORS.primary[500]} />
              <Text fontSize="xs" color={COLORS.text.secondary}>
                マスターレベル: {term.masteryLevel}/5
              </Text>
            </HStack>
            
            <HStack alignItems="center" space={1}>
              <Icon as={Ionicons} name="eye" size="xs" color={COLORS.text.secondary} />
              <Text fontSize="xs" color={COLORS.text.secondary}>
                {term.discoveryCount}回発見
              </Text>
            </HStack>
            
            <HStack alignItems="center" space={1}>
              <Icon as={Ionicons} name="time" size="xs" color={COLORS.text.secondary} />
              <Text fontSize="xs" color={COLORS.text.secondary}>
                最終更新: {formatDate(term.updatedAt)}
              </Text>
            </HStack>
          </HStack>
        </VStack>
        
        {/* プロの定義 */}
        <Card>
          <VStack space={2}>
            <HStack space={2} alignItems="center">
              <Icon as={Ionicons} name="school-outline" size="md" color={COLORS.primary[500]} />
              <Heading size="sm">プロの定義</Heading>
            </HStack>
            
            <Text color={COLORS.text.primary} fontSize="md">
              {term.professionalDefinition}
            </Text>
          </VStack>
        </Card>
        
        {/* あなたの解釈 */}
        <Card>
          <VStack space={2}>
            <HStack space={2} alignItems="center">
              <Icon as={Ionicons} name="person-outline" size="md" color={COLORS.primary[500]} />
              <Heading size="sm">あなたの解釈</Heading>
            </HStack>
            
            <Text color={COLORS.text.primary} fontSize="md">
              {term.personalInterpretation}
            </Text>
          </VStack>
        </Card>
        
        {/* 具体例 */}
        {term.examples && term.examples.length > 0 && (
          <Card>
            <VStack space={2}>
              <HStack space={2} alignItems="center">
                <Icon as={Ionicons} name="cafe-outline" size="md" color={COLORS.primary[500]} />
                <Heading size="sm">具体例</Heading>
              </HStack>
              
              <VStack space={2} pl={2}>
                {term.examples.map((example, index) => (
                  <HStack key={index} space={2} alignItems="flex-start">
                    <Icon as={Ionicons} name="chevron-forward" size="sm" color={COLORS.primary[500]} />
                    <Text flex={1} color={COLORS.text.primary}>
                      {example}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Card>
        )}
        
        {/* 関連用語 */}
        {term.relatedTerms && term.relatedTerms.length > 0 && (
          <Card>
            <VStack space={2}>
              <HStack space={2} alignItems="center">
                <Icon as={Ionicons} name="link-outline" size="md" color={COLORS.primary[500]} />
                <Heading size="sm">関連用語</Heading>
              </HStack>
              
              <HStack flexWrap="wrap" space={2}>
                {term.relatedTerms.map((relatedTermId, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleRelatedTermPress(relatedTermId)}
                    bg={COLORS.background.secondary}
                    px={3}
                    py={1}
                    rounded="full"
                    mb={2}
                  >
                    <Text fontSize="sm" color={COLORS.primary[500]}>
                      {relatedTermId} {/* TODO: 実際の用語名を表示する */}
                    </Text>
                  </Pressable>
                ))}
              </HStack>
            </VStack>
          </Card>
        )}
        
        {/* アクションボタン */}
        <HStack space={2} justifyContent="center">
          <Button
            flex={1}
            leftIcon={<Icon as={Ionicons} name="star-outline" size="sm" />}
            onPress={handleIncreaseMasteryLevel}
            isDisabled={term.masteryLevel >= 5}
          >
            レベルアップ
          </Button>
          
          <Button
            flex={1}
            variant="outline"
            leftIcon={<Icon as={Ionicons} name="eye-outline" size="sm" />}
            onPress={handleIncrementDiscoveryCount}
          >
            発見した
          </Button>
          
          <Button
            flex={1}
            variant="ghost"
            leftIcon={<Icon as={Ionicons} name="create-outline" size="sm" />}
            onPress={handleEdit}
          >
            編集
          </Button>
        </HStack>
      </VStack>
    </ScrollView>
  );
};

// カテゴリの日本語変換
const translateCategory = (category: string): string => {
  const translations: Record<string, string> = {
    'acidity': '酸味',
    'sweetness': '甘み',
    'bitterness': '苦味',
    'body': 'ボディ',
    'aroma': '香り',
    'aftertaste': '余韻',
    'other': 'その他'
  };
  
  return translations[category] || category;
};

// カテゴリに基づく色を取得
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'acidity': '#FFD700',     // 黄色（酸味）
    'sweetness': '#FF9800',   // オレンジ（甘み）
    'bitterness': '#8B4513',  // 茶色（苦味）
    'body': '#A0522D',        // 赤茶色（ボディ）
    'aroma': '#FF69B4',       // ピンク（香り）
    'aftertaste': '#9370DB',  // 紫（余韻）
    'other': '#2196F3'        // 青（その他）
  };
  
  return colors[category] || COLORS.primary[500];
};

// 日付フォーマット
const formatDate = (date: Date): string => {
  if (!date) return '';
  
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export default TermDetailScreen;