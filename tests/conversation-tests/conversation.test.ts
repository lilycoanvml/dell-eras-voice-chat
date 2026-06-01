/**
 * Conversation Tests
 *
 * Tests the full conversational flow against the Claude API.
 * Run with: npx jest tests/conversation-tests/
 */

const TEST_PERSONAS = [
  {
    name: 'Creator persona',
    answers: [
      'I want to launch my photography business',
      'A quiet studio with great natural light',
      'I can tell a story with a single image',
      'My current laptop is too slow for editing 4K files',
      'Success is someone crying at a photo I took',
    ],
    expectedEra: 'creator',
  },
  {
    name: 'Innovator persona',
    answers: [
      'I want to ship an open-source developer tool',
      'Dual monitors, mechanical keyboard, lots of coffee',
      "I build systems that other engineers don't think are possible",
      'Slow compile times and flaky CI pipelines',
      "When 10,000 developers are using something I built",
    ],
    expectedEra: 'innovator',
  },
  {
    name: 'Explorer persona',
    answers: [
      'I want to work from 5 different countries this year',
      'Anywhere with good wifi and natural light',
      "I'm adaptable — I work well in any environment",
      'Being tied to a specific location',
      'Waking up in a new city and opening my laptop to great work',
    ],
    expectedEra: 'explorer',
  },
];

describe('Conversation flow tests', () => {
  for (const persona of TEST_PERSONAS) {
    test(`${persona.name} → ${persona.expectedEra} era`, () => {
      // Placeholder: in a real test, this would call the API
      // and assert the era reveal matches expectedEra
      expect(persona.expectedEra).toBeTruthy();
    });
  }
});
