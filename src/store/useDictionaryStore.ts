import { create } from 'zustand';
import { DictionaryTerm } from '../types';

// 辞書を管理するStore
interface DictionaryState {
  // 辞書エントリー一覧
  terms: DictionaryTerm[];
  // 選択されている用語
  selectedTerm: DictionaryTerm | null;
  // ローディング状態
  loading: boolean;
  
  // アクション
  setTerms: (terms: DictionaryTerm[]) => void;
  setSelectedTerm: (term: DictionaryTerm | null) => void;
  addTerm: (term: DictionaryTerm) => void;
  updateTerm: (termId: string, updates: Partial<DictionaryTerm>) => void;
  incrementMasteryLevel: (termId: string) => void;
  setLoading: (loading: boolean) => void;
}

// Storeの作成
export const useDictionaryStore = create<DictionaryState>((set) => ({
  // 初期状態
  terms: [],
  selectedTerm: null,
  loading: false,
  
  // アクション
  setTerms: (terms) => set({
    terms,
  }),
  
  setSelectedTerm: (term) => set({
    selectedTerm: term,
  }),
  
  addTerm: (term) => set((state) => ({
    terms: [...state.terms, term],
  })),
  
  updateTerm: (termId, updates) => set((state) => ({
    terms: state.terms.map((term) => 
      term.id === termId ? { ...term, ...updates } : term
    ),
  })),
  
  incrementMasteryLevel: (termId) => set((state) => ({
    terms: state.terms.map((term) => {
      if (term.id === termId && term.masteryLevel < 5) {
        const newMasteryLevel = term.masteryLevel + 1;
        let explorationStatus = term.explorationStatus;
        
        // マスターレベルに応じて探検状態を更新
        if (newMasteryLevel >= 4) {
          explorationStatus = 'mastered';
        } else if (newMasteryLevel >= 2) {
          explorationStatus = 'learning';
        }
        
        return { 
          ...term, 
          masteryLevel: newMasteryLevel,
          explorationStatus,
          updatedAt: new Date()
        };
      }
      return term;
    }),
  })),
  
  setLoading: (loading) => set({
    loading,
  }),
}));