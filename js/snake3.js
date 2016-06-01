/* --------------------------------------------------------------------------------------------------------------------
 * Variables
 * --------------------------------------------------------------------------------------------------------------------
 */

var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;

var gameState;
var gameOverMenu;
var restartButton;
var playHUD;
var scoreboard;
var mainMenu;
var mainmenuButton;
var soundEfx;
var music;
var death;
var menuMusic;
var menuClick;
var musiceasy;
var deathmusic;

/* --------------------------------------------------------------------------------------------------------------------
 * Executing Game Code
 * --------------------------------------------------------------------------------------------------------------------
 */

gameInitialize();
snakeInitialize();
foodInitialize();
gameStart();
setInterval(gameLoop, 1000 / 20);

/* --------------------------------------------------------------------------------------------------------------------
 * Game Functions
 * --------------------------------------------------------------------------------------------------------------------
 */

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    document.addEventListener("keydown", keyboardHandler);
    
    document.addEventListener("keydown", main);
    
    document.addEventListener("keydown", cheatCodes);
    
    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);
    
    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);
    
    playHUD = document.getElementById("playHUD");
    
    scoreboard = document.getElementById("scoreboard");
    
    mainMenu = document.getElementById("mainMenu");
    centerMenuPosition(mainMenu);
    mainMenu.addEventListener("click", gameStart);
    
    mainmenuButton = document.getElementById("mainmenuButton");
    mainmenuButton.addEventListener("click", MainMenu);
    
    creator = document.getElementById("creator");
    centerMenuPosition(creator);
    
    soundEfx = document.getElementById("soundEfx");
    music = document.getElementById("music");
    death = document.getElementById("death");
    menuMusic = document.getElementById("menuMusic");
    menuClick = document.getElementById("menuClick");
    musiceasy = document.getElementById("musiceasy");
    deathmusic = document.getElementById("deathmusic");

    setState("mainMenu");
}

function gameLoop() {
    gameDraw();
    drawScoreboard();
    if (gameState == "PLAY") {
        snakeUpdate();
        snakeDraw();
        foodDraw();
    }
}

function gameDraw() {
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0, 0, screenWidth, screenHeight);

}

function gameRestart() {
    snakeInitialize();
    foodInitialize();
    hideMenu(gameOverMenu);
    hideMenu(mainMenu);
    setState("PLAY");
    musiceasy.pause();
    musiceasy.currentTime = 0;
    musiceasy.play();
    death.pause();
    death.currentTime = 0;
}

function gameStart() {
    snakeInitialize();
    foodInitialize();
    hideMenu(mainMenu);
    hideMenu(creator);
    setState("PLAY");
    menuClick.play();
    musiceasy.play();
}

function MainMenu() {
    setState("mainMenu");
    menuClick.play();
}


/* -------------------------------------------------------------------------------------------------------------------
 * Snake Functions
 * -------------------------------------------------------------------------------------------------------------------
 */

function snakeInitialize() {
    snake = [];
    snakeLength = 3;
    snakeSize = 23;
    snakeDirection = "down";

    for (var index = snakeLength - 1; index >= 0; index--) {
        snake.push({
            x: index,
            y: 0
        });
    }
}

function snakeDraw() {
    for (var index = 0; index < snake.length; index++) {
        context.fillStyle = "rgb(0, 157, 255)";
        context.fillRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
    }
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;

    if (snakeDirection == "down") {
        snakeHeadY++;
    }
    else if (snakeDirection == "right") {
        snakeHeadX++;
    }
    else if (snakeDirection == "up") {
        snakeHeadY--;
    }
    else if (snakeDirection == "left") {
        snakeHeadX--;
    }

    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY);
    checkSnakeCollisions(snakeHeadX, snakeHeadY);

    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/* -------------------------------------------------------------------------------------------------------------------
 * Food Functions
 * -------------------------------------------------------------------------------------------------------------------
 */

function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
}

function foodDraw() {
    context.fillStyle = "rgb(0, 157, 255)";
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);

    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);
}
/* -------------------------------------------------------------------------------------------------------------------
 * Input Functions
 * -------------------------------------------------------------------------------------------------------------------
 */
function keyboardHandler(event) {
    console.log(event);

    if (event.keyCode == "39" && snakeDirection != "left") {
        snakeDirection = "right";
    }
    else if (event.keyCode == "40" && snakeDirection != "up") {
        snakeDirection = "down";
    }
    else if (event.keyCode == "38" && snakeDirection != "down") {
        snakeDirection = "up";
    }
    else if (event.keyCode == "37" && snakeDirection != "right") {
        snakeDirection = "left";
    }
}

function main(event) {
    console.log(event);
    
    if (event.keyCode == "27") {
        setState("mainMenu");
        menuClick.play();
    }
    else if (event.keyCode == "82") {
        gameRestart();
    }
    else if (event.keyCode == "13") {
        gameStart();
    }
}

function cheatCodes(event) {
    console.log(event);
    
    if (event.keyCode == "71") {
        setState("GAME OVER");
    }
}
/* -------------------------------------------------------------------------------------------------------------------
 * Collision Handling
 * -------------------------------------------------------------------------------------------------------------------
 */

function checkFoodCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX == food.x && snakeHeadY == food.y) {
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
        console.log("Snake +1");
        soundEfx.play();
        setFoodPosition();
    }
}

function checkWallCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0 || snakeHeadY * snakeSize >= screenHeight || snakeHeadY * snakeSize < 0) {
        setState("GAME OVER");
        death.play();
        console.log("GAME OVER");
    }
}

function checkSnakeCollisions(snakeHeadX, snakeHeadY) {
    for(var index = 1; index < snake.length; index++) {
        if(snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
            setState("GAME OVER");
            death.play();
            console.log("You were your greatest weakness");
            return;
        }
    }
}

/* -------------------------------------------------------------------------------------------------------------------
 * Game State Handling
 * -------------------------------------------------------------------------------------------------------------------
 */

function setState(state) {
    gameState = state;
    showMenu(state);
}

/* -------------------------------------------------------------------------------------------------------------------
 * Menu Functions
 * -------------------------------------------------------------------------------------------------------------------
 */

function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}

function showMenu(state) {
    if(state == "GAME OVER") {
        displayMenu(gameOverMenu);
        musiceasy.pause();
        musiceasy.currentTime = 0;
        menuMusic.pause();
        menuMusic.currentTime = 0;
        deathmusic.play();
    }
    else if(state == "PLAY") {
        displayMenu(playHUD);
        menuMusic.pause();
        menuMusic.currentTime = 0;
        deathmusic.pause();
        deathmusic.currentTime = 0;
    }
    else if (state == "mainMenu") {
        displayMenu(mainMenu);
        hideMenu(gameOverMenu);
        hideMenu(playHUD);
        musiceasy.pause();
        musiceasy.currentTime = 0;
        menuMusic.play();
        deathmusic.pause();
        deathmusic.currentTime = 0;
    }
}

function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 1.7) + "px";
}

function drawScoreboard() {
    scoreboard.innerHTML = "Score: " + (snakeLength - 3);
}