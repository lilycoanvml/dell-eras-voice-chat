/**
 * Era Classifier Unit Tests
 */

import { EraClassifier } from '@/app/backend/services/era-classifier';

describe('EraClassifier', () => {
  const classifier = new EraClassifier();

  test('classifies creator transcript correctly', () => {
    const transcript = 'I want to design and create visual content. My aesthetic is everything. I love art and photography.';
    const result = classifier.classify(transcript);
    expect(result.era.id).toBe('creator');
    expect(result.confidence).toBeDefined();
  });

  test('classifies innovator transcript correctly', () => {
    const transcript = 'I want to code and build software products. I engineer systems and deploy APIs.';
    const result = classifier.classify(transcript);
    expect(result.era.id).toBe('innovator');
  });

  test('classifies explorer transcript correctly', () => {
    const transcript = 'I want to travel and work remote from anywhere. I need location freedom and flexibility.';
    const result = classifier.classify(transcript);
    expect(result.era.id).toBe('explorer');
  });

  test('returns high confidence for strong signal', () => {
    const transcript = 'game stream compete gaming audience twitch fps rank esport broadcast perform';
    const result = classifier.classify(transcript);
    expect(result.era.id).toBe('performer');
    expect(result.confidence).toBe('high');
  });
});
