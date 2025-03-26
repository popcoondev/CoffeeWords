import { create } from 'zustand';
import { Mission } from '../types';

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
  
  // アクション
  setActiveMissions: (missions: Mission[]) => void;
  setCompletedMissions: (missions: Mission[]) => void;
  setSelectedMission: (mission: Mission | null) => void;
  addMission: (mission: Mission) => void;
  updateMission: (missionId: string, updates: Partial<Mission>) => void;
  completeMission: (missionId: string) => void;
  setLoading: (loading: boolean) => void;
}

// Storeの作成
export const useMissionStore = create<MissionState>((set) => ({
  // 初期状態
  activeMissions: [],
  completedMissions: [],
  selectedMission: null,
  loading: false,
  
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
}));