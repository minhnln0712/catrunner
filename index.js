"use strict";

import { Character } from "./src/class/Character/Character.js";
import { BackgroundParallax } from "./src/class/Image/BackgroundParallax.js";
import { Sound } from "./src/class/Sound/Sound.js";
import { Ground } from "./src/class/Object/Ground.js";
import { Enemy } from "./src/class/Character/Enemy.js";
import { Text } from "./src/class/Text/Text.js";
import { Item } from "./src/class/Object/Item.js";

const GameState = Object.freeze({
    InStartMenu: 0,
    InHelpMenu: 1,
    InGame: 2,
    InPauseMenu: 3,
    InGameOverMenu: 4
})

let currentGameState = GameState.InStartMenu;

const CANVAS = document.getElementById("gameScreen");
const CONTEXT = CANVAS.getContext("2d");
const CANVAS_WIDTH = CANVAS.width = 1000;
const CANVAS_HEIGHT = CANVAS.height = 800;

// Game Stat
const BASE_GRAVITY_VALUE = 0.2;
const CHARACTER_JUMP_FORCE = 8;
const CHARACTER_MOVE_SPEED = 2;

let gameCharacter;
let characterHP = 3;
let KeyInputList = []

window.addEventListener("keydown", function (e) {
    if (!KeyInputList) KeyInputList = [];
    if (KeyInputList.indexOf(e.key) === -1) KeyInputList.push(e.key);
    if (e.key === 'r' || e.key === 'R') ResetGame();
});

window.addEventListener("keyup", function (e) {
    const keyIndex = KeyInputList.indexOf(e.key);
    if (keyIndex !== -1) KeyInputList.splice(keyIndex, 1);
});

const IMAGE_SCALE = 3;
const IMAGE_WIDTH = 256 / IMAGE_SCALE;
const IMAGE_HEIGHT = 256 / IMAGE_SCALE;
const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 32;
const SPRITE_X_DIFF = 30;
const SPRITE_Y_DIFF = 50;
let gameFrame = 0;
const staggerFrames = 5;
const playerSprite = new Image();
playerSprite.src = 'assets/images/tiny_cat/kitty.png';

const CharacterAnimationStateList = [{ name: 'idle_right', frames: 8 }, {
    name: 'walk_right',
    frames: 4
}, { name: 'jump_up_right', frames: 2 }, { name: 'fall_down_right', frames: 2 },];

let AnimationStateIndex = 0;

const enemySprite = new Image();
enemySprite.src = 'assets/images/enemy/Blue_Slime/Run.png'
// Background Parallax
const BACKGROUND_IMAGE_WIDTH = 288;
const BACKGROUND_IMAGE_HEIGHT = 208;
const BACKGROUND_IMAGE_SCALE = 4;
const backgroundImage1 = new Image();
const backgroundImage2 = new Image();
const backgroundImage3 = new Image();
const backgroundImage4 = new Image();
const backgroundImage5 = new Image();
const backgroundImage6 = new Image();
backgroundImage1.src = 'assets/images/background/1 - Leaf_top.png'
backgroundImage2.src = 'assets/images/background/2 - Trees.png'
backgroundImage3.src = 'assets/images/background/3 - Bottom_leaf_piles.png'
backgroundImage4.src = 'assets/images/background/4 - Tree_row_BG_1.png'
backgroundImage5.src = 'assets/images/background/5 - Tree_row_BG_2.png'
backgroundImage6.src = 'assets/images/background/6 - Distant_trees.png'
const bgWidth = BACKGROUND_IMAGE_WIDTH * BACKGROUND_IMAGE_SCALE;
const bgHeight = BACKGROUND_IMAGE_HEIGHT * BACKGROUND_IMAGE_SCALE;
const ParallaxBackgroundLayer1 = new BackgroundParallax(CANVAS, bgWidth, bgHeight, 0, 0, backgroundImage1);
const ParallaxBackgroundLayer2 = new BackgroundParallax(CANVAS, bgWidth, bgHeight, 0, 0, backgroundImage2);
const ParallaxBackgroundLayer3 = new BackgroundParallax(CANVAS, bgWidth, bgHeight, 0, 0, backgroundImage3);
const ParallaxBackgroundLayer4 = new BackgroundParallax(CANVAS, bgWidth, bgHeight, 0, 0, backgroundImage4);
const ParallaxBackgroundLayer5 = new BackgroundParallax(CANVAS, bgWidth, bgHeight, 0, 0, backgroundImage5);
const ParallaxBackgroundLayer6 = new BackgroundParallax(CANVAS, bgWidth, bgHeight, 0, 0, backgroundImage6);
let ParallaxBackgroundLayers = [{
    layer: ParallaxBackgroundLayer6,
    speedX: 1,
    speedY: 0
}, { layer: ParallaxBackgroundLayer5, speedX: 1, speedY: 0 }, {
    layer: ParallaxBackgroundLayer4,
    speedX: 2,
    speedY: 0
}, { layer: ParallaxBackgroundLayer3, speedX: 3, speedY: 0 }, { layer: ParallaxBackgroundLayer1, speedX: 3, speedY: 0 },]

