
// Get access to all relevant elements

const choices = [...document.querySelectorAll('.choice-button')]
const choiceImgs = [...document.querySelectorAll('.choice-img')]
const choicePlayer = [...document.querySelectorAll('.choice-player')]
const choiceComputer = [...document.querySelectorAll('.choice-computer')]

const announcmentText = document.querySelector('#announcement > p')
const roundText = document.querySelector('#round')
const scoreText = document.querySelector('#score')

const finalDiv = document.querySelector('#final')
const roundResultText = document.querySelector('#round-result')
const restartBtn = document.querySelector('#restart-btn')

// Computer's random choice function
const possibleChoices = ['rock', 'paper', 'scissors']

function getComputer() {
    return possibleChoices[Math.floor(Math.random() * possibleChoices.length)]
}

// Initial values
let scorePlayer = 0
let scoreComputer = 0
let round = 0
let maxScore = 5

roundText.value = ''
scoreText.value = ''

// buttons images and info paragraphs are in order so we can use
// index to access them
function selectButton(index) {
    function inner(e) {

        // Reset player and computer choices
        choicePlayer.forEach(info => {
            info.textContent = ''
        })
        choiceComputer.forEach(info => {
            info.textContent = ''
        })

        // Get Player Selection
        const playerSelection = choices[index].getAttribute('data-choice')

        // Animate player selection
        choiceImgs[index].animate([
            {transform: 'scale(1.0)'},
            {transform: 'scale(1.1)'},
            {transform: 'scale(1.0)'}], 100)
        choicePlayer[index].textContent = 'Your choice'

        // Get computer selection
        const computerSelection = getComputer()
        // Get index of the computer selection
        const computerIndex = choices.findIndex(
            obj => obj.getAttribute('data-choice') == computerSelection)

        // Animate computer selection after some time
        setTimeout( () => {
            // choices[computerIndex].classList.add('chosen-computer')
            choiceImgs[computerIndex].animate([
                {transform: 'scale(1.0)'},
                {transform: 'scale(1.1)'},
                {transform: 'scale(1.0)'}], 200)
            choiceComputer[computerIndex].textContent = 'Computer\'s choice'
        }, 100)
        
        const result = playRound(playerSelection, computerSelection)

        if (result === 1) {
            scorePlayer++
            announcmentText.textContent = `You win! ${playerSelection} beats ${computerSelection}.`
            if (playerSelection == 'scissors') announcmentText.textContent = announcmentText.textContent.replace('beats', 'beat')
        } else if (result === -1){
            scoreComputer++
            announcmentText.textContent = `You lose! ${playerSelection} loses to ${computerSelection}.`
            if (playerSelection == 'scissors') announcmentText.textContent = announcmentText.textContent.replace('loses', 'lose')
        } else {
            announcmentText.textContent = `It's a draw! You both picked ${playerSelection}.`
        }
        round++

        roundText.value = round
        scoreText.value = `Player ${scorePlayer} : ${scoreComputer} Computer`

        if (scorePlayer >= maxScore || scoreComputer >= maxScore) {

            if (scorePlayer > scoreComputer) {
                roundResultText.textContent = "You win the game!\n"
                finalDiv.style.backgroundColor = 'rgba(100, 150, 125, 0.95)'
            } else if (scorePlayer < scoreComputer) {
                roundResultText.textContent = "You lose the game!\n"
                finalDiv.style.backgroundColor = 'rgba(200, 100, 125, 0.95)'
            } else {
                roundResultText.textContent = "It\'s a draw! How did that happen?\n"
                finalDiv.style.backgroundColor = 'rgba(100, 100, 125, 0.95)'
            }

            roundResultText.textContent += `Final score: Player ${scorePlayer}:${scoreComputer} Computer`

            // Show final div on game end
            finalDiv.style.visibility = 'visible'
            finalDiv.style.opacity = '1'

            scorePlayer = 0
            scoreComputer = 0
            round = 0
        }

    }

    return inner
}

// Reset game function
function resetGame(e){

    // Reset all relevant fields

    choicePlayer.forEach(info => {
        info.textContent = ''
    })
    choiceComputer.forEach(info => {
        info.textContent = ''
    })

    announcmentText.textContent = 'Begin by selecting your choice.'
    roundText.value = ''
    scoreText.value = ''

    finalDiv.style.visibility = 'hidden'
    finalDiv.style.opacity = '0'

    
}

// For each choice button add event listener.
// Calling selectButton(index) returns inner function which is called with the
// e(event) object but it also has the access to the index value
choices.forEach((choice, index) => choice.addEventListener('click', selectButton(index)))

// Attach event listener to the restart button
restartBtn.addEventListener('click', resetGame)

// Play 1 round
function playRound(playerSelection, computerSelection) {

    // Format input
    playerSelection = playerSelection.trim().toLowerCase()
    computerSelection = computerSelection.trim().toLowerCase()

    // This implementation is kinda funky and I could've freely used 'if-else'
    switch (playerSelection + ' ' + computerSelection) {
        
        case 'paper rock':
        case 'scissors paper':
        case 'rock scissors':
            console.log(`%cYou win! ${playerSelection} beats ${computerSelection}.`, 'color: green;')
            return 1
            // return [1, 0, 0]

        case 'rock paper':
        case 'paper scissors':
        case 'scissors rock':
            console.log(`%cYou lose! ${playerSelection} loses to ${computerSelection}.`, 'color: red;')
            return -1
            // return [0, 1, 0]

        default:
            console.log(`It's a draw! You both picked ${playerSelection}.`)
            return 0
            // return [0, 0, 1]

    }

}

// Console version
function _play(rounds=5) {

    scorePlayer = 0
    scoreComputer = 0
    maxScore = Math.floor(rounds / 2)

    // Using 'while' would've been easier
    for(let i = 0; i < rounds; i++) {
        
        let result = playRound(prompt('What?', 'rock'),  getComputer())

        // Increasing score and increasing rounds if draw
        result === 1 ? scorePlayer++ : result == -1 ? scoreComputer++ : rounds++
        // scorePlayer += result[0]
        // scoreComputer += result[1]
        // rounds += result[2]

        console.log(`Current score is Player ${scorePlayer}:${scoreComputer} Computer`)

        if (scorePlayer > maxScore || scoreComputer > maxScore) break

    }

    if (scorePlayer > scoreComputer) {
        console.log('%cYou win the game!', 'font-size: 26px; color: green;')
    } else if (scorePlayer < scoreComputer) {
        console.log('%cYou lose the game!', 'font-size: 26px; color: red;')
    } else {
        console.log('%cIt\'s a draw! How did that happen?', 'font-size: 26px;')
    }

}

// _play()