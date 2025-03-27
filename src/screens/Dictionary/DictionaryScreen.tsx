import React, { useState } from 'react';
import { Box, VStack, Heading, Text, HStack, Pressable, Icon, ScrollView, Input } from 'native-base';
import { TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui/Card';
import { RootStackParamList } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';

type DictionaryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

// 仮のデータ：ユーザーの理解度別用語
const masteredTerms = [
  { id: '1', term: '酸味', level: 5 },
  { id: '2', term: 'ボディ', level: 5 },
  { id: '3', term: '甘み', level: 5 },
];

const learningTerms = [
  { id: '4', term: 'フローラル', level: 3 },
  { id: '5', term: 'クリーン', level: 3 },
];

const newTerms = [
  { id: '6', term: '明るさ', level: 1 },
  { id: '7', term: '複雑性', level: 1 },
];

// 今日の学習テーマ
const todayLearningTheme = {
  title: '「酸味」と「明るさ」',
  content: [
    {
      term: '酸味',
      description: '舌の側面で感じるレモンやリンゴのような味わい',
    },
    {
      term: '明るさ',
      description: '全体的な印象の軽やかさや活気ある感じ',
    },
  ],
};

const DictionaryScreen: React.FC = () => {
  const navigation = useNavigation<DictionaryNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleTermPress = (termId: string) => {
    navigation.navigate(ROUTES.DICTIONARY_DETAIL, { termId });
  };

  // 星の表示
  const renderStars = (level: number) => {
    return (
      <HStack space={1}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon
            key={i}
            as={Ionicons}
            name={i < level ? 'star' : 'star-outline'}
            size="xs"
            color={i < level ? COLORS.primary[500] : COLORS.text.light}
          />
        ))}
      </HStack>
    );
  };

  return (
    <ScrollView flex={1} bg={COLORS.background.primary} px={4} pt={2} pb={6}>
      <VStack space={6}>
        {/* 検索バー */}
        <Box px={2}>
          <Box 
            bg="white" 
            borderWidth={1} 
            borderRadius="full" 
            borderColor={COLORS.text.light}
            flexDirection="row"
            alignItems="center"
          >
            <Icon
              as={Ionicons}
              name="search"
              size="sm"
              color={COLORS.text.light}
              ml={2}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="用語を検索"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
          </Box>
        </Box>

        {/* 理解度別用語 */}
        <VStack space={2}>
          <Heading size="md">あなたの辞典</Heading>
          <Card>
            <VStack space={4}>
              <VStack space={2}>
                <HStack space={2} alignItems="center">
                  {renderStars(5)}
                  <Text fontWeight="bold">マスター済み</Text>
                </HStack>
                <HStack flexWrap="wrap">
                  {masteredTerms.map((term) => (
                    <Pressable
                      key={term.id}
                      onPress={() => handleTermPress(term.id)}
                      bg={COLORS.background.secondary}
                      px={3}
                      py={1}
                      rounded="md"
                      m={1}
                      _pressed={{ opacity: 0.7 }}
                    >
                      <Text>{term.term}</Text>
                    </Pressable>
                  ))}
                </HStack>
              </VStack>

              <VStack space={2}>
                <HStack space={2} alignItems="center">
                  {renderStars(3)}
                  <Text fontWeight="bold">学習中</Text>
                </HStack>
                <HStack flexWrap="wrap">
                  {learningTerms.map((term) => (
                    <Pressable
                      key={term.id}
                      onPress={() => handleTermPress(term.id)}
                      bg={COLORS.background.secondary}
                      px={3}
                      py={1}
                      rounded="md"
                      m={1}
                      _pressed={{ opacity: 0.7 }}
                    >
                      <Text>{term.term}</Text>
                    </Pressable>
                  ))}
                </HStack>
              </VStack>

              <VStack space={2}>
                <HStack space={2} alignItems="center">
                  {renderStars(1)}
                  <Text fontWeight="bold">これから</Text>
                </HStack>
                <HStack flexWrap="wrap">
                  {newTerms.map((term) => (
                    <Pressable
                      key={term.id}
                      onPress={() => handleTermPress(term.id)}
                      bg={COLORS.background.secondary}
                      px={3}
                      py={1}
                      rounded="md"
                      m={1}
                      _pressed={{ opacity: 0.7 }}
                    >
                      <Text>{term.term}</Text>
                    </Pressable>
                  ))}
                </HStack>
              </VStack>
            </VStack>
          </Card>
        </VStack>

        {/* 今日の学習テーマ */}
        <VStack space={2}>
          <Heading size="md">今日の学習テーマ</Heading>
          <Card variant="accent">
            <VStack space={4}>
              <Heading size="sm">{todayLearningTheme.title}</Heading>
              
              <VStack space={3}>
                {todayLearningTheme.content.map((item, index) => (
                  <VStack key={index} space={1}>
                    <Text fontWeight="bold">{item.term}:</Text>
                    <Text>{item.description}</Text>
                  </VStack>
                ))}
              </VStack>
            </VStack>
          </Card>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    fontSize: 16,
    color: COLORS.text.primary,
  }
});

export default DictionaryScreen;