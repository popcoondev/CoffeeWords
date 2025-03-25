/**
 * CoffeeTasteScreenのテスト
 * 
 * このテストでは、コーヒーの味わい記録画面の
 * ユーザー操作と状態管理をテストします。
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CoffeeTasteScreen from '../../src/screens/CoffeeRecord/CoffeeTasteScreen';
import { useNavigation } from '@react-navigation/native';
import { useCoffeeRecord } from '../../src/hooks/useCoffeeRecord';
import { useLanguageGeneration } from '../../src/hooks/useLanguageGeneration';
import { ROUTES } from '../../src/constants/routes';

// モックの設定
jest.mock('@react-navigation/native');
jest.mock('../../src/hooks/useCoffeeRecord');
jest.mock('../../src/hooks/useCoffeeStorage');
jest.mock('../../src/hooks/useLanguageGeneration');

// Native Base UIコンポーネントのモック
jest.mock('native-base', () => {
  return {
    ...jest.requireActual('native-base'),
    Box: ({ children, ...props }) => (
      <div data-testid="Box" {...props}>{children}</div>
    ),
    VStack: ({ children, ...props }) => (
      <div data-testid="VStack" {...props}>{children}</div>
    ),
    HStack: ({ children, ...props }) => (
      <div data-testid="HStack" {...props}>{children}</div>
    ),
    ScrollView: ({ children, ...props }) => (
      <div data-testid="ScrollView" {...props}>{children}</div>
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
    Heading: ({ children, ...props }) => (
      <h2 data-testid="Heading" {...props}>{children}</h2>
    ),
    Text: ({ children, ...props }) => (
      <span data-testid="Text" {...props}>{children}</span>
    ),
    Icon: ({ name, ...props }) => (
      <span data-testid="Icon" data-name={name} {...props}>{name}</span>
    ),
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
    Spinner: () => <div data-testid="Spinner">Loading...</div>,
    Center: ({ children, ...props }) => (
      <div data-testid="Center" {...props}>{children}</div>
    ),
    Modal: {
      Body: ({ children }) => <div data-testid="ModalBody">{children}</div>,
      Content: ({ children }) => <div data-testid="ModalContent">{children}</div>,
      Header: ({ children }) => <div data-testid="ModalHeader">{children}</div>,
      Footer: ({ children }) => <div data-testid="ModalFooter">{children}</div>,
      CloseButton: () => <button data-testid="ModalCloseButton">×</button>,
    },
    FormControl: {
      Label: ({ children }) => <label data-testid="FormControlLabel">{children}</label>,
      HelperText: ({ children }) => <div data-testid="FormControlHelperText">{children}</div>,
    },
    useToast: () => ({
      show: jest.fn(),
    }),
  };
});

// ChoiceButtonコンポーネントのモック
jest.mock('../../src/components/ui/ChoiceButton', () => ({
  ChoiceButton: ({ label, onPress, isSelected, ...props }) => (
    <button 
      data-testid={`ChoiceButton-${label}`}
      onClick={onPress}
      aria-selected={isSelected ? 'true' : 'false'}
      {...props}
    >
      {label}
    </button>
  ),
}));

// Tagコンポーネントのモック
jest.mock('../../src/components/ui/Tag', () => ({
  Tag: ({ label, onRemove, ...props }) => (
    <div data-testid={`Tag-${label}`} {...props}>
      {label}
      {onRemove && (
        <button 
          data-testid={`TagRemove-${label}`}
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </div>
  ),
}));

describe('CoffeeTasteScreen', () => {
  // モックのセットアップ関数
  const setupMocks = () => {
    // navigate のモック
    const mockNavigate = jest.fn();
    const mockGoBack = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
    });
    
    // useCoffeeRecord のモック
    const mockSetBody = jest.fn();
    const mockSetFlavor = jest.fn();
    const mockSetAftertaste = jest.fn();
    const mockSetLanguageResult = jest.fn();
    const mockSetTags = jest.fn();
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      name: 'テストコーヒー',
      roaster: 'テスト焙煎所',
      photoURL: null,
      body: null,
      flavor: [],
      aftertaste: null,
      languageResult: '',
      tags: [],
      isSubmitting: false,
      setBody: mockSetBody,
      setFlavor: mockSetFlavor,
      setAftertaste: mockSetAftertaste,
      setLanguageResult: mockSetLanguageResult,
      setTags: mockSetTags,
    });
    
    // useLanguageGeneration のモック
    const mockGenerateLanguage = jest.fn().mockResolvedValue({
      shortDescription: 'テスト用の言語化結果',
      detailedDescription: 'テスト用の詳細な説明',
      tags: ['テスト', 'モック', 'コーヒー'],
    });
    const mockCheckApiKey = jest.fn().mockResolvedValue(true);
    const mockSetupApiKey = jest.fn().mockResolvedValue(true);
    (useLanguageGeneration as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      result: null,
      hasKey: true,
      generateLanguage: mockGenerateLanguage,
      checkApiKey: mockCheckApiKey,
      setupApiKey: mockSetupApiKey,
    });
    
    return {
      mockNavigate,
      mockGoBack,
      mockSetBody,
      mockSetFlavor,
      mockSetAftertaste,
      mockSetLanguageResult,
      mockSetTags,
      mockGenerateLanguage,
      mockCheckApiKey,
      mockSetupApiKey,
    };
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('初期状態では最初の質問（ボディ感）が表示される', () => {
    setupMocks();
    
    const { getByTestId, getByText } = render(<CoffeeTasteScreen />);
    
    // 質問文が表示されていることを確認
    expect(getByText(/口の中でどのように感じましたか/)).toBeTruthy();
    
    // 選択肢が表示されていることを確認
    expect(getByTestId('ChoiceButton-軽い')).toBeTruthy();
    expect(getByTestId('ChoiceButton-ミディアム')).toBeTruthy();
    expect(getByTestId('ChoiceButton-重い')).toBeTruthy();
    
    // 次へボタンが非活性であることを確認
    const nextButton = getByTestId('Button');
    expect(nextButton.hasAttribute('disabled')).toBeTruthy();
  });
  
  it('ボディ感を選択すると次へボタンが活性化される', () => {
    const { mockSetBody } = setupMocks();
    
    // body が選択された状態を模倣
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: null,
      flavor: [],
      aftertaste: null,
      setBody: mockSetBody,
      setFlavor: jest.fn(),
      setAftertaste: jest.fn(),
    });
    
    const { getByTestId, rerender } = render(<CoffeeTasteScreen />);
    
    // ミディアムを選択
    const mediumButton = getByTestId('ChoiceButton-ミディアム');
    fireEvent.click(mediumButton);
    
    // setBodyが呼ばれたことを確認
    expect(mockSetBody).toHaveBeenCalledWith('medium');
    
    // body が選択された状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: [],
      aftertaste: null,
      setBody: mockSetBody,
      setFlavor: jest.fn(),
      setAftertaste: jest.fn(),
    });
    
    // 再レンダリング
    rerender(<CoffeeTasteScreen />);
    
    // 次へボタンが活性化されていることを確認
    const nextButton = getByTestId('Button');
    expect(nextButton.hasAttribute('disabled')).toBeFalsy();
  });
  
  it('3つの質問に順番に回答できる', async () => {
    const mocks = setupMocks();
    
    // 初期レンダリング（質問1: ボディ感）
    const { getByTestId, getByText, queryByText, rerender } = render(<CoffeeTasteScreen />);
    
    // 質問1: ボディ感を選択
    fireEvent.click(getByTestId('ChoiceButton-ミディアム'));
    expect(mocks.mockSetBody).toHaveBeenCalledWith('medium');
    
    // body が選択された状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: [],
      aftertaste: null,
      setBody: mocks.mockSetBody,
      setFlavor: mocks.mockSetFlavor,
      setAftertaste: mocks.mockSetAftertaste,
      setLanguageResult: mocks.mockSetLanguageResult,
      setTags: mocks.mockSetTags,
    });
    
    // 再レンダリング
    rerender(<CoffeeTasteScreen />);
    
    // 次へボタンをクリック
    fireEvent.click(getByTestId('Button'));
    
    // 質問2（風味）の状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: [],
      aftertaste: null,
      setBody: mocks.mockSetBody,
      setFlavor: mocks.mockSetFlavor,
      setAftertaste: mocks.mockSetAftertaste,
      setLanguageResult: mocks.mockSetLanguageResult,
      setTags: mocks.mockSetTags,
    });
    
    // 再レンダリング（質問2が表示されるはず）
    rerender(<CoffeeTasteScreen />);
    
    // 質問2: 風味を選択
    const chocoButton = queryByText('チョコレート系');
    if (chocoButton) {
      fireEvent.click(chocoButton);
    } else {
      const altButton = getByTestId('ChoiceButton-チョコレート系');
      fireEvent.click(altButton);
    }
    
    expect(mocks.mockSetFlavor).toHaveBeenCalled();
    
    // flavor が選択された状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: ['chocolate'],
      aftertaste: null,
      setBody: mocks.mockSetBody,
      setFlavor: mocks.mockSetFlavor,
      setAftertaste: mocks.mockSetAftertaste,
      setLanguageResult: mocks.mockSetLanguageResult,
      setTags: mocks.mockSetTags,
    });
    
    // 再レンダリング
    rerender(<CoffeeTasteScreen />);
    
    // 次へボタンをクリック
    fireEvent.click(getByTestId('Button'));
    
    // 質問3（余韻）の状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: ['chocolate'],
      aftertaste: null,
      setBody: mocks.mockSetBody,
      setFlavor: mocks.mockSetFlavor,
      setAftertaste: mocks.mockSetAftertaste,
      setLanguageResult: mocks.mockSetLanguageResult,
      setTags: mocks.mockSetTags,
    });
    
    // 再レンダリング（質問3が表示されるはず）
    rerender(<CoffeeTasteScreen />);
    
    // 質問3: 余韻を選択
    const mediumAfterButton = queryByText('中程度');
    if (mediumAfterButton) {
      fireEvent.click(mediumAfterButton);
    } else {
      const altButton = getByTestId('ChoiceButton-中程度');
      fireEvent.click(altButton);
    }
    
    expect(mocks.mockSetAftertaste).toHaveBeenCalledWith('medium');
    
    // aftertaste が選択された状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: ['chocolate'],
      aftertaste: 'medium',
      setBody: mocks.mockSetBody,
      setFlavor: mocks.mockSetFlavor,
      setAftertaste: mocks.mockSetAftertaste,
      setLanguageResult: mocks.mockSetLanguageResult,
      setTags: mocks.mockSetTags,
    });
    
    // 再レンダリング
    rerender(<CoffeeTasteScreen />);
    
    // 結果を見るボタンをクリック
    fireEvent.click(getByTestId('Button'));
    
    // 言語化が生成されるまで待つ
    await waitFor(() => {
      // generateLanguageが呼ばれたことを確認
      expect(mocks.mockGenerateLanguage).toHaveBeenCalledWith({
        body: 'medium',
        flavor: ['chocolate'],
        aftertaste: 'medium'
      });
      
      // 言語化結果がセットされたことを確認
      expect(mocks.mockSetLanguageResult).toHaveBeenCalled();
      
      // タグがセットされたことを確認
      expect(mocks.mockSetTags).toHaveBeenCalled();
      
      // 結果画面に遷移したことを確認
      expect(mocks.mockNavigate).toHaveBeenCalledWith(ROUTES.COFFEE_RECORD_RESULT);
    });
  });
  
  it('風味は複数選択できる', () => {
    const { mockSetFlavor } = setupMocks();
    
    // 質問2（風味）の状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: [],
      aftertaste: null,
      setBody: jest.fn(),
      setFlavor: mockSetFlavor,
      setAftertaste: jest.fn(),
    });
    
    const { getByTestId, rerender } = render(<CoffeeTasteScreen />);
    
    // currentQuestionを1（風味）に設定
    // コンポーネント内部の状態をモックするには、実際のコンポーネントコードに変更が必要になるため
    // ここでは別のアプローチを取ります
    
    // 「次へ」ボタンをクリックして質問2に進む
    fireEvent.click(getByTestId('Button'));
    
    // flavor が空の状態をシミュレート（質問2の表示）
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: [],
      aftertaste: null,
      setBody: jest.fn(),
      setFlavor: mockSetFlavor,
      setAftertaste: jest.fn(),
    });
    
    // 再レンダリング
    rerender(<CoffeeTasteScreen />);
    
    // チョコレート系を選択
    const chocoButton = getByTestId('ChoiceButton-チョコレート系');
    fireEvent.click(chocoButton);
    
    // handleFlavorToggleが呼ばれたことを確認
    expect(mockSetFlavor).toHaveBeenCalled();
    
    // flavor に chocolate が追加された状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: ['chocolate'],
      aftertaste: null,
      setBody: jest.fn(),
      setFlavor: mockSetFlavor,
      setAftertaste: jest.fn(),
    });
    
    // 再レンダリング
    rerender(<CoffeeTasteScreen />);
    
    // ナッツ系も選択
    const nuttyButton = getByTestId('ChoiceButton-ナッツ系');
    fireEvent.click(nuttyButton);
    
    // handleFlavorToggleが呼ばれたことを確認
    expect(mockSetFlavor).toHaveBeenCalled();
    
    // flavor に nutty も追加された状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: ['chocolate', 'nutty'],
      aftertaste: null,
      setBody: jest.fn(),
      setFlavor: mockSetFlavor,
      setAftertaste: jest.fn(),
    });
    
    // 再レンダリング
    rerender(<CoffeeTasteScreen />);
    
    // チョコレート系の選択を解除
    fireEvent.click(chocoButton);
    
    // handleFlavorToggleが呼ばれたことを確認
    expect(mockSetFlavor).toHaveBeenCalled();
  });
  
  it('APIキーがない場合はモーダルが表示される', async () => {
    // hasKey が false の状態をシミュレート
    (useLanguageGeneration as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      result: null,
      hasKey: false,
      generateLanguage: jest.fn(),
      checkApiKey: jest.fn().mockResolvedValue(false),
      setupApiKey: jest.fn().mockResolvedValue(true),
    });
    
    // 全ての質問に回答済みの状態をシミュレート
    (useCoffeeRecord as jest.Mock).mockReturnValue({
      body: 'medium',
      flavor: ['chocolate'],
      aftertaste: 'medium',
      setBody: jest.fn(),
      setFlavor: jest.fn(),
      setAftertaste: jest.fn(),
      setLanguageResult: jest.fn(),
      setTags: jest.fn(),
    });
    
    const { getByTestId, queryByTestId } = render(<CoffeeTasteScreen />);
    
    // currentQuestion を 2 に設定（質問3の表示）
    // コンポーネント内部の状態をモックするのは難しいので、
    // ここでは「次へ」ボタンをクリックして進めます
    
    // 「結果を見る」ボタンをクリック
    fireEvent.click(getByTestId('Button'));
    
    // APIキーの設定モーダルが表示されることを確認
    const modalContent = queryByTestId('ModalContent');
    expect(modalContent).toBeTruthy();
  });
});