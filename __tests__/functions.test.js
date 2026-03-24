/**
 * Tests for functions.js (Hangman-like game)
 * Using Jest with jsdom to simulate DOM interactions
 */

// Build a minimal DOM to host the app
function setupDOM() {
  document.body.innerHTML = `
    <button class="nav-btn" data-game="hangman">Hangman</button>
    <div id="hangman" class="game-container">
      <input />
      <output></output>
      <span></span>
      <button id="hintBtn">Hint</button>
    </div>
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
  const input = document.querySelector('#hangman input');
  input.value = value;
  const event = new KeyboardEvent('keypress', { key: 'Enter' });
  input.dispatchEvent(event);
}

describe('functions.js Hangman behaviors', () => {
  afterEach(() => {
    // Cleanup global patches
    jest.resetModules();
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  test('Starts a new game showing masked word and zero guesses', () => {
    const rnd = mockMathRandom([0]); // pick first word ("programming")
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
    const rnd = mockMathRandom([0]);
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    // Guess letter "g" which appears twice in "programming"
    pressEnterWith('g');

    const output = document.querySelector('output');
    // Ensure both 'g' characters are revealed (two occurrences in "programming")
    const gCount = output.textContent.split('').filter((c) => c === 'g').length;
    expect(gCount).toBe(2);

    rnd.restore();
    alertSpy.restore();
  });

  test('Repeated correct letter guess does not change mask but increments guess counter', () => {
    const rnd = mockMathRandom([0]);
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    const span = document.querySelector('span');
    const output = document.querySelector('output');

    pressEnterWith('g');
    const afterFirst = output.textContent;
    const countAfterFirst = span.textContent;

    pressEnterWith('g');
    const afterSecond = output.textContent;
    const countAfterSecond = span.textContent;

    expect(afterSecond).toBe(afterFirst);
    expect(Number(countAfterSecond)).toBe(Number(countAfterFirst) + 1);

    rnd.restore();
    alertSpy.restore();
  });

  test('Empty input increments guess counter and shows wrong-guess alert', () => {
    const rnd = mockMathRandom([0]);
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    const span = document.querySelector('span');
    const before = Number(span.textContent);

    pressEnterWith('');

    const after = Number(span.textContent);
    expect(after).toBe(before + 1);
    expect(alertSpy.calls.some((m) => m.toLowerCase().includes('guessed wrong'))).toBe(true);

    rnd.restore();
    alertSpy.restore();
  });

  test('giveHint reveals a letter and increments guesses by 2 and alerts', () => {
    const rnd = mockMathRandom([0]); // programming
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    const output = document.querySelector('output');
    const span = document.querySelector('span');
    const hintBtn = document.getElementById('hintBtn');

    const beforeMask = output.textContent;
    const beforeGuesses = Number(span.textContent);

    hintBtn.click();

    expect(output.textContent.length).toBe(beforeMask.length);
    expect(Number(span.textContent)).toBe(beforeGuesses + 2);
    expect(alertSpy.calls.some((m) => m.includes('Hint revealed'))).toBe(true);

    rnd.restore();
    alertSpy.restore();
  });

  test('hint can complete word and trigger win when only one letter remains', () => {
    // Use a shorter word with unique letters to make deterministic completion via hint
    // index 3 in words array is 'markup' (from functions.js words list)
    const rnd = mockMathRandom([3]);
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    const word = 'markup';
    const lastChar = word.charAt(word.length - 1); // 'p'
    // Reveal all letters except lastChar
    const uniqueLetters = Array.from(new Set(word.split('')));
    uniqueLetters.forEach((ch) => {
      if (ch !== lastChar) pressEnterWith(ch);
    });

    // Now only lastChar remains hidden; click hint should reveal and trigger win alert
    const hintBtn = document.getElementById('hintBtn');
    hintBtn.click();

    expect(alertSpy.calls.some((m) => m.includes('You have guessed right'))).toBe(true);

    rnd.restore();
    alertSpy.restore();
  });

  test('Non-letter single character acts as wrong guess and does not modify mask', () => {
    const rnd = mockMathRandom([0]);
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    const before = document.querySelector('output').textContent;
    pressEnterWith('1');

    const after = document.querySelector('output').textContent;
    expect(after).toBe(before);
    expect(alertSpy.calls.some((m) => m.toLowerCase().includes('guessed wrong'))).toBe(true);

    rnd.restore();
    alertSpy.restore();
  });

  test('Wrong guess changes output border color then reverts after timeout', () => {
    jest.useFakeTimers();
    const rnd = mockMathRandom([0]);
    const alertSpy = mockAlert();
    setupDOM();
    loadScript();

    const output = document.querySelector('output');

    // Ensure starting border is default after initialization
    expect(output.style.borderColor).toBe('');

    pressEnterWith('z'); // wrong guess should set borderColor to something truthy
    const afterWrong = output.style.borderColor;
    expect(afterWrong).toBeTruthy();

    // advance timers to execute setTimeout restoration
    jest.runAllTimers();

    const afterTimeout = output.style.borderColor;
    // After timeout borderColor should have reverted (either empty or the reset color)
    expect(afterTimeout === '' || afterTimeout === '#e94560' || afterTimeout !== afterWrong).toBeTruthy();

    rnd.restore();
    alertSpy.restore();
    jest.useRealTimers();
  });
});
