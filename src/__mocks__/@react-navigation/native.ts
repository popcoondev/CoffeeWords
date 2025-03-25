// React Navigationのモック
import { jest } from '@jest/globals';

const actualNav = jest.requireActual('@react-navigation/native');

export const useNavigation = jest.fn().mockReturnValue({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(true),
});

export const useRoute = jest.fn().mockReturnValue({
  params: {},
});

export const useIsFocused = jest.fn().mockReturnValue(true);

export const NavigationContainer = ({ children }: { children: React.ReactNode }) => children;

// 実際のフックのエクスポート
export const {
  useFocusEffect,
  useScrollToTop,
  useNavigationState,
  CommonActions,
  StackActions,
  TabActions,
} = actualNav;