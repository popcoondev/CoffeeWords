import { create } from 'zustand';
import { Mission } from '../types';
import { getUserActiveMissions } from '../services/firebase/mission';

// ミッションを管理するStore
interface MissionState {
  // アクティブなミッション一覧
  activeMissions: Mission[];
  // 完了したミッション一覧
  completedMissions: Mission[];
  // 選択されているミッション
  selectedMission: Mission | null;
  // ローディング状態
  loading: boolean;
  // エラー状態
  error: string | null;
  
  // アクション
  setActiveMissions: (missions: Mission[]) => void;
  setCompletedMissions: (missions: Mission[]) => void;
  setSelectedMission: (mission: Mission | null) => void;
  addMission: (mission: Mission) => void;
  updateMission: (missionId: string, updates: Partial<Mission>) => void;
  completeMission: (missionId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // ミッションデータ取得
  fetchActiveMissions: (userId: string) => Promise<Mission[]>;
}

// Storeの作成
export const useMissionStore = create<MissionState>((set, get) => ({
  // 初期状態
  activeMissions: [],
  completedMissions: [],
  selectedMission: null,
  loading: false,
  error: null,
  
  // アクション
  setActiveMissions: (missions) => set({
    activeMissions: missions,
  }),
  
  setCompletedMissions: (missions) => set({
    completedMissions: missions,
  }),
  
  setSelectedMission: (mission) => set({
    selectedMission: mission,
  }),
  
  addMission: (mission) => set((state) => ({
    activeMissions: [...state.activeMissions, mission],
  })),
  
  updateMission: (missionId, updates) => set((state) => ({
    activeMissions: state.activeMissions.map((mission) => 
      mission.id === missionId ? { ...mission, ...updates } : mission
    ),
    completedMissions: state.completedMissions.map((mission) => 
      mission.id === missionId ? { ...mission, ...updates } : mission
    ),
  })),
  
  completeMission: (missionId) => set((state) => {
    const mission = state.activeMissions.find((m) => m.id === missionId);
    if (!mission) return state;
    
    const updatedMission = { 
      ...mission, 
      status: 'completed' as const, 
      completedAt: new Date() 
    };
    
    return {
      activeMissions: state.activeMissions.filter((m) => m.id !== missionId),
      completedMissions: [...state.completedMissions, updatedMission],
    };
  }),
  
  setLoading: (loading) => set({
    loading,
  }),
  
  setError: (error) => set({
    error,
  }),
  
  // ミッションデータ取得
  fetchActiveMissions: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      
      // APIからミッション取得
      const missions = await getUserActiveMissions(userId);
      set({ activeMissions: missions });
      
      return missions;
    } catch (error) {
      console.error('Failed to fetch missions:', error);
      set({ 
        error: error instanceof Error ? error.message : '未知のエラーが発生しました' 
      });
      return [];
    } finally {
      set({ loading: false });
    }
  },
}));