module.exports = function(api) {
  // testでアクセスするため、これをプロセス環境に応じて設定
  const isTest = process.env.NODE_ENV === 'test';
  api.cache(true);
  
  return {
    presets: [
      'babel-preset-expo',
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript',
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: [
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env",
        "blocklist": null,
        "allowlist": null,
        "safe": false,
        "allowUndefined": true,
        "verbose": true
      }],
      // テスト用の変換を追加
      isTest && '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-transform-runtime',
    ].filter(Boolean)
  };
};