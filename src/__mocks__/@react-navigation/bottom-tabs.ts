// React Navigation Bottom Tabsのモック
import React from 'react';

export const createBottomTabNavigator = jest.fn(() => ({
  Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Screen: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));