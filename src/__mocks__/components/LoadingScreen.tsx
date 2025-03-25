import React from 'react';

const LoadingScreen = ({ message = 'アプリを準備しています...' }) => {
  return (
    <div data-testid="LoadingScreen">
      <div data-testid="Spinner"></div>
      <div data-testid="Message">{message}</div>
    </div>
  );
};

export default LoadingScreen;