import { describe, it, expect } from 'vitest';
import {
  hasAnyKeyword,
  isGreetingIntent,
  isProfileIntroIntent,
  isAchievementsIntent,
  isPresetIntent,
} from '@/app/api/chat/lib/intentClassifier';

describe('intentClassifier', () => {
  describe('hasAnyKeyword', () => {
    it('returns true when text contains keyword', () => {
      expect(hasAnyKeyword('I need a resume', ['resume', 'cv'])).toBe(true);
    });

    it('returns false when no keywords match', () => {
      expect(hasAnyKeyword('hello world', ['resume', 'cv'])).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(hasAnyKeyword('RESUME', ['resume'])).toBe(false);
    });
  });

  describe('isGreetingIntent', () => {
    it('detects hi', () => {
      expect(isGreetingIntent('hi')).toBe(true);
      expect(isGreetingIntent('Hi there')).toBe(true);
    });

    it('detects hello', () => {
      expect(isGreetingIntent('hello!')).toBe(true);
      expect(isGreetingIntent('Hello world')).toBe(true);
    });

    it('detects hey', () => {
      expect(isGreetingIntent('hey')).toBe(true);
      expect(isGreetingIntent('Hey!')).toBe(true);
    });

    it('rejects non-greetings', () => {
      expect(isGreetingIntent('hide something')).toBe(false);
      expect(isGreetingIntent('help me')).toBe(false);
      expect(isGreetingIntent('this is a hello-world test')).toBe(false);
    });
  });

  describe('isProfileIntroIntent', () => {
    it('detects who is keneth', () => {
      expect(isProfileIntroIntent('who is keneth')).toBe(true);
    });

    it('detects tell me about keneth', () => {
      expect(isProfileIntroIntent('tell me about keneth')).toBe(true);
    });

    it('detects tell me about yourself', () => {
      expect(isProfileIntroIntent('tell me about yourself')).toBe(true);
    });

    it('detects who are you', () => {
      expect(isProfileIntroIntent('who are you')).toBe(true);
    });

    it('rejects unrelated messages', () => {
      expect(isProfileIntroIntent('what is react')).toBe(false);
    });
  });

  describe('isAchievementsIntent', () => {
    it('detects achievement keywords', () => {
      expect(isAchievementsIntent('what are your achievements')).toBe(true);
      expect(isAchievementsIntent('show me your milestones')).toBe(true);
      expect(isAchievementsIntent('tell me about your impact')).toBe(true);
    });

    it('rejects unrelated messages', () => {
      expect(isAchievementsIntent('what time is it')).toBe(false);
    });
  });

  describe('isPresetIntent', () => {
    it('detects resume intent', () => {
      expect(isPresetIntent('show me your resume')).toBe(true);
      expect(isPresetIntent('can I see your cv')).toBe(true);
    });

    it('detects schedule intent', () => {
      expect(isPresetIntent('book a meeting')).toBe(true);
      expect(isPresetIntent('schedule a call')).toBe(true);
      expect(isPresetIntent('hire you')).toBe(true);
    });

    it('detects contact intent', () => {
      expect(isPresetIntent('what is your email')).toBe(true);
      expect(isPresetIntent('how to reach you')).toBe(true);
      expect(isPresetIntent('linkedin profile')).toBe(true);
    });

    it('detects skills intent', () => {
      expect(isPresetIntent('what are your skills')).toBe(true);
      expect(isPresetIntent('tech stack')).toBe(true);
    });

    it('detects project intent', () => {
      expect(isPresetIntent('show me your projects')).toBe(true);
      expect(isPresetIntent('what have you built')).toBe(true);
    });

    it('detects experience intent', () => {
      expect(isPresetIntent('work experience')).toBe(true);
      expect(isPresetIntent('career history')).toBe(true);
    });

    it('detects certification intent', () => {
      expect(isPresetIntent('certifications')).toBe(true);
      expect(isPresetIntent('any awards')).toBe(true);
    });

    it('detects education intent', () => {
      expect(isPresetIntent('education background')).toBe(true);
      expect(isPresetIntent('university')).toBe(true);
      expect(isPresetIntent('what is your gwa')).toBe(true);
    });

    it('detects greeting as preset', () => {
      expect(isPresetIntent('hello')).toBe(true);
    });

    it('rejects unrelated messages', () => {
      expect(isPresetIntent('what is the weather')).toBe(false);
    });
  });
});
