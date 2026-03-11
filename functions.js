const hangmanContainer = document.getElementById('hangman')
const input = hangmanContainer.querySelector('input')
const output = hangmanContainer.querySelector('output')
const span = hangmanContainer.querySelector('span')
const hintBtn = hangmanContainer.querySelector('#hintBtn')

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
    "hypertext",
    "algoritmi",
    "kommentti",
    "debugging",
    "ehto",
    "funktio",
    "iteraatio",
    "julistus",
    "koodi",
    "käyttöliittymä",
    "logiikka",
    "luokka",
    "metodi",
    "muistissa",
    "ohjelmisto",
    "parametri",
    "prosessi",
    "rekursio",
    "silmukka",
    "verkko",
    "sertifikaatti"
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

const changeBackgroundColor = (isCorrect) => {
    const outputElement = document.querySelector('output')
    if (isCorrect) {
        outputElement.style.borderColor = '#00ff7f'
        outputElement.style.boxShadow = '0 0 20px rgba(0, 255, 127, 0.5)'
    } else {
        outputElement.style.borderColor = '#ff4444'
        outputElement.style.boxShadow = '0 0 20px rgba(255, 68, 68, 0.5)'
    }
    
    setTimeout(() => {
        outputElement.style.borderColor = '#e94560'
        outputElement.style.boxShadow = 'none'
    }, 1000)
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
        changeBackgroundColor(false)
    } else {
        changeBackgroundColor(true)
    }
    
    return found
}

const giveHint = () => {
    let newString = maskedWord.split('')
    let hiddenIndices = []
    
    for (let i = 0; i < randomizedWord.length; i++) {
        if (newString[i] === '*') {
            hiddenIndices.push(i)
        }
    }
    
    if (hiddenIndices.length > 0) {
        const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)]
        newString[randomIndex] = randomizedWord.charAt(randomIndex)
        maskedWord = newString.join('')
        output.innerHTML = maskedWord
        guesses += 2
        span.innerHTML = guesses
        alert("Hint revealed! +2 guesses")
        
        if (maskedWord.toLowerCase() === randomizedWord.toLowerCase()) {
            win()
        }
    } else {
        alert("No letters to hint!")
    }
}

// Input event listener hangman-pelille
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()

        const guess = input.value.trim()
        guesses++ // Kasvatetaan arvauslaskuria
        span.innerHTML = guesses // arvausten määrä

        if (guess.length === 1) {
            replaceFoundChars(guess)
            if (maskedWord.toLowerCase() === randomizedWord.toLowerCase()) {
                win()
            }
        } else if (guess.toLowerCase() === randomizedWord.toLowerCase()) {
            changeBackgroundColor(true)
            win()
        } else {
            alert("You guessed wrong!")
            changeBackgroundColor(false)
        }
        input.value = ''
    }
})

hintBtn.addEventListener('click', giveHint)

// Game Portal Navigation
const navButtons = document.querySelectorAll('.nav-btn')
const gameContainers = document.querySelectorAll('.game-container')

navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const gameId = e.target.dataset.game
        
        // Poista active-luokka kaikilta napeillta ja säiliöiltä
        navButtons.forEach(btn => btn.classList.remove('active'))
        gameContainers.forEach(container => container.classList.remove('active'))
        
        // Lisää active-luokka valitulle napeille ja säiliölle
        e.target.classList.add('active')
        document.getElementById(gameId).classList.add('active')
        
        // Alusta hangman peli vain jos hangman on valittu
        if (gameId === 'hangman') {
            newGame()
            input.focus()
        }
    })
})

// Alusta hangman kun sivu latautuu (koska se on oletuksena aktiivinen)
newGame()
