const {
  analyzeResume,
  validateSuggestion,
  buildGeneralBreakdown,
  setAppConfig,
  defaultConfig,
} = require('../atsService');

describe('ATS resume analysis service', () => {
  const sampleResume = {
    headline: 'Frontend Developer',
    summary: 'Frontend Developer with 3 years building user-facing web apps using React and TypeScript.',
    about: 'I build accessible interfaces and optimize product performance.',
    experience: [
      'Built a React dashboard that improved conversion by 18%.',
      'Developed TypeScript components for internal tools.'
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'REST APIs'],
    education: 'B.Tech in Computer Science',
    projects: ['Built a dashboard using React and TypeScript.'],
    text: 'Frontend Developer with 3 years building user-facing web apps using React and TypeScript. Built a React dashboard that improved conversion by 18%. Developed TypeScript components for internal tools. Skills: React, TypeScript, JavaScript, CSS, REST APIs. Education: B.Tech in Computer Science.'
  };

  const sampleJob = {
    title: 'Frontend Developer',
    text: 'We are hiring a Frontend Developer with React, TypeScript, JavaScript, CSS, and REST APIs experience.'
  };

  test('computes weighted breakdown with evidence for matching categories', () => {
    const result = analyzeResume(sampleResume, sampleJob, { useBenchmark: false });

    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.breakdown.headline.score).toBeGreaterThan(0);
    expect(result.breakdown.skills.score).toBeGreaterThan(0);
    expect(result.breakdown.experience.evidence.length).toBeGreaterThan(0);
    expect(result.breakdown.experience.evidence.some(item => item.includes('React'))).toBe(true);
    expect(result.estimatedPercentile).toBeUndefined();
    expect(result.benchmarkMessage).toBeUndefined();
  });

  test('drops benchmark values when toggle is false', () => {
    const result = analyzeResume(sampleResume, sampleJob, { useBenchmark: false });
    expect(result).not.toHaveProperty('estimatedPercentile');
    expect(result).not.toHaveProperty('benchmarkMessage');
  });

  test('flags fabricated skills in recommendation validation', () => {
    const validation = validateSuggestion({ text: 'Add Golang expertise and AWS architecture for scaling.' }, sampleResume);

    expect(validation.isValid).toBe(false);
    expect(validation.missingFacts).toContain('Golang');
    expect(validation.missingFacts).toContain('AWS');
  });

  test('returns general completeness scoring when no target role is supplied', () => {
    const result = analyzeResume(sampleResume, null, { useBenchmark: false });

    expect(result.breakdown.headline.score).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.headline.evidence).toEqual(expect.arrayContaining(['General profile completeness check']));
    expect(result.recommendations.some(item => item.message.includes('job description'))).toBe(true);
  });

  test('recommends adding missing About section and penalizes it', () => {
    const resumeWithoutAbout = {
      ...sampleResume,
      about: '',
      text: 'Frontend Developer with React and TypeScript. Built dashboards and internal tools using JavaScript.'
    };

    const result = analyzeResume(resumeWithoutAbout, sampleJob, { useBenchmark: false });
    const summaryItem = result.breakdown.summary;

    expect(summaryItem.score).toBeLessThan(result.breakdown.skills.score);
    expect(result.recommendations.some(item => /About|summary/i.test(item.message))).toBe(true);
  });

  test('recommends a placeholder metric for weak bullets', () => {
    const recommendation = validateSuggestion({ text: 'Improved application performance with React optimization.' }, sampleResume);
    expect(recommendation.isValid).toBe(true);
    expect(recommendation.missingFacts).toEqual([]);
    expect(recommendation.recommendations[0].message).toMatch(/\[ADD METRIC\]|metric/i);
  });

  test('setAppConfig toggles benchmark flag globally', () => {
    setAppConfig({ useBenchmark: true });
    expect(defaultConfig.useBenchmark).toBe(true);
    setAppConfig({ useBenchmark: false });
    expect(defaultConfig.useBenchmark).toBe(false);
  });
});
