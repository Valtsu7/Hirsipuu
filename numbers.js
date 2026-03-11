// Number Guess Game - IIFE wrapper to avoid conflicts
(function() {
    const numberForm = document.getElementById('numberForm')
    const numberInput = document.getElementById('numberInput')
    const numberFeedback = document.getElementById('numberFeedback')
    const attemptCount = document.getElementById('attemptCount')
    const numberReset = document.getElementById('numberReset')

    console.log('numbers.js loaded')
    console.log('numberForm:', numberForm)

    let secretNumber = 0
    let attempts = 0
    let gameWon = false

    const initializeGame = () => {
        secretNumber = Math.floor(Math.random() * 100) + 1
        attempts = 0
        gameWon = false
        numberInput.value = ''
        numberInput.disabled = false
        numberFeedback.textContent = ''
        numberFeedback.className = ''
        attemptCount.textContent = 0
        numberReset.style.display = 'none'
        numberForm.style.display = 'flex'
        numberInput.focus()
        console.log('Game initialized. Secret number:', secretNumber)
    }

    const handleGuess = (e) => {
        console.log('handleGuess called!')
        e.preventDefault()
        
        if (gameWon) return
        
        const guess = parseInt(numberInput.value)
        console.log('Guess:', guess, 'Secret:', secretNumber)
        
        // Validointi
        if (isNaN(guess) || guess < 1 || guess > 100) {
            numberFeedback.textContent = '⚠️ Please enter a number between 1 and 100'
            numberFeedback.className = ''
            return
        }
        
        attempts++
        attemptCount.textContent = attempts
        numberInput.value = ''
        
        if (guess === secretNumber) {
            // Oikea vastaus
            gameWon = true
            numberFeedback.textContent = `🎉 Correct! The number was ${secretNumber}. You took ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}!`
            numberFeedback.className = 'correct'
            numberInput.disabled = true
            numberForm.style.display = 'none'
            numberReset.style.display = 'block'
        } else if (guess < secretNumber) {
            // Liian pieni - näytä alert ilmoitus
            numberFeedback.textContent = '↑ The number is HIGHER!'
            numberFeedback.className = 'higher'
            alert(`❌ Too low! The number is HIGHER than ${guess}`)
        } else {
            // Liian suuri - näytä alert ilmoitus
            numberFeedback.textContent = '↓ The number is LOWER!'
            numberFeedback.className = 'lower'
            alert(`❌ Too high! The number is LOWER than ${guess}`)
        }
        
        numberInput.focus()
    }

    // Submit button listener
    const submitBtn = numberForm.querySelector('.submit-btn')
    console.log('Find submit button:', submitBtn)

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            console.log('Submit button clicked!')
            e.preventDefault()
            handleGuess(e)
        })
    } else {
        console.error('Submit button NOT found!')
    }

    // Reset button listener
    numberReset.addEventListener('click', initializeGame)

    // Alusta peli kun sivu latautuu
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGame)
    } else {
        initializeGame()
    }
})();