let EnemiesList = [];

let mainGround;
let GroundList = [];

let ItemList = [];

let totalScore = 0;
let scoreText;
let hpText;

const bgm = new Sound('assets/sounds/bgm.mp3', true);
const gameoverSFX = new Sound('/assets/sounds/gameover.mp3', false)

document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("startBtn").classList.toggle("inactive-button");
    document.getElementById('startMenu').classList.toggle('inactive-menu');
    document.getElementById("closeHelpBtn").classList.toggle("inactive-button");
    document.getElementById('helpMenu').classList.toggle('inactive-menu');
    currentGameState = GameState.InHelpMenu;
})

document.getElementById("closeHelpBtn").addEventListener("click", () => {
    document.getElementById("closeHelpBtn").classList.toggle("inactive-button");
    document.getElementById('helpMenu').classList.toggle('inactive-menu');
    document.getElementById("pauseBtn").classList.toggle("inactive-button");
    document.getElementById("openHelpBtn").classList.toggle("inactive-button");
    document.getElementById('inGameMenu').classList.toggle('inactive-menu');
    bgm.Play();
    currentGameState = GameState.InGame;
})

document.getElementById("openHelpBtn").addEventListener("click", () => {
    document.getElementById("openHelpBtn").classList.toggle("inactive-button");
    document.getElementById("pauseBtn").classList.toggle("inactive-button");
    document.getElementById('inGameMenu').classList.toggle('inactive-menu');
    document.getElementById("closeHelpBtn").classList.toggle("inactive-button");
    document.getElementById('helpMenu').classList.toggle('inactive-menu');
    bgm.Pause();
    currentGameState = GameState.InHelpMenu;
})

document.getElementById("pauseBtn").addEventListener("click", () => {
    document.getElementById("pauseBtn").classList.toggle("inactive-button");
    document.getElementById("openHelpBtn").classList.toggle("inactive-button");
    document.getElementById('inGameMenu').classList.toggle('inactive-menu');
    document.getElementById('continueBtn').classList.toggle('inactive-button');
    document.getElementById('restartPauseBtn').classList.toggle('inactive-button');
    document.getElementById("pauseMenu").classList.toggle("inactive-menu");
    bgm.Pause();
    currentGameState = GameState.InPauseMenu;
})
document.getElementById("muteBtn").addEventListener("click", () => {
    bgm.ToggleMute();
})

document.getElementById("continueBtn").addEventListener("click", () => {
    document.getElementById("continueBtn").classList.toggle("inactive-button");
    document.getElementById("restartPauseBtn").classList.toggle("inactive-button");
    document.getElementById('pauseMenu').classList.toggle('inactive-menu');
    document.getElementById("pauseBtn").classList.toggle("inactive-button");
    document.getElementById("openHelpBtn").classList.toggle("inactive-button");
    document.getElementById('inGameMenu').classList.toggle('inactive-menu');
    bgm.Play();
    currentGameState = GameState.InGame;
})

