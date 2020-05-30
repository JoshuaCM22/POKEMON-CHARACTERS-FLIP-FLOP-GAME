// Created by: Joshua C. Magoliman
var audioInGame = new Audio('audios/in-game.mp3');
var audioWinGame = new Audio('audios/win-game.mp3');
var audioGameOver = new Audio('audios/gameover.mp3');
// Variables for divs and shuffling blocks
var divblock, blockData, blockFrontImages, memoryBlockArr, blocksArray, blockFrontImagesAll, shuffledBlocks;
// Variables for flips and logic
var currentlyFlippedArr, matchedCount, blockToMatch1, blockToMatch2;
// Variables for game info
var flipCounter, timer, gameOn = false;
var overLays = Array.from(document.getElementsByClassName('overlay-text'));
overLays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
        resetGame();
        init();
        stopAudio(audioWinGame);
        stopAudio(audioGameOver);
        playAudio(audioInGame);
    });
});
function playAudio(param_audio) {
    param_audio.play();
}
function stopAudio(param_audio) {
    param_audio.pause();
    param_audio.currentTime = 0;
}
function startCountdown() {
    return setInterval(() => {
        this.timeRemaining--;
        this.timer.innerText = this.timeRemaining;
        if (this.timeRemaining === 0)
            this.gameOver();
    }, 1000);
}
function resetGame() {
    var elements = document.getElementsByClassName("block");
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
function init() {
    // Initializing all variables at the top with values
    gameOn = true;
    memoryBlockArr = new Array(18);
    blocksArray = [];
    blockFrontImagesAll = [];
    shuffledBlocks = [];
    currentlyFlippedArr = [];
    matchedCount = 0;
    flipCounter = 0;
    var minutes = 2;
    var display = document.getElementById("Timer");
    blockFrontImages = ["images/Pokemon1-Bulbasaur.gif",
        "images/Pokemon2-Pikachu.gif",
        "images/Pokemon3-Squirtle.gif",
        "images/Pokemon4-Meowth.gif",
        "images/Pokemon5-Eevee.gif",
        "images/Pokemon6-Charmeleon.gif",
        "images/Pokemon7-Heracross.gif",
        "images/Pokemon8-Jigglypuff.gif",
        "images/Pokemon9-Hoopa.gif"];
    startTimer(minutes, display);
    blockFrontImagesAll = blockFrontImages.concat(blockFrontImages);
    shuffledBlocks = shuffleBlocks(blockFrontImagesAll);
    document.getElementById("Flips").innerText = `Flips: ${flipCounter}`;
    createElements();
}
function createElements() {
    var finalCount = shuffledBlocks.length;
    for (var i = 0; i < finalCount; i++) {
        var cardFront = shuffledBlocks.pop();
        blockData = new MemoryBlock(i, cardFront, "images/Pokemon-Ball.png");
        memoryBlockArr[i] = blockData;
        divblock = document.createElement("div");
        divblockFront = document.createElement("div");
        divblockBack = document.createElement("div");
        imgFront = document.createElement("img");
        imgBack = document.createElement("img");
        divblock.id = memoryBlockArr[i].id;
        divblock.className = memoryBlockArr[i].blockCSS;
        divblockFront.className = memoryBlockArr[i].frontCSS;
        divblockBack.className = memoryBlockArr[i].backCSS;
        imgFront.src = memoryBlockArr[i].frontImage;
        imgFront.className = memoryBlockArr[i].imgCSS;
        imgBack.src = memoryBlockArr[i].backImage;
        imgBack.className = memoryBlockArr[i].imgCSS;
        divblockFront.append(imgFront);
        divblockBack.append(imgBack);
        divblock.append(divblockFront);
        divblock.append(divblockBack);
        divblock.addEventListener('click', flipBlock);
        document.getElementById("gameMainBlock").append(divblock);
    }
}
var countDown = 0;
function startTimer(duration, display) {
    var timer = 60 * duration, minutes, seconds;
    countDown = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = `Time ${minutes}:${seconds}`;
        if (--timer < 0) {
            gameOver();
        }
    }, 1000);
}
class MemoryBlock {
    constructor(id, frontImage, backImage) {
        this.id = id;
        this.blockCSS = "block";
        this.frontImage = frontImage;
        this.backImage = backImage;
        this.front = false;
        this.back = true;
        this.frontCSS = "block-front block-face";
        this.backCSS = "block-back block-face";
        this.imgCSS = "block-value";
    }
}
function hideElements() {
    hideBlocks = Array.from(document.getElementsByClassName('block'));
    for (var i = 0; i < hideBlocks.length; i++) {
        document.getElementById(hideBlocks[i].id).classList.remove('visible');
    }
}
function shuffleBlocks(blocksArray) {
    var currentIndex = blocksArray.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick an element from the remaining lot
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // Swap it with the current element.
        temporaryValue = blocksArray[currentIndex];
        blocksArray[currentIndex] = blocksArray[randomIndex];
        blocksArray[randomIndex] = temporaryValue;
    }
    return blocksArray;
}
function flipBlock() {
    if (gameOn === true) {
        this.classList.add('visible');
        flipCounter += 1;
        document.getElementById("Flips").innerText = `Flips: ${flipCounter}`;
        if (blockToMatch1 !== this.id) {
            if (currentlyFlippedArr.length === 0) {
                currentlyFlippedArr.push(this.innerHTML);
                blockToMatch1 = this.id;
            }
            else if (currentlyFlippedArr.length === 1) {
                currentlyFlippedArr.push(this.innerHTML);
                blockToMatch2 = this.id;
                if (currentlyFlippedArr[0] === currentlyFlippedArr[1]) {
                    blocksMatched();
                }
                else {
                    gameOn = false;
                    var wait = ms => new Promise(resolve => setTimeout(resolve, ms));
                    Promise.resolve(800).then(() => wait(800)).then(() => { revertFlip(); });
                }
            }
        }
    }
}
function blocksMatched() {
    currentlyFlippedArr = [];
    matchedCount += 2;
    document.getElementById(blockToMatch1).removeEventListener('click', flipBlock);
    document.getElementById(blockToMatch2).removeEventListener('click', flipBlock);
    if (matchedCount === memoryBlockArr.length) {
        var wait = ms => new Promise(resolve => setTimeout(resolve, ms));
        Promise.resolve(1000).then(() => wait(1000)).then(() => { showWin(); });
    }
}
function revertFlip() {
    document.getElementById(blockToMatch1).classList.remove('visible');
    document.getElementById(blockToMatch2).classList.remove('visible');
    currentlyFlippedArr = [];
    gameOn = true;
}
function showWin() {
    hideElements();
    gameOn = false;
    document.getElementById('winText').classList.add('visible');
    clearInterval(countDown);
    stopAudio(audioInGame);
    playAudio(audioWinGame);
}
function gameOver() {
    gameOn = false;
    document.getElementById('gameOverText').classList.add('visible');
    clearInterval(countDown);
    stopAudio(audioInGame);
    playAudio(audioGameOver);
}