// React Navigation Native Stackのモック
import React from 'react';

export const createNativeStackNavigator = jest.fn(() => ({
  Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Screen: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));