document.getElementById("restartPauseBtn").addEventListener("click", () => {
    document.getElementById("continueBtn").classList.toggle("inactive-button");
    document.getElementById("restartPauseBtn").classList.toggle("inactive-button");
    document.getElementById('pauseMenu').classList.toggle('inactive-menu');
    document.getElementById("pauseBtn").classList.toggle("inactive-button");
    document.getElementById("openHelpBtn").classList.toggle("inactive-button");
    document.getElementById('inGameMenu').classList.toggle('inactive-menu');
    ResetGame();
})

document.getElementById("restartBtn").addEventListener("click", () => {
    document.getElementById("restartBtn").classList.toggle("inactive-button");
    document.getElementById('gameOverMenu').classList.toggle('inactive-menu');
    document.getElementById("pauseBtn").classList.toggle("inactive-button");
    document.getElementById("openHelpBtn").classList.toggle("inactive-button");
    document.getElementById('inGameMenu').classList.toggle('inactive-menu');
    ResetGame();
})

let testItem;
const itemSprite = new Image();
itemSprite.src = 'assets/images/catfood.png';

BeginPlay();

function BeginPlay() {
    gameCharacter = new Character(CANVAS, 32, 32, 30, 696);
    gameCharacter.InitAnimation(playerSprite, SPRITE_WIDTH, SPRITE_HEIGHT, SPRITE_X_DIFF, SPRITE_Y_DIFF, IMAGE_WIDTH, IMAGE_HEIGHT);
    gameCharacter.bEnableGravity = true;
    gameCharacter.HeightDiff = 22;
    gameCharacter.bDisPlayCollision = false;
    mainGround = new Ground(CANVAS, 1000, 10, 0, 730, "black", 0);
    mainGround.bDisPlayCollision = false;
    scoreText = new Text(CANVAS, 0, 0, 100, 100, "white", "Consolas", "60px");
    hpText = new Text(CANVAS, 0, 0, 100, 200, "red", "Consolas", "60px");
    EventTick();
}

function EachSecondsFromStart(seconds) {
    return Math.floor(gameFrame / 1) % (seconds * 50) === 0;
}

