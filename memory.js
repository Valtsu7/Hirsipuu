// Memory Game
const memoryBoard = document.getElementById('memoryBoard')
const attemptsSpan = document.getElementById('attempts')
const resetMemoryBtn = document.getElementById('resetMemory')

// Emoji pairs
const emojis = [
    '🎮', '🎮',
    '🎨', '🎨',
    '🎭', '🎭',
    '🎪', '🎪',
    '🎸', '🎸',
    '🎯', '🎯'
]

let cards = []
let flipped = []
let matched = 0
let attempts = 0
let isProcessing = false

const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

const initializeMemory = () => {
    memoryBoard.innerHTML = ''
    cards = shuffleArray(emojis)
    flipped = []
    matched = 0
    attempts = 0
    isProcessing = false
    attemptsSpan.innerHTML = attempts
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div')
        card.className = 'memory-card hidden'
        card.dataset.index = index
        card.dataset.emoji = emoji
        card.innerHTML = emoji
        card.addEventListener('click', flipCard)
        memoryBoard.appendChild(card)
    })
}

const flipCard = (e) => {
    if (isProcessing) return
    
    const card = e.target
    const index = card.dataset.index
    
    // Älä käännä jos kortti on jo käännetty tai pariutettú
    if (flipped.includes(index) || card.classList.contains('matched')) {
        return
    }
    
    card.classList.remove('hidden')
    card.classList.add('flipped')
    flipped.push(index)
    
    if (flipped.length === 2) {
        isProcessing = true
        attempts++
        attemptsSpan.innerHTML = attempts
        checkMatch()
    }
}

const checkMatch = () => {
    const [first, second] = flipped
    const firstCard = document.querySelector(`[data-index="${first}"]`)
    const secondCard = document.querySelector(`[data-index="${second}"]`)
    
    const isMatch = cards[first] === cards[second]
    
    if (isMatch) {
        // Pari löytyi
        firstCard.classList.add('matched')
        secondCard.classList.add('matched')
        matched++
        flipped = []
        isProcessing = false
        
        // Tarkista voitto
        if (matched === 6) {
            setTimeout(() => {
                alert(`You won! It took you ${attempts} attempts.`)
            }, 300)
        }
    } else {
        // Ei paria - käännä takaisin
        setTimeout(() => {
            firstCard.classList.remove('flipped')
            secondCard.classList.remove('flipped')
            firstCard.classList.add('hidden')
            secondCard.classList.add('hidden')
            flipped = []
            isProcessing = false
        }, 1000)
    }
}

resetMemoryBtn.addEventListener('click', initializeMemory)

// Alusta peli kun sivu latautuu
initializeMemory()
