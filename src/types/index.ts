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

// コーヒー記録関連の型定義
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

// 味覚プロファイル型定義
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

// コーヒー辞典エントリー型定義
export interface DictionaryEntry {
  id: string;
  term: string;
  description: string;
  userInterpretation?: string;
  examples?: string[];
  masteryLevel: number; // 0-5
  userId: string;
}

// ナビゲーション型定義
export type RootStackParamList = {
  Onboarding: undefined;
  ExperienceLevel: undefined;
  Main: undefined;
  CoffeeRecordFlow: undefined;
  CoffeeRecordInfo: undefined;
  CoffeeRecordTaste: undefined;
  CoffeeRecordResult: { recordId?: string };
  DictionaryDetail: { termId: string };
  Profile: undefined;
  Settings: undefined;
  ApiKeySettings: undefined;
};

// API関連の型定義
export interface AILanguageResponse {
  text: string;
  tags: string[];
  recommendations?: string[];
}

// 通知関連の型定義
export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  type: 'training' | 'reminder' | 'discovery';
}