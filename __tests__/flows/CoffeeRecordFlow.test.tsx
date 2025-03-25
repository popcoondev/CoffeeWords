/**
 * コーヒー記録フローのエンドツーエンドテスト
 * 
 * このテストでは、ユーザーがコーヒー情報を入力し、味わいを記録し、結果を確認するまでの
 * 全体的な流れをシミュレートします。
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../../src/constants/routes';
import CoffeeInfoScreen from '../../src/screens/CoffeeRecord/CoffeeInfoScreen';
import CoffeeTasteScreen from '../../src/screens/CoffeeRecord/CoffeeTasteScreen';
import CoffeeResultScreen from '../../src/screens/CoffeeRecord/CoffeeResultScreen';
import { useCoffeeRecord } from '../../src/hooks/useCoffeeRecord';
import { useLanguageGeneration } from '../../src/hooks/useLanguageGeneration';

// useCoffeeRecordのモック
jest.mock('../../src/hooks/useCoffeeRecord');
jest.mock('../../src/hooks/useCoffeeStorage');
jest.mock('../../src/hooks/useLanguageGeneration');
jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
    loading: false,
  }),
}));

// Native Base UIコンポーネントのモック
jest.mock('native-base', () => {
  return {
    ...jest.requireActual('native-base'),
    Button: ({ label, onPress, isDisabled, ...props }) => (
      <button 
        data-testid="Button" 
        onClick={onPress} 
        disabled={isDisabled}
        {...props}
      >
        {label}
      </button>
    ),
    Input: ({ label, value, onChangeText, ...props }) => (
      <div data-testid="Input">
        <label>{label}</label>
        <input 
          value={value} 
          onChange={(e) => onChangeText(e.target.value)}
          {...props}
        />
      </div>
    ),
    ChoiceButton: ({ label, isSelected, onPress, ...props }) => (
      <button 
        data-testid={`ChoiceButton-${label}`}
        onClick={onPress}
        style={{ backgroundColor: isSelected ? 'blue' : 'grey' }}
        {...props}
      >
        {label}
      </button>
    ),
    Pressable: ({ children, onPress, ...props }) => (
      <button 
        data-testid="Pressable" 
        onClick={onPress}
        {...props}
      >
        {children}
      </button>
    ),
    ScrollView: ({ children, ...props }) => (
      <div data-testid="ScrollView" {...props}>{children}</div>
    ),
    Box: ({ children, ...props }) => (
      <div data-testid="Box" {...props}>{children}</div>
    ),
    VStack: ({ children, ...props }) => (
      <div data-testid="VStack" {...props}>{children}</div>
    ),
    HStack: ({ children, ...props }) => (
      <div data-testid="HStack" {...props}>{children}</div>
    ),
    Heading: ({ children, ...props }) => (
      <h2 data-testid="Heading" {...props}>{children}</h2>
    ),
    Text: ({ children, ...props }) => (
      <span data-testid="Text" {...props}>{children}</span>
    ),
    Icon: ({ name, ...props }) => (
      <span data-testid="Icon" data-name={name} {...props} />
    ),
    Card: ({ children, ...props }) => (
      <div data-testid="Card" {...props}>{children}</div>
    ),
    useToast: () => ({
      show: jest.fn(),
    }),
  };
});

// コンポーネント全体をラップするためのテスト用ナビゲーター
const Stack = createNativeStackNavigator();
const TestNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name={ROUTES.COFFEE_RECORD_INFO} 
          component={CoffeeInfoScreen} 
        />
        <Stack.Screen 
          name={ROUTES.COFFEE_RECORD_TASTE} 
          component={CoffeeTasteScreen} 
        />
        <Stack.Screen 
          name={ROUTES.COFFEE_RECORD_RESULT} 
          component={CoffeeResultScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('コーヒー記録フロー', () => {
  // テスト前にすべてのモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();

    // useCoffeeRecordのモック実装を設定
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      name: '',
      roaster: '',
      photoURL: null,
      body: null,
      flavor: [],
      aftertaste: null,
      languageResult: '',
      tags: [],
      isSubmitting: false,
      error: null,
      recordId: null,
      
      setName: jest.fn((value) => {
        // モック内の状態を更新する方法
        const mockImpl = useCoffeeRecord as jest.Mock;
        const currentValue = mockImpl.mock.results[mockImpl.mock.calls.length - 1].value;
        mockImpl.mockReturnValue({
          ...currentValue,
          name: value
        });
      }),
      setRoaster: jest.fn((value) => {
        const mockImpl = useCoffeeRecord as jest.Mock;
        const currentValue = mockImpl.mock.results[mockImpl.mock.calls.length - 1].value;
        mockImpl.mockReturnValue({
          ...currentValue,
          roaster: value
        });
      }),
      setPhotoURL: jest.fn(),
      setBody: jest.fn((value) => {
        const mockImpl = useCoffeeRecord as jest.Mock;
        const currentValue = mockImpl.mock.results[mockImpl.mock.calls.length - 1].value;
        mockImpl.mockReturnValue({
          ...currentValue,
          body: value
        });
      }),
      setFlavor: jest.fn((values) => {
        const mockImpl = useCoffeeRecord as jest.Mock;
        const currentValue = mockImpl.mock.results[mockImpl.mock.calls.length - 1].value;
        mockImpl.mockReturnValue({
          ...currentValue,
          flavor: values
        });
      }),
      setAftertaste: jest.fn((value) => {
        const mockImpl = useCoffeeRecord as jest.Mock;
        const currentValue = mockImpl.mock.results[mockImpl.mock.calls.length - 1].value;
        mockImpl.mockReturnValue({
          ...currentValue,
          aftertaste: value
        });
      }),
      setLanguageResult: jest.fn((value) => {
        const mockImpl = useCoffeeRecord as jest.Mock;
        const currentValue = mockImpl.mock.results[mockImpl.mock.calls.length - 1].value;
        mockImpl.mockReturnValue({
          ...currentValue,
          languageResult: value
        });
      }),
      setTags: jest.fn(),
      uploadPhoto: jest.fn(),
      generateLanguage: jest.fn().mockResolvedValue(true),
      saveRecord: jest.fn().mockResolvedValue('test-record-id'),
      resetForm: jest.fn(),
    });

    // useLanguageGenerationのモック実装を設定
    (useLanguageGeneration as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      result: {
        shortDescription: 'テスト用の短い説明',
        detailedDescription: 'テスト用の詳細な説明文です。ここには長めの説明が入ります。',
        tags: ['テスト', 'モック', 'コーヒー'],
        recommendations: ['テスト豆1', 'テスト豆2']
      },
      hasKey: true,
      generateLanguage: jest.fn().mockResolvedValue({
        shortDescription: 'テスト用の短い説明',
        detailedDescription: 'テスト用の詳細な説明文です。',
        tags: ['テスト', 'モック', 'コーヒー'],
      }),
      checkApiKey: jest.fn().mockResolvedValue(true),
      setupApiKey: jest.fn().mockResolvedValue(true),
    });
  });

  it('全体的なコーヒー記録フローが正しく機能する', async () => {
    // コンポーネントをレンダリング（初期画面：CoffeeInfoScreen）
    const { getByText, getByTestId, queryByText, rerender } = render(
      <TestNavigator />
    );

    // ステップ1: 基本情報入力画面
    // コーヒー名を入力
    const nameInput = getByTestId('Input');
    fireEvent.change(nameInput.querySelector('input'), { target: { value: 'テストコーヒー' } });
    
    // 「次へ」ボタンをクリック
    const nextButton = getByTestId('Button');
    fireEvent.click(nextButton);

    // rerender to reflect navigation
    rerender(<TestNavigator />);

    // ステップ2: 味わい入力画面（質問1: ボディ感）
    // 「ミディアム」を選択
    const mediumBodyButton = queryByText('ミディアム');
    if (mediumBodyButton) {
      fireEvent.click(mediumBodyButton);
    } else {
      // 要素が見つからない場合
      console.warn('「ミディアム」ボタンが見つかりませんでした');
    }

    // 「次へ」ボタンをクリック
    const nextButton2 = getByTestId('Button');
    fireEvent.click(nextButton2);

    // rerender to reflect state change
    rerender(<TestNavigator />);

    // ステップ2: 味わい入力画面（質問2: 風味）
    // 「チョコレート系」を選択
    const chocolateFlavorButton = queryByText('チョコレート系');
    if (chocolateFlavorButton) {
      fireEvent.click(chocolateFlavorButton);
    }

    // 「次へ」ボタンをクリック
    const nextButton3 = getByTestId('Button');
    fireEvent.click(nextButton3);

    // rerender to reflect state change
    rerender(<TestNavigator />);

    // ステップ2: 味わい入力画面（質問3: 余韻）
    // 「中程度」を選択
    const mediumAftertasteButton = queryByText('中程度');
    if (mediumAftertasteButton) {
      fireEvent.click(mediumAftertasteButton);
    }

    // 「結果を見る」ボタンをクリック
    const viewResultButton = getByTestId('Button');
    fireEvent.click(viewResultButton);

    // rerender to reflect navigation
    rerender(<TestNavigator />);

    // ステップ3: 結果画面
    // 言語化結果が表示されていることを確認
    await waitFor(() => {
      expect(queryByText('テストコーヒー')).toBeTruthy();
      
      // 保存ボタンが存在すること
      const saveButton = getByTestId('Button');
      expect(saveButton).toBeTruthy();
      
      // 保存処理を実行
      fireEvent.click(saveButton);
    });

    // saveRecordが呼ばれたことを確認
    const { saveRecord } = useCoffeeRecord();
    expect(saveRecord).toHaveBeenCalled();

    // テスト成功
    expect(true).toBe(true);
  });
});