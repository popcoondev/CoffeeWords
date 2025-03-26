import { create } from 'zustand';
import { 
  CoffeeInfo, 
  MapPosition, 
  MapCharacteristics, 
  UserPreferences, 
  ComparisonData, 
  DecodeResult 
} from '../types';

// 探検データを管理するStore
interface ExplorationState {
  // 基本情報
  coffeeInfo: CoffeeInfo;
  // マップ位置
  mapPosition: MapPosition;
  mapCharacteristics: MapCharacteristics | null;
  // 好み評価
  preferences: UserPreferences;
  // 比較（2回目以降のみ）
  comparison: ComparisonData | null;
  // AI解析結果
  decodeResult: DecodeResult | null;
  // ローディング状態
  loading: boolean;
  
  // アクション
  setCoffeeInfo: (info: Partial<CoffeeInfo>) => void;
  setMapPosition: (position: MapPosition, characteristics: MapCharacteristics) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setComparison: (comparison: ComparisonData | null) => void;
  setDecodeResult: (result: DecodeResult) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

// デフォルト値
const defaultCoffeeInfo: CoffeeInfo = {
  name: '',
  roaster: '',
  origin: '',
  photoURL: '',
};

const defaultMapPosition: MapPosition = {
  x: 200,
  y: 200,
};

const defaultPreferences: UserPreferences = {
  overallRating: 3,
  likedPoints: [],
  wouldDrinkAgain: 3,
  drinkingScene: [],
};

// Storeの作成
export const useExplorationStore = create<ExplorationState>((set) => ({
  // 初期状態
  coffeeInfo: defaultCoffeeInfo,
  mapPosition: defaultMapPosition,
  mapCharacteristics: null,
  preferences: defaultPreferences,
  comparison: null,
  decodeResult: null,
  loading: false,
  
  // アクション
  setCoffeeInfo: (info) => set((state) => ({
    coffeeInfo: { ...state.coffeeInfo, ...info },
  })),
  
  setMapPosition: (position, characteristics) => set({
    mapPosition: position,
    mapCharacteristics: characteristics,
  }),
  
  setPreferences: (prefs) => set((state) => ({
    preferences: { ...state.preferences, ...prefs },
  })),
  
  setComparison: (comparison) => set({
    comparison,
  }),
  
  setDecodeResult: (result) => set({
    decodeResult: result,
  }),
  
  setLoading: (loading) => set({
    loading,
  }),
  
  // リセット
  reset: () => set({
    coffeeInfo: defaultCoffeeInfo,
    mapPosition: defaultMapPosition,
    mapCharacteristics: null,
    preferences: defaultPreferences,
    comparison: null,
    decodeResult: null,
    loading: false,
  }),
}));