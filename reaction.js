// Reaction Game
const reactionBox = document.getElementById('reactionBox')
const reactionStatus = document.getElementById('reactionStatus')
const reactionResult = document.getElementById('reactionResult')
const reactionReset = document.getElementById('reactionReset')

let startTime = 0
let gameStarted = false
let waitingForGreen = false
let timeoutId = null

const startGame = () => {
    if (gameStarted) return
    
    gameStarted = true
    waitingForGreen = false
    reactionResult.textContent = ''
    reactionResult.className = ''
    reactionStatus.textContent = 'Wait for green...'
    reactionBox.classList.remove('ready')
    
    // Satunnainen viive 2-5 sekuntia
    const delay = Math.random() * 3000 + 2000
    
    timeoutId = setTimeout(() => {
        // Muuta vihreäksi ja aloita aika-mittaus
        reactionBox.classList.add('ready')
        reactionStatus.textContent = 'Click NOW!'
        waitingForGreen = true
        startTime = Date.now()
    }, delay)
}

const handleBoxClick = () => {
    if (!gameStarted) {
        // Pelin aloitus
        startGame()
    } else if (!waitingForGreen) {
        // Klikattiin liian aikaisin (punaisen aikana)
        clearTimeout(timeoutId)
        gameStarted = false
        reactionResult.textContent = '❌ Too early! Try again.'
        reactionResult.className = 'error'
        reactionStatus.textContent = 'Click to start!'
        reactionBox.classList.remove('ready')
    } else {
        // Oikea klikkaus - mittaa aika
        const reactionTime = Date.now() - startTime
        gameStarted = false
        waitingForGreen = false
        
        reactionBox.classList.remove('ready')
        reactionStatus.textContent = 'Great! Click to try again.'
        reactionResult.textContent = `⚡ ${reactionTime}ms`
        reactionResult.className = 'success'
    }
}

const resetGame = () => {
    clearTimeout(timeoutId)
    gameStarted = false
    waitingForGreen = false
    reactionResult.textContent = ''
    reactionResult.className = ''
    reactionStatus.textContent = 'Click to start!'
    reactionBox.classList.remove('ready')
}

reactionBox.addEventListener('click', handleBoxClick)
reactionReset.addEventListener('click', resetGame)

// Jos haluat klikkaa myös ulkopuolella olevalla napilla
reactionBox.style.cursor = 'pointer'
