let inputDir = { x: 0, y: 0 };
const moveSound = new Audio("/audio/move.mp3");
const foodSound = new Audio("/audio/food.mp3");
const gameOverSound = new Audio("/audio/gameover.mp3");
let speed = 7;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let scoreval = 0;
let hiscoreval = 0;

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function collide(snake) {
    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // Check for wall collision
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    if (collide(snakeArr)) {
        gameOverSound.play();
        alert("GAME OVER\n Better luck next time!");
        inputDir = { x: 0, y: 0 };
        snakeArr = [{ x: 13, y: 15 }];
        scoreval = 0;
        document.getElementById("score").innerHTML = "SCORE : " + scoreval; // Reset score display
        return; 
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        scoreval++;
        if (scoreval > hiscoreval) {
            hiscoreval = scoreval;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            document.getElementById("hiscore").innerHTML = "HIGH SCORE : " + hiscoreval;
        }
        document.getElementById("score").innerHTML = "SCORE : " + scoreval;

        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        
        let newFoodPosition;
        do {
            newFoodPosition = {
                x: Math.round(Math.random() * (16)) + 1,
                y: Math.round(Math.random() * (16)) + 1
            };
        } while (snakeArr.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
        
        food = newFoodPosition;
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    const gamezone = document.getElementById("gamezone");
    gamezone.innerHTML = ""; // Clear the previous frame

    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.borderRadius="32px";
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        gamezone.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.borderRadius="32px";
    foodElement.classList.add('food');
    gamezone.appendChild(foodElement);

}

let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    document.getElementById("hiscore").innerHTML = "HIGH SCORE : " + hiscoreval;
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) {
                inputDir = { x: 0, y: -1 };
            }
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) {
                inputDir = { x: 0, y: 1 };
            }
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) {
                inputDir = { x: -1, y: 0 };
            }
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) {
                inputDir = { x: 1, y: 0 };
            }
            break;
        default:
            break;
    }
});

// Start the game
window.requestAnimationFrame(main);
