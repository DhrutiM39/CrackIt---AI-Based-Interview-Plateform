const defaultWeights = {
  headline: 18,
  summary: 18,
  experience: 25,
  skills: 20,
  education: 10,
  projects: 9,
  completeness: 10,
};

const defaultConfig = {
  useBenchmark: false,
  weights: { ...defaultWeights },
};

let appConfig = { ...defaultConfig };
const scoreHistory = new Map();

function setAppConfig(nextConfig = {}) {
  appConfig = {
    ...appConfig,
    ...nextConfig,
    weights: {
      ...appConfig.weights,
      ...(nextConfig.weights || {}),
    },
  };

  Object.assign(defaultConfig, appConfig);
  return appConfig;
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(/[;,\n]/).map(item => item.trim()).filter(Boolean);
  return [];
}

function toText(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  if (value && typeof value === 'object') return Object.values(value).join(' ');
  return '';
}

function sanitizeKeyword(keyword) {
  return String(keyword || '')
    .replace(/[\[\](){}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractKeywords(text = '') {
  const matches = text.match(/\b[A-Z][A-Za-z0-9+.#/:-]*\b|\b[A-Z]{2,}\b|\b[a-z]+(?:[A-Z][A-Za-z0-9+.#/:-]*)\b/g) || [];
  const stopWords = new Set([
    'The', 'And', 'With', 'That', 'This', 'Use', 'Using', 'For', 'From', 'Add', 'Improve', 'Built', 'Developed',
    'Based', 'Using', 'Skills', 'Role', 'Profile', 'Summary', 'Experience', 'Education', 'Projects', 'Cloud', 'Team',
    'Job', 'Description', 'Resume', 'Bullet', 'Metric', 'Data', 'Item', 'Target', 'Work'
  ]);

  return [...new Set(matches
    .map(item => sanitizeKeyword(item))
    .filter(Boolean)
    .filter(item => !stopWords.has(item) && item.length > 1))];
}

function toDisplayEvidence(items) {
  return items.filter(Boolean).slice(0, 5);
}

function createBreakdownEntry(score, evidence, refs = []) {
  return {
    score,
    evidence: toDisplayEvidence(evidence),
    evidenceRefs: refs.length ? refs : toDisplayEvidence(evidence),
  };
}

function getTextFromResume(resume = {}) {
  return [
    resume.headline,
    resume.summary,
    resume.about,
    resume.objective,
    ...(Array.isArray(resume.experience) ? resume.experience : [resume.experience]),
    ...(Array.isArray(resume.skills) ? resume.skills : [resume.skills]),
    resume.education,
    ...(Array.isArray(resume.projects) ? resume.projects : [resume.projects]),
    resume.text,
  ].filter(Boolean).join(' ');
}

function computeKeywordCoverage(resumeText = '', keywords = []) {
  const lowerText = String(resumeText || '').toLowerCase();
  return keywords.filter(keyword => {
    const k = String(keyword || '').toLowerCase();
    return !k || lowerText.includes(k);
  });
}

function buildGeneralBreakdown(resume = {}) {
  const text = getTextFromResume(resume);
  const headline = resume.headline || 'Profile';
  const summaryText = resume.summary || resume.about || '';
  const experienceItems = normalizeList(resume.experience);
  const skillItems = normalizeList(resume.skills);
  const education = resume.education || '';
  const projects = normalizeList(resume.projects);

  const breakdown = {
    headline: createBreakdownEntry(
      headline ? 18 : 0,
      ['General profile completeness check'],
      ['headline']
    ),
    summary: createBreakdownEntry(
      summaryText ? 16 : 0,
      summaryText ? [summaryText] : ['Add a concise About or Summary section'],
      summaryText ? ['summary'] : ['summary']
    ),
    experience: createBreakdownEntry(
      experienceItems.length ? 20 : 0,
      experienceItems.length ? experienceItems.slice(0, 2) : ['No experience bullets found'],
      experienceItems.length ? ['experience'] : ['experience']
    ),
    skills: createBreakdownEntry(
      skillItems.length ? Math.min(18, 8 + skillItems.length * 2) : 5,
      skillItems.length ? skillItems.slice(0, 3) : ['Add a skills section to improve ATS coverage'],
      skillItems.length ? ['skills'] : ['skills']
    ),
    education: createBreakdownEntry(
      education ? 12 : 0,
      education ? [education] : ['Add education details'],
      education ? ['education'] : ['education']
    ),
    projects: createBreakdownEntry(
      projects.length ? 14 : 0,
      projects.length ? projects.slice(0, 2) : ['No project section found'],
      projects.length ? ['projects'] : ['projects']
    ),
    completeness: createBreakdownEntry(
      text ? 12 : 0,
      text ? ['Profile has enough text to assess completeness'] : ['Resume text is empty'],
      text ? ['profile'] : ['profile']
    ),
  };

  const totalScore = Object.values(breakdown).reduce((sum, entry) => sum + Number(entry.score || 0), 0);
  const recommendations = [
    {
      type: 'warning',
      message: 'Add a job description or target role to unlock role-specific ATS scoring and keyword matching.',
    },
  ];

  if (!summaryText) {
    recommendations.push({
      type: 'warning',
      message: 'Add an About or Summary section to explain the candidate profile and improve resume completeness.',
    });
  }

  return {
    totalScore,
    breakdown,
    recommendations,
    useBenchmark: appConfig.useBenchmark,
    note: appConfig.useBenchmark ? 'Benchmark flag enabled for this analysis.' : '[Benchmark disabled]',
  };
}

function computeScoreBreakdown(resume = {}, jobDesc = {}, config = appConfig) {
  const resumeText = getTextFromResume(resume);
  const targetTitle = (jobDesc && (jobDesc.title || jobDesc.jobTitle || jobDesc.role)) || '';
  const jobText = (jobDesc && (jobDesc.text || jobDesc.jobDescription || jobDesc.description)) || '';
  const keywords = extractKeywords(jobText || targetTitle || '');
  const resumeSkills = normalizeList(resume.skills);
  const matchingSkills = keywords.filter(keyword => {
    const normalized = keyword.toLowerCase();
    return resumeSkills.some(skill => String(skill).toLowerCase().includes(normalized)) || resumeText.toLowerCase().includes(normalized);
  });

  const headlineValue = resume.headline || resume.title || '';
  const summaryValue = resume.summary || resume.about || '';
  const aboutValue = resume.about || '';
  const experienceItems = normalizeList(resume.experience);
  const educationValue = resume.education || '';
  const projectItems = normalizeList(resume.projects);

  const headlineScore = headlineValue && targetTitle && headlineValue.toLowerCase().includes(targetTitle.toLowerCase()) ? 18
    : headlineValue ? 12 : 0;

  const summaryScore = aboutValue ? Math.min(18, 8 + Math.max(0, matchingSkills.length) * 2) : (summaryValue ? 10 : 4);
  const experienceScore = experienceItems.length ? Math.min(25, 12 + experienceItems.length * 4 + matchingSkills.length) : 5;
  const skillsScore = resumeSkills.length ? Math.min(20, 8 + Math.min(10, matchingSkills.length * 3) + Math.min(6, resumeSkills.length)) : 4;
  const educationScore = educationValue ? 10 : 4;
  const projectsScore = projectItems.length ? Math.min(9, 4 + projectItems.length * 2) : 3;

  const breakdown = {
    headline: createBreakdownEntry(
      headlineScore,
      headlineValue
        ? [headlineValue]
        : ['No headline available; add a clear title or role label.'],
      headlineValue ? ['headline'] : ['headline']
    ),
    summary: createBreakdownEntry(
      summaryScore,
      summaryValue
        ? [summaryValue]
        : ['Missing summary section; add a concise About statement.'],
      summaryValue ? ['summary'] : ['summary']
    ),
    experience: createBreakdownEntry(
      experienceScore,
      experienceItems.length ? experienceItems.slice(0, 2) : ['No experience evidence found.'],
      experienceItems.length ? ['experience'] : ['experience']
    ),
    skills: createBreakdownEntry(
      skillsScore,
      resumeSkills.length
        ? resumeSkills.slice(0, 3)
        : ['Skills section is empty or missing.'],
      resumeSkills.length ? ['skills'] : ['skills']
    ),
    education: createBreakdownEntry(
      educationScore,
      educationValue ? [educationValue] : ['Education details are missing.'],
      educationValue ? ['education'] : ['education']
    ),
    projects: createBreakdownEntry(
      projectsScore,
      projectItems.length ? projectItems.slice(0, 2) : ['Project evidence is missing.'],
      projectItems.length ? ['projects'] : ['projects']
    ),
    completeness: createBreakdownEntry(
      headlineValue || summaryValue || resumeSkills.length || educationValue ? 10 : 0,
      headlineValue || summaryValue || resumeSkills.length || educationValue
        ? ['Essential resume sections are present.']
        : ['Missing core profile details.'],
      ['profile']
    ),
  };

  const totalScore = Object.values(breakdown).reduce((sum, entry) => sum + Number(entry.score || 0), 0);

  const result = {
    totalScore,
    breakdown,
    useBenchmark: !!(config && config.useBenchmark),
    recommendations: [
      { type: 'info', message: 'Targeted ATS evaluation based on the provided job title and description.' },
    ],
    note: config && config.useBenchmark ? 'Benchmark estimates are enabled for this analysis.' : '[Benchmark disabled]',
  };

  if (!aboutValue) {
    result.recommendations.push({
      type: 'warning',
      message: 'Add an About section to strengthen the summary and improve ATS completeness scoring.',
    });
  }

  if (config && config.useBenchmark) {
    result.estimatedPercentile = Math.min(99, 50 + Math.round(totalScore * 0.5));
    result.benchmarkMessage = 'Estimated percentile is directional and based on an internal, non-standardized benchmark model.';
  }

  return result;
}

function analyzeResume(resume = {}, jobDesc = {}, options = {}) {
  const config = { ...appConfig, ...options };
  const merged = { ...appConfig, ...config };

  if (!jobDesc || (!jobDesc.title && !jobDesc.jobTitle && !jobDesc.role && !jobDesc.text && !jobDesc.jobDescription && !jobDesc.description)) {
    const result = buildGeneralBreakdown(resume);
    return {
      ...result,
      totalScore: result.totalScore,
      ats_score: result.totalScore,
      overall_score: result.totalScore,
      breakdown: result.breakdown,
      useBenchmark: !!merged.useBenchmark,
      note: result.note,
      ...(merged.useBenchmark ? {
        estimatedPercentile: Math.min(99, 55 + Math.round(result.totalScore * 0.4)),
        benchmarkMessage: 'Estimated percentile is directional and not a standardized ATS ranking.',
      } : {}),
    };
  }

  const result = computeScoreBreakdown(resume, jobDesc, merged);
  return {
    ...result,
    ats_score: result.totalScore,
    overall_score: result.totalScore,
    totalScore: result.totalScore,
  };
}

function getRecommendationPlaceholderMessage() {
  return 'Add a measurable impact metric like [ADD METRIC] to document the improvement clearly.';
}

function validateSuggestion(suggestion = {}, resume = {}) {
  const suggestionText = typeof suggestion === 'string' ? suggestion : (suggestion.text || suggestion.newText || suggestion.content || '');
  const sourceText = getTextFromResume(resume).toLowerCase();
  const skillText = normalizeList(resume.skills).join(' ').toLowerCase();
  const extractedKeywords = extractKeywords(suggestionText);

  const missingFacts = extractedKeywords.filter(keyword => {
    const normalizedKeyword = String(keyword).toLowerCase();
    if (!normalizedKeyword) return false;
    if (sourceText.includes(normalizedKeyword) || skillText.includes(normalizedKeyword)) {
      return false;
    }
    return true;
  });

  const recommendations = [];
  if (missingFacts.length > 0) {
    recommendations.push({
      type: 'error',
      message: `Suggestion includes facts not found in the source resume: ${missingFacts.join(', ')}.`,
      recommendationSource: 'resume validation',
    });
  } else {
    recommendations.push({
      type: 'rewrite',
      message: getRecommendationPlaceholderMessage(),
      recommendationSource: 'resume content audit',
    });
  }

  return {
    isValid: missingFacts.length === 0,
    missingFacts,
    recommendationSource: 'resume validation',
    recommendations,
  };
}

function recordScoreHistory(resumeId, result) {
  const history = scoreHistory.get(resumeId) || [];
  history.push({
    date: new Date().toISOString(),
    totalScore: result.totalScore,
    breakdown: result.breakdown,
  });
  scoreHistory.set(resumeId, history);
  return history;
}

function getScoreHistory(resumeId) {
  return { scores: scoreHistory.get(resumeId) || [] };
}

module.exports = {
  defaultConfig,
  appConfig,
  setAppConfig,
  analyzeResume,
  buildGeneralBreakdown,
  computeScoreBreakdown,
  validateSuggestion,
  recordScoreHistory,
  getScoreHistory,
  extractKeywords,
};
