import { extendTheme } from 'native-base';

// UI設計書に基づくテーマ
export const COLORS = {
  primary: {
    500: '#8B5A2B', // コーヒーブラウン
    600: '#7A4E25', // ダークコーヒーブラウン（プライマリーの暗め）
    400: '#9C6A3B', // ライトコーヒーブラウン（プライマリーの明るめ）
  },
  secondary: {
    500: '#F5DEB3', // ベージュ/クリーム
  },
  accent: {
    500: '#D4A76A', // キャラメル
  },
  background: {
    primary: '#FFFAF0', // フローラルホワイト
    secondary: '#FFF8E1', // 薄いベージュ
  },
  text: {
    primary: '#1E1E1E', // ほぼブラック
    secondary: '#555555', // ダークグレー
    light: '#999999', // ライトグレー
  },
  semantic: {
    success: '#4CAF50', // 緑
    warning: '#FF9800', // オレンジ
    error: '#F44336', // 赤
    info: '#2196F3', // 青
  }
};

// スペーシング
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// フォントサイズ
export const FONT_SIZE = {
  h1: 24,
  h2: 20,
  h3: 18,
  h4: 16,
  body1: 16,
  body2: 14,
  caption: 12,
  button: 16,
};

// Native Base テーマの拡張
export const theme = extendTheme({
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
  },
  fontConfig: {
    Poppins: {
      400: {
        normal: 'Poppins-Regular',
      },
      500: {
        normal: 'Poppins-Medium',
      },
      600: {
        normal: 'Poppins-SemiBold',
      },
      700: {
        normal: 'Poppins-Bold',
      },
    },
  },
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
    mono: 'Poppins',
  },
  components: {
    Button: {
      baseStyle: {
        rounded: 'md',
      },
      defaultProps: {
        colorScheme: 'primary',
      },
    },
    Text: {
      baseStyle: {
        color: COLORS.text.primary,
      },
      variants: {
        secondary: {
          color: COLORS.text.secondary,
        },
        light: {
          color: COLORS.text.light,
        },
      },
    },
    Heading: {
      baseStyle: {
        color: COLORS.text.primary,
      },
    },
  },
});