function EventTick() {
    requestAnimationFrame(EventTick);
    if (currentGameState !== GameState.InPauseMenu && currentGameState !== GameState.InGameOverMenu && currentGameState !== GameState.InHelpMenu) {
        gameFrame++;
        CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ParallaxBackgroundLayers.forEach(element => {
            element.layer.UpdateNewPosition(element.speedX, element.speedY);
            element.layer.Update();
        });

        if (currentGameState === GameState.InGame) {
            // Movement Handle
            gameCharacter.StopMovement();
            if (KeyInputList) {
                gameCharacter.MoveRight(-CHARACTER_MOVE_SPEED / 2);
                if (KeyInputList.indexOf("a") !== -1) gameCharacter.MoveRight(-CHARACTER_MOVE_SPEED);
                if (KeyInputList.indexOf("d") !== -1) gameCharacter.MoveRight(CHARACTER_MOVE_SPEED);
                if (gameCharacter.bIsOnTheGround) {
                    if (KeyInputList.indexOf(" ") !== -1) {
                        gameCharacter.Jump(CHARACTER_JUMP_FORCE);
                        gameCharacter.bIsOnTheGround = false;
                    }
                    gameCharacter.animationIndex = 1;
                } else {
                    gameCharacter.GravityDown(gameCharacter.bIsOnTheGround ? 0 : BASE_GRAVITY_VALUE);
                    gameCharacter.animationIndex = gameCharacter.gravitySpeed < 0 ? 2 : 3;
                }
            }

            // Animation and Interaction Handle
            gameCharacter.UpdateNewPosition();
            gameCharacter.UpdateAnimation(gameFrame, staggerFrames, CharacterAnimationStateList[gameCharacter.animationIndex].frames);
            gameCharacter.ApplyGravity();
            gameCharacter.Update();
            mainGround.Update();
            mainGround.CheckCollision(gameCharacter);
            if (EachSecondsFromStart(Math.trunc(Math.random() * 3))) {
                const newEnemy = new Enemy(CANVAS, 40, 30,
                    1000 + Math.trunc(Math.random() * 200),
                    698, (5 + Math.trunc(Math.random() * 5)));
                newEnemy.animationIndex = 0;
                newEnemy.InitAnimation(enemySprite, 128, 128, 38, 98, 128, 128);
                newEnemy.bDisPlayCollision = false;
                EnemiesList.push(newEnemy);
            }
            if (EachSecondsFromStart(Math.trunc(Math.random() * 5))) {
                const newItem = new Item(CANVAS, 80, 80,
                    1000 + Math.trunc(Math.random() * 200),
                    350 + Math.trunc(Math.random() * 300),
                    (2 + Math.trunc(Math.random() * 2)));
                newItem.InitAnimation(itemSprite);
                ItemList.push(newItem);
            }
            if (EachSecondsFromStart(Math.trunc(Math.random() * 10))) {
                const newGround = new Ground(CANVAS, 100 + Math.trunc(Math.random() * 100), 10,
                    1000 + Math.trunc(Math.random() * 300), 600,
                    "orange", (3 + Math.trunc(Math.random() * 2)));
                GroundList.push(newGround);
            }
            EnemiesList.forEach((enemy, index) => {
                enemy.xLocation -= enemy.moveSpeed;
                enemy.UpdateAnimation(gameFrame, staggerFrames, 6);
                enemy.Update();
                if (enemy.CheckCollision(gameCharacter)) {
                    if (!gameCharacter.bIsOnTheGround &&
                        enemy.yLocation >= gameCharacter.yLocation &&
                        enemy.xLocation - enemy.spriteXDiff <= gameCharacter.xLocation) {
                        totalScore += 5;
                        EnemiesList.splice(EnemiesList.indexOf(enemy), 1);
                    } else {
                        characterHP--;
                        if (characterHP > 0) {
                            EnemiesList.splice(EnemiesList.indexOf(enemy), 1);
                        } else {
                            currentGameState = GameState.InGameOverMenu;
                            document.getElementById("restartBtn").classList.toggle("inactive-button");
                            document.getElementById('gameOverMenu').classList.toggle('inactive-menu');
                            document.getElementById("pauseBtn").classList.toggle("inactive-button");
                            document.getElementById("openHelpBtn").classList.toggle("inactive-button");
                            document.getElementById('inGameMenu').classList.toggle('inactive-menu');
                            bgm.Pause();
                            gameoverSFX.Play();
                        }
                    }
                }
                if (enemy.xLocation <= gameCharacter.xLocation && !enemy.passCharacter) {
                    enemy.passCharacter = true;
                    totalScore += 1;
                }
                if (enemy.xLocation < -100) {
                    EnemiesList.shift();
                }
            });
            GroundList.forEach(ground => {
                ground.xLocation -= ground.moveSpeed;
                ground.CheckCollision(gameCharacter);
                ground.Update();
                if (ground.xLocation < -500) {
                    GroundList.shift();
                }
            })
            ItemList.forEach(item => {
                item.xLocation -= item.moveSpeed;
                if (item.CheckCollision(gameCharacter)) {
                    totalScore += 10;
                    ItemList.splice(ItemList.indexOf(item), 1);
                }
                item.UpdateAnimation();
                item.Update();
                if (item.xLocation < -100) {
                    ItemList.shift();
                }
            })
        }

        ParallaxBackgroundLayer2.UpdateNewPosition(2, 0);
        ParallaxBackgroundLayer2.Update();
        if (currentGameState === GameState.InGame) {
            let hpTextTemp = '';
            for (let i = 0; i < characterHP; i++) {
                hpTextTemp += '❤ ';
            }
            hpText.textContent = hpTextTemp;
            hpText.Update();
            scoreText.textContent = "Score: " + totalScore;
            scoreText.Update();
        }
    }
}

function ResetGame() {
    CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    EnemiesList = [];
    GroundList = [];
    ItemList = [];
    gameCharacter.xLocation = 30;
    gameCharacter.yLocation = 696;
    totalScore = gameFrame = 0;
    characterHP = 3;
    gameoverSFX.Pause();
    gameoverSFX.Restart();
    bgm.Restart();
    bgm.Play();
    currentGameState = GameState.InGame;
}