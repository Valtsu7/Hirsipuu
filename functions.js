const input = document.querySelector('input')
const output = document.querySelector('output')
const span = document.querySelector('span')

const words = [
    "programming",
    "javascript",
    "database",
    "markup",
    "framework",
    "variable",
    "stylesheet",
    "library",
    "asynchronous",
    "hypertext"
]

let randomizedWord = ''
let maskedWord = ''
let guesses = 0 

const newGame = () => {
    const random = Math.floor(Math.random() * words.length)
    randomizedWord = words[random]
    maskedWord = "*".repeat(randomizedWord.length)
    guesses = 0 
    console.log(randomizedWord)
    output.innerHTML = maskedWord
    span.innerHTML = guesses 
}

const win = () => {
    alert(`You have guessed right, the word is ${randomizedWord}. It took you ${guesses} guesses.`)
    newGame()
}

const replaceFoundChars = (guess) => {
    let newString = maskedWord.split('') 
    let found = false 

    for (let i = 0; i < randomizedWord.length; i++) {
        const char = randomizedWord.charAt(i)
        if (char.toLowerCase() === guess.toLowerCase()) {
            newString[i] = char 
            found = true 
        }
    }

    maskedWord = newString.join('') 
    output.innerHTML = maskedWord 

    if (!found) {
        alert("You guessed wrong!")
    }
}

newGame()

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()

        const guess = input.value
        guesses++ // Kasvatetaan arvauslaskuria
        span.innerHTML = guesses // arvausten määrä

        if (guess.toLowerCase() === randomizedWord.toLowerCase()) {
            win()
        } else if (guess.length === 1) {
            replaceFoundChars(guess)
            if (maskedWord.toLowerCase() === randomizedWord.toLowerCase()) {
                win()
            }
        } else {
            alert("You guessed wrong!")
        }
        input.value = ''
    }
})
