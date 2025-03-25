import { CoffeeResponse, buildCoffeePrompt } from '../../src/services/openai';

describe('buildCoffeePrompt', () => {
  it('完全なレスポンスデータからプロンプトを正しく構築する', () => {
    const responses: CoffeeResponse = {
      body: 'medium',
      flavor: ['fruity', 'chocolate'],
      aftertaste: 'long'
    };

    const prompt = buildCoffeePrompt(responses);

    // プロンプトに必要な要素が含まれているか検証
    expect(prompt).toContain('あなたはコーヒーの味覚を専門用語で表現するエキスパートです');
    expect(prompt).toContain('バランスの取れた、ミディアムな口当たり');
    expect(prompt).toContain('果実系（ベリー、柑橘類など）、チョコレート系（カカオ、ダークチョコなど）');
    expect(prompt).toContain('長く続く余韻');
    expect(prompt).toContain('出力形式（JSON）');
    expect(prompt).toContain('"shortDescription"');
    expect(prompt).toContain('"detailedDescription"');
    expect(prompt).toContain('"tags"');
    expect(prompt).toContain('"recommendations"');
  });

  it('不完全なレスポンスデータからプロンプトを適切に構築する', () => {
    const responses: CoffeeResponse = {
      body: 'light',
      // flavorとaftertasteは意図的に省略
    };

    const prompt = buildCoffeePrompt(responses);

    expect(prompt).toContain('軽い、繊細な口当たり');
    expect(prompt).toContain('風味: 不明');
    expect(prompt).toContain('余韻: 不明');
  });

  it('空のレスポンスデータからプロンプトを構築できる', () => {
    const responses: CoffeeResponse = {};

    const prompt = buildCoffeePrompt(responses);

    expect(prompt).toContain('ボディ感: 不明');
    expect(prompt).toContain('風味: 不明');
    expect(prompt).toContain('余韻: 不明');
  });

  it('未知のフレーバーが存在する場合でも適切に処理する', () => {
    const responses: CoffeeResponse = {
      body: 'medium',
      flavor: ['fruity', 'unknown_flavor' as any, 'chocolate'],
      aftertaste: 'short'
    };

    const prompt = buildCoffeePrompt(responses);

    expect(prompt).toContain('果実系（ベリー、柑橘類など）、unknown_flavor、チョコレート系（カカオ、ダークチョコなど）');
  });

  it('文字列として出力形式を指定している', () => {
    const responses: CoffeeResponse = {
      body: 'medium'
    };

    const prompt = buildCoffeePrompt(responses);

    // JSON形式の出力指定があるか
    expect(prompt).toContain('出力は必ず上記のJSON形式で');
    expect(prompt).toContain('日本語で返してください');
  });
});