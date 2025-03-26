import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Box, VStack, Heading, Text, HStack, Pressable, Icon, Input, useToast, Button } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui/Card';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ScreenProps, DictionaryTerm, DiscoveredFlavor } from '../../types';
import { getUserDictionaryTerms, createDictionaryTerm } from '../../services/firebase/dictionary';
import { useAuth } from '../../hooks/useAuth';
import { useDictionaryStore } from '../../store/useDictionaryStore';

/**
 * 翻訳辞書画面
 * コーヒー用語の専門的な定義とユーザー自身の解釈を管理する
 */
const TranslationDictionaryScreen: React.FC = () => {
  const navigation = useNavigation<ScreenProps<'TranslationDictionary'>['navigation']>();
  const route = useRoute<ScreenProps<'TranslationDictionary'>['route']>();
  const toast = useToast();
  const { user } = useAuth();
  
  // 新しい発見がある場合
  const { newDiscovery } = route.params || {};
  
  // 辞書ストア
  const { 
    terms, 
    setTerms, 
    addTerm, 
    setSelectedTerm,
    loading: storeLoading,
    setLoading: setStoreLoading
  } = useDictionaryStore();
  
  // ローカルステート
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTerms, setFilteredTerms] = useState<DictionaryTerm[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // ユニークなカテゴリのリスト
  const categories = ['acidity', 'sweetness', 'bitterness', 'body', 'aroma', 'aftertaste'];
  
  // 初回データ取得
  useEffect(() => {
    if (user) {
      fetchDictionaryTerms();
    }
  }, [user]);
  
  // 検索とフィルタリングの適用
  useEffect(() => {
    if (terms.length > 0) {
      applyFilters();
    }
  }, [terms, searchQuery, selectedCategory]);
  
  // 新しい発見があれば追加
  useEffect(() => {
    if (newDiscovery) {
      handleAddNewDiscovery(newDiscovery);
    }
  }, [newDiscovery]);
  
  // 辞書用語の取得
  const fetchDictionaryTerms = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setStoreLoading(true);
      
      // 用語を取得
      const userTerms = await getUserDictionaryTerms(user.id);
      setTerms(userTerms);
      setFilteredTerms(userTerms);
      
    } catch (error) {
      console.error('Error fetching dictionary terms:', error);
      toast.show({
        title: "データ取得エラー",
        description: "辞書用語の読み込み中にエラーが発生しました",
        status: "error"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setStoreLoading(false);
    }
  };
  
  // 検索とフィルタリングを適用
  const applyFilters = () => {
    let result = [...terms];
    
    // 検索クエリでフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(term => 
        term.term.toLowerCase().includes(query) || 
        term.personalInterpretation.toLowerCase().includes(query)
      );
    }
    
    // カテゴリでフィルタリング
    if (selectedCategory) {
      result = result.filter(term => term.category === selectedCategory);
    }
    
    // マスターレベルでソート（高い順）
    result.sort((a, b) => b.masteryLevel - a.masteryLevel);
    
    setFilteredTerms(result);
  };
  
  // リフレッシュ処理
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDictionaryTerms();
  };
  
  // 用語詳細画面に遷移
  const handleTermPress = (term: DictionaryTerm) => {
    setSelectedTerm(term);
    // 用語詳細画面が実装されるまではトースト表示
    toast.show({
      title: term.term,
      description: `プロ: ${term.professionalDefinition}\nあなた: ${term.personalInterpretation}`,
      status: "info",
      duration: 5000
    });
    // 実装後は以下のコメントを解除
    // navigation.navigate(ROUTES.TERM_DETAIL, { termId: term.id });
  };
  
  // カテゴリを選択
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };
  
  // 新しい発見を辞書に追加
  const handleAddNewDiscovery = async (discovery: DiscoveredFlavor) => {
    if (!user) return;
    
    try {
      // Firestoreに追加
      const now = new Date();
      const termId = await createDictionaryTerm(
        user.id,
        discovery.name,
        discovery.category as DictionaryTerm['category'],
        discovery.description,
        discovery.userInterpretation,
        [],
        []
      );
      
      // 新しい用語オブジェクトを作成
      const newTerm: DictionaryTerm = {
        id: termId,
        userId: user.id,
        createdAt: now,
        updatedAt: now,
        term: discovery.name,
        category: discovery.category as DictionaryTerm['category'],
        professionalDefinition: discovery.description,
        personalInterpretation: discovery.userInterpretation,
        masteryLevel: 1,
        discoveryCount: 1,
        lastEncounteredAt: now,
        firstDiscoveredAt: now,
        relatedCoffeeIds: [],
        relatedTerms: [],
        examples: [],
        explorationStatus: 'discovered'
      };
      
      // ストアに追加
      addTerm(newTerm);
      
      // 通知表示
      toast.show({
        title: "新しい発見",
        description: `「${discovery.name}」を辞書に追加しました`,
        status: "success"
      });
      
      // カテゴリを自動選択
      setSelectedCategory(discovery.category as DictionaryTerm['category']);
      
    } catch (error) {
      console.error('Error adding new discovery:', error);
      toast.show({
        title: "エラー",
        description: "新しい発見を追加できませんでした",
        status: "error"
      });
    }
  };
  
  // 翻訳ツールを開く
  const handleOpenTranslationTool = () => {
    // 翻訳ツール画面が実装されるまではトースト表示
    toast.show({
      title: "準備中",
      description: "翻訳ツールは近日公開予定です",
      status: "info"
    });
    // 実装後は以下のコメントを解除
    // navigation.navigate(ROUTES.TRANSLATION_TOOL);
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
        {/* 検索バー */}
        <Input
          placeholder="用語を検索..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          width="100%"
          borderRadius="lg"
          py={3}
          px={4}
          fontSize="md"
          bg="white"
          borderWidth={1}
          borderColor={COLORS.background.secondary}
          InputLeftElement={
            <Icon
              as={Ionicons}
              name="search"
              size={5}
              ml={2}
              color={COLORS.text.light}
            />
          }
        />
        
        {/* カテゴリフィルター */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space={2} py={2}>
            {categories.map(category => (
              <Pressable
                key={category}
                onPress={() => handleCategorySelect(category)}
                bg={selectedCategory === category ? COLORS.primary[500] : 'white'}
                px={4}
                py={2}
                rounded="full"
                borderWidth={1}
                borderColor={COLORS.primary[500]}
              >
                <Text
                  color={selectedCategory === category ? 'white' : COLORS.primary[500]}
                  fontSize="sm"
                >
                  {translateCategory(category)}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>
        
        {/* 翻訳辞書 */}
        <VStack space={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="md">あなたの翻訳辞書</Heading>
            <Text fontSize="sm" color={COLORS.text.secondary}>
              {terms.length}個の用語
            </Text>
          </HStack>
          
          {loading ? (
            <Card>
              <Text textAlign="center" py={4}>読み込み中...</Text>
            </Card>
          ) : filteredTerms.length > 0 ? (
            <VStack space={3}>
              {/* マスター済み */}
              {renderTermsSection('マスター済み', 'star', filteredTerms.filter(term => term.masteryLevel >= 4))}
              
              {/* 学習中 */}
              {renderTermsSection('学習中', 'school', filteredTerms.filter(term => term.masteryLevel >= 2 && term.masteryLevel < 4))}
              
              {/* これから */}
              {renderTermsSection('これから', 'leaf', filteredTerms.filter(term => term.masteryLevel < 2))}
            </VStack>
          ) : (
            <Card>
              <VStack space={3} alignItems="center" py={4}>
                <Icon as={Ionicons} name="book-outline" size="3xl" color={COLORS.primary[500]} />
                <Text textAlign="center" color={COLORS.text.secondary}>
                  {searchQuery || selectedCategory
                    ? '検索条件に一致する用語が見つかりませんでした'
                    : 'まだ辞書に用語がありません。探検を始めましょう'}
                </Text>
                {!searchQuery && !selectedCategory && (
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => navigation.navigate(ROUTES.EXPLORATION_FLOW)}
                    leftIcon={<Icon as={Ionicons} name="cafe" size="sm" />}
                  >
                    新しい探検を始める
                  </Button>
                )}
              </VStack>
            </Card>
          )}
        </VStack>
        
        {/* 翻訳ツール */}
        <VStack space={2}>
          <Heading size="md">翻訳ツール</Heading>
          <Card>
            <VStack space={3} py={2}>
              <Text fontSize="sm" color={COLORS.text.secondary}>
                コーヒーの専門用語をあなた流に翻訳したり、
                あなたの言葉をプロの言葉に翻訳したりできます。
              </Text>
              <Pressable
                bg={COLORS.primary[500]}
                _pressed={{ bg: COLORS.primary[600] }}
                px={4}
                py={3}
                rounded="md"
                onPress={handleOpenTranslationTool}
              >
                <HStack alignItems="center" justifyContent="center" space={2}>
                  <Icon as={Ionicons} name="language-outline" color="white" size="sm" />
                  <Text color="white" fontWeight="bold">翻訳ツールを開く</Text>
                </HStack>
              </Pressable>
            </VStack>
          </Card>
        </VStack>
        
        {/* 今日の学習テーマ */}
        <VStack space={2}>
          <Heading size="md">今日の学習テーマ</Heading>
          <Card>
            <VStack space={3}>
              <HStack space={2} alignItems="center">
                <Icon as={Ionicons} name="bulb-outline" size="md" color={COLORS.primary[500]} />
                <Text fontWeight="bold" fontSize="md">
                  「酸味」と「明るさ」の違い
                </Text>
              </HStack>
              
              <VStack space={2} px={2}>
                <Text fontSize="sm" fontWeight="bold" color={COLORS.primary[500]}>
                  酸味:
                </Text>
                <Text fontSize="sm" color={COLORS.text.secondary}>
                  舌の側面で感じる、レモンやリンゴのような味わい。
                  コーヒーに含まれる有機酸による明確な味覚刺激です。
                </Text>
                
                <Text fontSize="sm" fontWeight="bold" color={COLORS.primary[500]} mt={2}>
                  明るさ:
                </Text>
                <Text fontSize="sm" color={COLORS.text.secondary}>
                  全体的な印象の軽やかさや活気ある感じ。
                  必ずしも酸味だけでなく、香りも含めた総合的な特性です。
                </Text>
                
                <Text fontSize="sm" fontWeight="bold" color={COLORS.primary[500]} mt={2}>
                  あなたにとって:
                </Text>
                <Text fontSize="sm" color={COLORS.text.secondary}>
                  あなたはこれまで酸味を「さっぱりした感じ」と表現しています。
                  明るさをより理解するには、エチオピアの豆を試してみましょう。
                </Text>
              </VStack>
              
              <Button 
                variant="ghost" 
                size="sm" 
                colorScheme="primary"
                onPress={() => navigation.navigate(ROUTES.EXPLORATION_FLOW)}
              >
                探検して確かめる
              </Button>
            </VStack>
          </Card>
        </VStack>
      </VStack>
    </ScrollView>
  );
  
  // セクションをレンダリングする関数
  function renderTermsSection(title: string, icon: string, items: DictionaryTerm[]) {
    if (items.length === 0) return null;
    
    return (
      <VStack bg="white" rounded="lg" overflow="hidden" shadow={1}>
        <HStack
          bg={COLORS.background.secondary}
          px={4}
          py={2}
          alignItems="center"
          space={2}
          justifyContent="space-between"
        >
          <HStack space={2} alignItems="center">
            <Icon as={Ionicons} name={`${icon}-outline`} color={COLORS.primary[500]} />
            <Text fontWeight="bold" color={COLORS.text.primary}>
              {title}
            </Text>
          </HStack>
          <Box px={2} py={0.5} bg={COLORS.primary[100]} rounded="md">
            <Text fontSize="xs" color={COLORS.primary[800]}>
              {items.length}
            </Text>
          </Box>
        </HStack>
        
        <VStack divider={<Box bg={COLORS.text.light} h="1px" opacity={0.1} />}>
          {items.map(term => (
            <Pressable
              key={term.id}
              onPress={() => handleTermPress(term)}
              py={3}
              px={4}
              _pressed={{ bg: COLORS.background.secondary }}
            >
              <HStack justifyContent="space-between" alignItems="center">
                <VStack flex={1} mr={2}>
                  <HStack space={2} alignItems="center" flexWrap="wrap">
                    <Text fontWeight="bold">{term.term}</Text>
                    <Box
                      px={1.5}
                      py={0.5}
                      bg={getCategoryColor(term.category)}
                      rounded="sm"
                    >
                      <Text fontSize="2xs" color="white">
                        {translateCategory(term.category)}
                      </Text>
                    </Box>
                    {term.discoveryCount > 1 && (
                      <Box px={1} py={0} rounded="sm">
                        <Text fontSize="2xs" color={COLORS.text.secondary}>
                          {term.discoveryCount}回発見
                        </Text>
                      </Box>
                    )}
                  </HStack>
                  <Text fontSize="xs" color={COLORS.text.secondary} numberOfLines={1}>
                    あなた流: {term.personalInterpretation}
                  </Text>
                </VStack>
                <HStack space={2} alignItems="center">
                  <HStack>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        as={Ionicons}
                        name={i < term.masteryLevel ? "star" : "star-outline"}
                        size="xs"
                        color={i < term.masteryLevel ? COLORS.primary[500] : COLORS.text.light}
                      />
                    ))}
                  </HStack>
                  <Icon as={Ionicons} name="chevron-forward" size="sm" color={COLORS.text.light} />
                </HStack>
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </VStack>
    );
  }
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

export default TranslationDictionaryScreen;