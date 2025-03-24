Coffee Words - 軽量化技術要件定義書
方針: フルマネージド & コスト効率的アプローチ
限られたリソース（開発者1名+AI補助）で持続可能なサービス構築のため、以下の中核原則を採用します:

極力フルマネージドサービスの活用
サーバーレスアーキテクチャの優先採用
運用負荷の最小化
コスト効率の最大化
拡張性を犠牲にせずシンプルさを維持

軽量化システムアーキテクチャ
従来の複雑なマイクロサービスからサーバーレス主体のモノリシックアーキテクチャへ再構成します。
コピー[モバイルアプリ] ⟷ [Firebase/Supabase] ⟷ [サーバーレス関数] ⟷ [マネージドAIサービス]
改訂フロントエンド技術スタック
モバイルアプリ

フレームワーク: React Native Expo（開発・配信の簡素化）
状態管理: Zustand（Reduxより軽量）
UI/UXライブラリ:

NativeBase（軽量コンポーネントセット）
React Navigation


データ取得: SWR（React Queryより軽量）
テスト: Jest + React Native Testing Library（必須部分のみ）

効率化ポイント

Expoワークフロー: Over-the-Air更新対応で審査待ち時間削減
マネージドCI/CD: Expo EASサービスでビルド・配信自動化
カスタムコンポーネント最小化: 既存ライブラリ最大活用

改訂バックエンド技術スタック
統合プラットフォーム（主軸技術）

Firebase または Supabase

認証
データベース
ストレージ
サーバーレス関数
ホスティング
分析



サーバーレス機能

クラウド関数: Firebase Functions または Supabase Edge Functions
言語: TypeScript
ドメイン単位の分割: モノリシックだが機能分離されたアーキテクチャ

AI/ML関連

OpenAI API: 直接連携（自前モデル不使用）
エッジでのAI計算回避: すべてクラウドサービスに委譲

データ層

主データベース: Firebase Firestore または Supabase PostgreSQL
キャッシュ: クライアントサイドのみ（サーバーキャッシュなし）
検索: Algolia（必要な場合のみ）

簡素化インフラストラクチャ
クラウド環境

Firebase/Supabaseワンストップ採用: 複数プロバイダー管理の回避
サーバー管理ゼロ: 完全サーバーレスアーキテクチャ

デプロイメント

CI/CD: GitHub Actions + Firebase/Supabase CLI
環境:

開発環境
本番環境（テスト/ステージング省略）



セキュリティ

プラットフォーム提供のセキュリティ: Firebase/Supabase標準保護機能
認証: プラットフォーム標準認証

モニタリング

基本ロギング: Firebase/Supabase提供機能
エラー追跡: Sentry（無料枠内）
アラート: メールまたはDiscord連携（無料）

簡素化テスト戦略
テスト階層見直し

重点ユニットテスト: コア機能のみ（カバレッジ目標引き下げ60%）
手動テスト強化: 自動E2Eテストより開発者テスト重視
段階的テスト拡充: まず基盤を築き、後に拡張

継続的インテグレーション

プル要求ごとの最小限テスト:

重要箇所のユニットテスト
Lint（コード品質保証）



テスト環境

実環境に近い開発DB: 本番と分離されたFirebase/Supabase開発インスタンス

開発プロセス簡素化
開発フロー

シンプルなブランチ戦略:

main: 本番用
dev: 開発用
トピックブランチ: 機能/修正用


AI活用コードレビュー:

GitHub Copilotによる支援
OpenAI Code Interpreter利用のバッチ検証



効率化ドキュメンテーション

目的主導: 必要なものだけ作成、過剰な文書化回避
自己文書化コード: 明確な命名規則とコメント重視
README駆動開発: 各コンポーネントの最小ドキュメントとしてREADME活用

コスト最適化コンポーネント
言語化エンジン（コスト最適化版）
最適化戦略:

キャッシュ層導入: 類似回答の再利用でAPI呼び出し削減
バッチ処理: 可能な場合はリクエストをバッチ化
プロンプト最適化: トークン数削減のための精密プロンプト設計

