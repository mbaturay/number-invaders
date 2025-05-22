// Number Invaders - Basic Game Logic

// Game state initialization
let level = 1;
let score = 0;
let misses = 0;
let selectedNumber = 0;
const lineLength = 24; // Board is now 24 characters long
let gameLine = []; // Start with an empty board
let spawnInterval = null;

// DOM references
const boardEl = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const missesEl = document.getElementById('misses');
const selectorEl = document.getElementById('selected-number');

// Render function to update the game board and selector
function render() {
    // Render game board
    boardEl.innerHTML = '';
    for (let i = 0; i < gameLine.length; i++) {
        const cell = document.createElement('span');
        cell.className = 'cell';
        cell.textContent = gameLine[i];
        // Add animation delay based on position
        cell.style.animationDelay = `${i * 0.05}s`;
        
        // If this is a newly added number, give it an entrance animation
        if (i === gameLine.length - 1) {
            cell.style.transform = 'scale(1.2)';
            cell.style.opacity = '0.7';
            setTimeout(() => {
                cell.style.transform = 'scale(1)';
                cell.style.opacity = '1';
            }, 50);
        }
        
        boardEl.appendChild(cell);
    }
    
    // Render info
    scoreEl.textContent = `Score: ${score}`;
    levelEl.textContent = `Level: ${level}`;
    missesEl.textContent = `Misses: ${misses}`;
    
    // Render selector
    selectorEl.textContent = selectedNumber;
}

// Keyboard controls for cycling selected number
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        selectedNumber = (selectedNumber + 1) % 10;
        render();
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        selectedNumber = (selectedNumber + 9) % 10;
        render();
        e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Enter') {
        // Space or Enter pressed: shoot
        let matchIdx = -1;
        for (let i = gameLine.length - 1; i >= 0; i--) {
            if (gameLine[i] === selectedNumber) {
                matchIdx = i;
                break;
            }
        }
        if (matchIdx !== -1) {
            // Remove the matched number
            gameLine.splice(matchIdx, 1);
            // Scoring: rightmost (index 19) gives 1 point, leftmost (index 0) gives 20 points
            score += gameLine.length + 1 - matchIdx;
            // Update level
            level = getLevel();
            render();
            if (spawnInterval) clearInterval(spawnInterval);
            setTimeout(() => {
                startSpawner();
            }, 250);
        } else {
            // Deduct 5 points as penalty and increment misses
            score -= 5; // Allow score to go negative
            misses++;
            level = getLevel();
            render();
        }
        e.preventDefault();
    }
});

function getLevel() {
    // Level based on score, max 100
    return Math.min(Math.floor(score / 50) + 1, 100);
}

function getSpawnDelay() {
    // Delay based on level
    return Math.max(1500 - level * 10, 100);
}

function startSpawner() {
    if (spawnInterval) clearInterval(spawnInterval);
    const interval = getSpawnDelay();
    spawnInterval = setInterval(() => {
        spawnNumber();
    }, interval);
}

function spawnNumber() {
    // Shift all numbers left by one
    if (gameLine.length > 0) {
        for (let i = 0; i < gameLine.length; i++) {
            // No-op, just for clarity: numbers will be shifted by array ops below
        }
    }
    // If a number is at index 0, game over
    if (gameLine.length > 0 && gameLine[0] !== undefined) {
        // After shifting, check if any number is at index 0
        // Actually, shift left by removing the first element if the array is full
        if (gameLine.length === lineLength) {
            // If the board is full, shifting left means dropping the leftmost
            gameOver();
            return;
        }
    }
    // Shift left by moving all numbers one position to the left
    // (i.e., just add to the end, and let the array grow)
    // Add a new random number (0-9) to the rightmost position
    gameLine.push(Math.floor(Math.random() * 10));
    // If after pushing, the array is too long, trigger game over
    if (gameLine.length > lineLength) {
        gameOver();
        return;
    }
    render();
}

function gameOver() {
    if (spawnInterval) clearInterval(spawnInterval);
    document.querySelector('.level-message').style.display = 'block';
    document.querySelector('.level-message').textContent = 'GAME OVER';
}

// Initial render and spawner
render();
startSpawner();
