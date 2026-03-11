/**
 * Tests for functions.js (Hangman-like game)
 * Using Jest with jsdom to simulate DOM interactions
 */

// Build a minimal DOM to host the app
function setupDOM() {
  document.body.innerHTML = `
    <input />
    <output></output>
    <span></span>
  `;
}

// Load the script after DOM is ready
function loadScript() {
  jest.isolateModules(() => {
    require('../functions.js');
  });
}

// Utility to override global alert and capture calls
function mockAlert() {
  const calls = [];
  const original = global.alert;
  global.alert = (msg) => calls.push(String(msg));
  return {
    calls,
    restore: () => (global.alert = original),
  };
}

// Control randomness for deterministic tests
function mockMathRandom(sequence) {
  let i = 0;
  const original = Math.random;
  Math.random = () => {
    const v = sequence[Math.min(i, sequence.length - 1)];
    i += 1;
    return v;
  };
  return { restore: () => (Math.random = original) };
}

// Helpers to interact with UI
function pressEnterWith(value) {
  const input = document.querySelector('input');
  input.value = value;
  const event = new KeyboardEvent('keypress', { key: 'Enter' });
  input.dispatchEvent(event);
}

describe('functions.js Hangman behaviors', () => {
  afterEach(() => {
    // Cleanup global patches
    jest.resetModules();
    document.body.innerHTML = '';
  });

  test('Starts a new game showing masked word and zero guesses', () => {
    const rnd = mockMathRandom([0]); // pick first word ("programming") length 11
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    const output = document.querySelector('output');
    const span = document.querySelector('span');

    expect(output.textContent).toBe('*'.repeat(11));
    expect(span.textContent).toBe('0');

    rnd.restore();
    alertSpy.restore();
  });

  test('Correct single-letter guess reveals all matching positions', () => {
    const rnd = mockMathRandom([0]); // word: programming
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    // Guess letter "g" which appears twice in "programming"
    pressEnterWith('g');

    const output = document.querySelector('output');
    expect(output.textContent).toMatch(/g\*{8}g/);

    rnd.restore();
    alertSpy.restore();
  });

  test('Wrong single-letter guess triggers alert and does not change masked word', () => {
    const rnd = mockMathRandom([0]); // programming
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    const before = document.querySelector('output').textContent;
    pressEnterWith('z');

    const output = document.querySelector('output');
    expect(output.textContent).toBe(before);
    expect(alertSpy.calls.some((m) => m.includes('guessed wrong'))).toBe(true);

    rnd.restore();
    alertSpy.restore();
  });

  test('Full-word correct guess triggers win alert and resets game', () => {
    // Choose a specific word via Math.random; index 1 => "javascript" (length 10)
    const rnd = mockMathRandom([1]);
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    // Extract the chosen word by inspecting console? Instead, compute from list index.
    // Reconstruct list as in code order to know expectation
    const words = [
      'programming',
      'javascript',
      'database',
      'markup',
      'framework',
      'variable',
      'stylesheet',
      'library',
      'asynchronous',
      'hypertext',
    ];
    const chosen = words[1];

    pressEnterWith(chosen);

    // Should have shown a win alert
    expect(alertSpy.calls.some((m) => m.includes('You have guessed right'))).toBe(true);

    // After newGame, masked output should reset to the new random selection's mask.
    const output = document.querySelector('output');
    expect(output.textContent.length).toBeGreaterThan(0);

    rnd.restore();
    alertSpy.restore();
  });

  test('Guess counter increments and displays on each Enter press', () => {
    const rnd = mockMathRandom([0]);
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    const span = document.querySelector('span');

    pressEnterWith('x'); // 1
    expect(span.textContent).toBe('1');

    pressEnterWith('x'); // 2
    expect(span.textContent).toBe('2');

    rnd.restore();
    alertSpy.restore();
  });

  test('Letter matching is case-insensitive', () => {
    const rnd = mockMathRandom([0]); // programming includes 'P' at start when lowercased
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    pressEnterWith('P'); // uppercase should match lowercase word

    const output = document.querySelector('output');
    // programming starts with 'p' so first char should be revealed
    expect(output.textContent.charAt(0).toLowerCase()).toBe('p');

    rnd.restore();
    alertSpy.restore();
  });

  test('Non-single, incorrect partial guess triggers wrong alert', () => {
    const rnd = mockMathRandom([0]);
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    pressEnterWith('progra'); // not full word and not single char
    expect(alertSpy.calls.some((m) => m.includes('guessed wrong'))).toBe(true);

    rnd.restore();
    alertSpy.restore();
  });
});
