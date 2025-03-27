import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ユーザー関連の型定義
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferenceProfile?: PreferenceProfile;
}

// ナビゲーション型定義
export type RootStackParamList = {
  // スプラッシュ画面
  Splash: undefined;
  
  // 認証関連
  Onboarding: undefined;
  ExperienceLevel: undefined;
  Login: undefined;
  Signup: undefined;
  
  // メインタブ
  Main: undefined;
  Home: { decodeResult?: DecodeResult };
  Dictionary: { newDiscovery?: DiscoveredFlavor };
  TasteMap: undefined;
  
  // 探検フロー (旧コーヒー記録フロー)
  ExplorationFlow: { missionId?: string; previousCoffeeId?: string };
  ExplorationInfo: undefined;
  ExplorationTasteMap: { coffeeInfo: CoffeeInfo };
  ExplorationPreferences: { 
    coffeeInfo: CoffeeInfo;
    mapPosition: MapPosition;
    mapCharacteristics: MapCharacteristics;
  };
  ExplorationComparison: {
    coffeeInfo: CoffeeInfo;
    mapPosition: MapPosition;
    preferences: UserPreferences;
    comparedToId: string;
  };
  ExplorationResult: {
    coffeeInfo: CoffeeInfo;
    mapPosition: MapPosition;
    preferences: UserPreferences;
    comparison?: ComparisonData;
    decodeResult: DecodeResult;
  };
  
  // 翻訳辞書 (旧辞典)
  TranslationDictionary: { newDiscovery?: DiscoveredFlavor };
  TermDetail: { termId: string };
  TermEdit: { termId: string; termData: DictionaryTerm };
  TranslationTool: undefined;
  
  // 味わい探検マップ (旧好みプロフィール)
  TasteMapDetail: { regionId: string };
  PreferenceProfile: undefined;
  Recommendations: undefined;
  ExplorationHistory: undefined;
  
  // ミッション関連
  Missions: undefined;
  MissionDetail: { missionId: string };
  
  // 設定やプロフィール
  Settings: undefined;
  ApiKeySettings: undefined;
  
  // 旧ルート (後方互換性のため)
  CoffeeRecordFlow: undefined;
  CoffeeRecordInfo: undefined;
  CoffeeRecordTaste: undefined;
  CoffeeRecordResult: { recordId?: string };
  DictionaryDetail: { termId: string };
  Profile: undefined;
};

// 味覚プロファイル型定義 (旧定義)
export interface PreferenceProfile {
  acidity?: number;
  sweetness?: number;
  bitterness?: number;
  body?: number;
  floral?: number;
  fruity?: number;
  nutty?: number;
  chocolate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 旧定義 (後方互換性のため)
export interface CoffeeRecord {
  id: string;
  userId: string;
  createdAt: Date;
  coffeeInfo: {
    name: string;
    roaster?: string;
    photoURL?: string;
  };
  responses: {
    body?: 'light' | 'medium' | 'heavy';
    flavor?: string[];
    aftertaste?: 'short' | 'medium' | 'long';
  };
  languageResult: string;
  tags: string[];
}

// 旧定義 (後方互換性のため)
export interface DictionaryEntry {
  id: string;
  term: string;
  description: string;
  userInterpretation?: string;
  examples?: string[];
  masteryLevel: number; // 0-5
  userId: string;
}

// 旧定義 (後方互換性のため)
export interface AILanguageResponse {
  text: string;
  tags: string[];
  recommendations?: string[];
}

// 新しい型定義

// コーヒー基本情報
export interface CoffeeInfo {
  name: string;
  roaster?: string;
  origin?: string;
  photoURL?: string;
}

// マップ位置
export interface MapPosition {
  x: number; // 0-400
  y: number; // 0-400
}

// マップ特性
export interface MapCharacteristics {
  acidity: string | null;
  bitterness: string | null;
  body: string;
  acidityLevel: number; // 0-100
  bitternessLevel: number; // 0-100
  bodyLevel: number; // 0-100
}

// 好み評価
export interface UserPreferences {
  overallRating: number; // 1-5
  likedPoints: string[];
  likedPointsDetail?: string;
  dislikedPoints?: string[];
  dislikedPointsDetail?: string;
  wouldDrinkAgain: number; // 1-5
  drinkingScene: string[];
}

// 比較データ
export interface ComparisonData {
  comparedToId: string; // 比較対象の記録ID
  preferenceCompared: 'better' | 'same' | 'worse';
  notedDifferences?: string;
}

// 味わいプロファイル
export interface TasteProfile {
  acidity: number; // 1-5
  sweetness: number; // 1-5
  bitterness: number; // 1-5
  body: number; // 1-5
  complexity: number; // 1-5
}

// 発見した特性
export interface DiscoveredFlavor {
  id?: string;
  name: string;
  category: string;
  description: string;
  rarity: number; // 1-5
  isFirstDiscovery?: boolean;
  userInterpretation: string;
}

// 解読結果
export interface DecodeResult {
  professionalDescription: string;
  personalTranslation: string;
  tasteProfile: TasteProfile;
  preferenceInsight: string;
  discoveredFlavor: DiscoveredFlavor;
  nextExploration: string;
}

// コーヒー探検記録
export interface CoffeeExploration {
  id: string;
  userId: string;
  createdAt: Date;
  // 基本情報
  coffeeInfo: CoffeeInfo;
  // マップ位置
  tasteMapPosition: MapPosition;
  // 好み評価
  preferences: UserPreferences;
  // 比較（2回目以降のみ）
  comparison?: ComparisonData;
  // AI解析結果
  analysis: DecodeResult;
}

// 辞書用語
export interface DictionaryTerm {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  // 基本情報
  term: string;
  category: 'acidity' | 'sweetness' | 'bitterness' | 'body' | 'aroma' | 'aftertaste' | 'other';
  // 定義
  professionalDefinition: string;
  personalInterpretation: string;
  // メタデータ
  masteryLevel: number; // 1-5
  discoveryCount: number;
  lastEncounteredAt: Date;
  firstDiscoveredAt: Date;
  // 関連データ
  relatedCoffeeIds: string[];
  relatedTerms: string[];
  examples: string[];
  personalNotes?: string;
  // 探検状態
  explorationStatus: 'discovered' | 'learning' | 'mastered';
}

// ミッション
export interface Mission {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  // ミッション基本情報
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'discovery' | 'comparison' | 'challenge' | 'daily';
  // ミッション目標
  objectives: {
    targetFlavorId?: string;
    targetFlavorCategory?: string;
    targetRegionId?: string;
    comparisonCoffeeId?: string;
    specificTask?: string;
  };
  // ミッション状態
  status: 'active' | 'completed' | 'expired';
  completedAt?: Date;
  reward?: {
    badgeId?: string;
    experiencePoints: number;
    unlockFeatureId?: string;
  };
  // 関連データ
  relatedCoffeeRecommendations: string[]; // 推奨コーヒーID
  helpTips: string[]; // ヒント
}

// 通知関連の型定義
export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  type: 'mission' | 'discovery' | 'recommendation' | 'system';
  data?: {
    missionId?: string;
    termId?: string;
    explorationId?: string;
  };
}

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};