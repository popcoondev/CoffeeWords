import { create } from 'zustand';
import { CoffeeRecord } from '../types';

interface CoffeeRecordFormState {
  // 基本情報
  name: string;
  roaster: string;
  photoURL: string | null;
  
  // 味わい応答
  body: 'light' | 'medium' | 'heavy' | null;
  flavor: string[];
  aftertaste: 'short' | 'medium' | 'long' | null;
  
  // 結果
  languageResult: string;
  tags: string[];
  
  // アクション
  setName: (name: string) => void;
  setRoaster: (roaster: string) => void;
  setPhotoURL: (photoURL: string | null) => void;
  setBody: (body: 'light' | 'medium' | 'heavy' | null) => void;
  setFlavor: (flavor: string[]) => void;
  setAftertaste: (aftertaste: 'short' | 'medium' | 'long' | null) => void;
  setLanguageResult: (languageResult: string) => void;
  setTags: (tags: string[]) => void;
  reset: () => void;
}

export const useCoffeeRecordStore = create<CoffeeRecordFormState>((set) => ({
  // 基本情報
  name: '',
  roaster: '',
  photoURL: null,
  
  // 味わい応答
  body: null,
  flavor: [],
  aftertaste: null,
  
  // 結果
  languageResult: '',
  tags: [],
  
  // アクション
  setName: (name) => set({ name }),
  setRoaster: (roaster) => set({ roaster }),
  setPhotoURL: (photoURL) => set({ photoURL }),
  setBody: (body) => set({ body }),
  setFlavor: (flavor) => set({ flavor }),
  setAftertaste: (aftertaste) => set({ aftertaste }),
  setLanguageResult: (languageResult) => set({ languageResult }),
  setTags: (tags) => set({ tags }),
  reset: () => set({
    name: '',
    roaster: '',
    photoURL: null,
    body: null,
    flavor: [],
    aftertaste: null,
    languageResult: '',
    tags: [],
  }),
}));