javascriptコピー// コスト効率的な言語化関数例
async function generateCoffeeLanguage(userResponses) {
  // キャッシュチェック
  const cacheKey = generateCacheKey(userResponses);
  const cachedResult = await checkCache(cacheKey);
  if (cachedResult) return cachedResult;
  
  // 最適化されたプロンプト（トークン数節約）
  const prompt = generateOptimizedPrompt(userResponses);
  
  // API呼び出し（低コストモデル選択）
  const result = await openai.createCompletion({
    model: "gpt-3.5-turbo", // 高価なGPT-4ではなく
    prompt,
    max_tokens: 200, // 必要最小限に制限
    temperature: 0.7
  });
  
  // キャッシュ保存
  await saveToCache(cacheKey, result, 24 * 60 * 60); // 24時間有効
  
  return result;
}
データモデル最適化
Firebase/Supabase最適化データモデル:

読み取りパターンに合わせた非正規化
課金に影響するクエリ回数削減
データ階層の浅さ維持（Firestoreの場合）

typescriptコピー// 最適化ユーザーテイスティングモデル
interface OptimizedTasting {
  id: string;
  userId: string;
  createdAt: timestamp;
  // 頻繁に一緒に取得されるデータをネスト
  coffeeInfo: {
    name: string;
    roaster?: string;
  };
  // 別のコレクション/テーブルに分離せず一体化
  responses: {
    body: string;
    flavors: string[];
    aftertaste: string;
  };
  languageResult: string;
  tags: string[]; // 配列による簡素化
}
MVP段階のインフラ詳細コスト試算
Firebase無料枠活用プラン

Firestore: 1GB保存 + 50K/日の読み取り + 20K/日の書き込み
Authentication: 無料枠(10K/月)
Functions: 125K/月の呼び出し
Hosting: 10GB/月の転送
Storage: 5GB保存 + 1GB/日のダウンロード

OpenAI API効率化

目標: ユーザー1人あたり月間コスト $0.10以下
戦略: GPT-3.5-turboモデル使用、キャッシュ層の実装
ボリューム: ユーザー1人あたり月20回の言語化処理
コスト: 約$0.002/リクエスト × 20 = $0.04/月/ユーザー

サードパーティ統合無料枠

Sentry: 5K エラーイベント/月
GitHub: 無料プラン（プライベートリポジトリ）
Expo: 無料プラン（OTAアップデート制限あり）

初期フェーズ月間運用コスト見積り（1,000ユーザー想定）

Firebase/Supabase: $0（無料枠内）〜 $25
OpenAI API: 約$40/月
その他サービス: $0（無料枠内）
合計: 約$40〜65/月

長期的な費用対効果戦略

段階的スケーリング: ユーザー数に応じた段階的インフラ拡張
収益連動コスト: 有料ユーザー獲得に応じたサービス拡張
AIコスト管理: キャッシュ戦略の継続的最適化
マネタイズ閾値: 月間運用コスト$500到達時には収益$1,500達成を目標

技術負債管理計画
大規模リファクタリングの必要性を回避するため、初期段階から以下の原則を適用:

モジュール境界の明確化: 将来的分離を容易にする設計
拡張ポイントの事前識別: 成長に伴う変更箇所を特定
段階的進化: MVPからの拡張パスを明確に設計

実装優先順位の再調整
フェーズ1 (1-4週)

認証・基本データフロー: Firebase/Supabase設定
基本UI/UX: Expo + NativeBaseによる迅速な構築
最小言語化機能: OpenAI APIとの基本連携

フェーズ2 (5-8週)

オフラインサポート: ローカルストレージ活用
基本的なプロファイル機能: 好み分析の最小実装
最適化されたデータモデル: 読み取りパターンに合わせた設計

フェーズ3 (9-10週)

単一開発者向けCI/CD: 自動化デプロイ
基本的なモニタリング: エラー捕捉
マネタイズ準備: 課金壁の実装（必要に応じて）


結論: 持続可能な一人開発モデル
この軽量化された技術要件は、一人の開発者とAIのサポートで持続可能なサービス運営を可能にします。フルマネージドサービスの活用とサーバーレスアーキテクチャにより、運用負荷とコストを最小限に抑えながら、アプリの核となる価値提案を実現します。
特に重要な点は:

開発速度: Expo + Firebase/Supabaseによる迅速な開発
低運用負荷: インフラ管理不要のフルマネージド環境
低コスト: 無料枠最大活用とリソース効率的使用
段階的拡張: ユーザー数と収益に応じた段階的な機能・インフラ拡張

この定義は一人開発者の現実に即しながら、品質とユーザー体験を犠牲にせず、持続可能なビジネスモデルを実現するためのバランスを取っています。