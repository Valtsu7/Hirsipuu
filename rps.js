// Rock Paper Scissors Game - IIFE wrapper to avoid conflicts
(function() {
    const choiceButtons = document.querySelectorAll('.choice-btn')
    const playerChoiceDisplay = document.getElementById('playerChoice')
    const computerChoiceDisplay = document.getElementById('computerChoice')
    const resultDisplay = document.getElementById('rpsResult')
    const playerScoreDisplay = document.getElementById('playerScore')
    const computerScoreDisplay = document.getElementById('computerScore')
    const rpsReset = document.getElementById('rpsReset')

    const choices = ['rock', 'paper', 'scissors']
    const emojis = {
        rock: '🪨 Rock',
        paper: '📄 Paper',
        scissors: '✂️ Scissors'
    }

    let playerScore = 0
    let computerScore = 0

    // Tietokone valitsee satunnaisen valinnan
    const getComputerChoice = () => {
        return choices[Math.floor(Math.random() * choices.length)]
    }

    // Määrittää voittajan
    const determineWinner = (player, computer) => {
        if (player === computer) {
            return 'tie'
        }
        
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'player'
        }
        
        return 'computer'
    }

    // Pelin logiikka
    const playGame = (playerChoice) => {
        const computerChoice = getComputerChoice()
        const result = determineWinner(playerChoice, computerChoice)

        // Näytä valinnat
        playerChoiceDisplay.textContent = emojis[playerChoice]
        computerChoiceDisplay.textContent = emojis[computerChoice]

        // Päivitä pistetilanne
        if (result === 'player') {
            playerScore++
            playerScoreDisplay.textContent = playerScore
            resultDisplay.textContent = '✨ You win!'
            resultDisplay.className = 'rps-result win'
        } else if (result === 'computer') {
            computerScore++
            computerScoreDisplay.textContent = computerScore
            resultDisplay.textContent = '💻 Computer wins!'
            resultDisplay.className = 'rps-result lose'
        } else {
            resultDisplay.textContent = '🤝 It\'s a tie!'
            resultDisplay.className = 'rps-result tie'
        }

        // Poista click-kuuntelija ja lisää se uudelleen (estää kaksinkertaiset klikkaukset)
        disableButtons()
        setTimeout(enableButtons, 800)
    }

    const disableButtons = () => {
        choiceButtons.forEach(btn => {
            btn.disabled = true
            btn.style.opacity = '0.5'
        })
    }

    const enableButtons = () => {
        choiceButtons.forEach(btn => {
            btn.disabled = false
            btn.style.opacity = '1'
        })
    }

    const resetGame = () => {
        playerScore = 0
        computerScore = 0
        playerScoreDisplay.textContent = 0
        computerScoreDisplay.textContent = 0
        playerChoiceDisplay.textContent = '—'
        computerChoiceDisplay.textContent = '—'
        resultDisplay.textContent = ''
        resultDisplay.className = 'rps-result'
    }

    // Event listeneri jokaiselle painikkeelle
    choiceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.getAttribute('data-choice')
            playGame(choice)
        })
    })

    // Reset painikkeelle
    rpsReset.addEventListener('click', resetGame)

    console.log('RPS game loaded')
})();
