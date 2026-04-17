function hasAnyKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function isGreetingIntent(rawMessage: string): boolean {
  return /(^|\s)(hi|hello|hey)([!,.?\s]|$)/i.test(rawMessage.trim());
}

function isProfileIntroIntent(message: string): boolean {
  return (
    message.includes('who is keneth') ||
    message.includes('tell me about keneth') ||
    message.includes('tell me about yourself') ||
    message.includes('who are you')
  );
}

function isAchievementsIntent(message: string): boolean {
  return hasAnyKeyword(message, [
    'achievement',
    'accomplishment',
    'milestone',
    'highlights',
    'standout',
    'impact',
  ]);
}

function isPresetIntent(rawMessage: string): boolean {
  const message = rawMessage.toLowerCase();

  return (
    hasAnyKeyword(message, ['resume', 'cv']) ||
    hasAnyKeyword(message, ['schedule', 'book', 'meeting', 'call', 'hire', 'collaborat']) ||
    hasAnyKeyword(message, ['email', 'contact', 'reach', 'linkedin', 'github', 'social']) ||
    hasAnyKeyword(message, ['skill', 'tech', 'stack', 'language', 'framework']) ||
    hasAnyKeyword(message, ['project', 'portfolio', 'built', 'build']) ||
    hasAnyKeyword(message, ['experience', 'career', 'role', 'company']) ||
    hasAnyKeyword(message, ['certification', 'certificate', 'award', 'hackerrank']) ||
    hasAnyKeyword(message, ['education', 'school', 'university', 'college', 'gpa', 'gwa']) ||
    isAchievementsIntent(message) ||
    isProfileIntroIntent(message) ||
    isGreetingIntent(rawMessage)
  );
}

export {
  hasAnyKeyword,
  isGreetingIntent,
  isProfileIntroIntent,
  isAchievementsIntent,
  isPresetIntent,
};
