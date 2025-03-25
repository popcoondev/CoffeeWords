# Coffee Words

コーヒーの味わいを言葉にするためのパーソナル言語化トレーニングアプリ

## プロジェクト概要

Coffee Wordsは、コーヒー愛好家が自分の味覚を適切な言葉で表現できるようになるためのトレーニングアプリです。
直感的な質問に答えるだけで専門的な表現に変換し、日々の発見を記録することで味覚の成長を可視化します。

## 機能

- 今日のコーヒー記録（基本情報入力、味わい質問への回答）
- AIによる言語化支援
- パーソナル味覚辞典の構築
- 好みプロファイルの分析
- 日々のトレーニング課題

## 技術スタック

- フロントエンド: React Native (Expo)
- 状態管理: Zustand
- UI/UXライブラリ: NativeBase
- バックエンド/インフラ: Firebase (Authentication, Firestore, Storage, Functions)
- API: OpenAI API (ChatGPT)

## セットアップ手順

### 前提条件

- Node.js (v14以上)
- npm または yarn
- Expo CLI
- Firebase プロジェクト
- OpenAI API キー

### インストール

1. リポジトリをクローン

```bash
git clone <repository-url>
cd CoffeeWords
```

2. 依存関係のインストール

```bash
npm install
```

3. 環境変数の設定

`.env.example`ファイルをコピーして`.env`ファイルを作成し、必要な値を設定します：

```bash
cp .env.example .env
```

```
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Firebaseプロジェクトのセットアップ

Firebaseプロジェクトの詳細なセットアップについては、[Firebase Setup Guide](docs/firebase_setup.md)を参照してください。

5. アプリの起動

```bash
npx expo start
```

## テスト

テストを実行するには、まず`.env.test.example`ファイルをコピーして`.env.test`ファイルを作成します：

```bash
cp .env.test.example .env.test
```

次に、各種テストを実行できます：

```bash
# すべてのテストを実行
npm run test

# 変更を監視しながらテストを実行
npm run test:watch

# OpenAI APIテストを実行（実際のAPI呼び出しあり）
npm run test:live

# UIテストを実行
npm run test:ui

# フローテストを実行
npm run test:flows
```

## プロジェクト構造

```
CoffeeWords/
├── src/
│   ├── assets/        # 画像やフォントなどの静的ファイル
│   ├── components/    # 再利用可能なUIコンポーネント
│   ├── constants/     # 定数、テーマ、ルート定義など
│   ├── contexts/      # Reactコンテキスト
│   ├── hooks/         # カスタムフック
│   ├── navigation/    # ナビゲーション設定
│   ├── screens/       # 画面コンポーネント
│   ├── services/      # APIとのインタラクション
│   ├── store/         # Zustandストア
│   ├── types/         # TypeScript型定義
│   └── utils/         # ユーティリティ関数
├── __tests__/         # テストファイル
│   ├── flows/         # フローテスト
│   ├── navigation/    # ナビゲーションテスト
│   ├── screens/       # 画面テスト
│   └── services/      # サービステスト
├── docs/              # ドキュメント
├── App.tsx            # アプリのエントリーポイント
└── package.json       # プロジェクト依存関係
```

## 貢献

プロジェクトへの貢献に興味がある場合は、以下の手順に従ってください：

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

[MIT License](LICENSE)

## 連絡先

プロジェクトオーナー：[あなたの名前](mailto:your.email@example.com)