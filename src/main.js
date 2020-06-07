//Tennessee Phillips Ward, Katarina Kelso, Kalvin Vinski
//
//References for Code:
//https://phaser.io/examples/v3/category/games/topdownshooter
//Specifically the combat mechanics one I referenced a lot. 
//
//https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
//https://ourcade.co/tools/phaser3-tiled-parser 
//I used this article a bit, but decided that a lot of it wasn't necessary becasue Tiled and the Ourcade
//app worked well together so I didn't need much additional code. 
//https://github.com/nathanaltice/Mappy/blob/master/src/Scenes/TiledPlatform.js
//The additional code it did need for the physics systems to work I found here on Nathan's Github
//
//https://phaser.io/examples/v2/text/display-text-word-by-word
//This was referenced for the openening story sequence to get the words to appear one after the other
//
//We used Tiled and Ourcade for the Tilemap and Code Formating 
//
//We used Aseprite for the art assets


let config = {
    type: Phaser.WEBGL,
    width: window.innerWidth * window.devicePixelRatio, 
    height: window.innerHeight * window.devicePixelRatio,
    pixelArt: true,
    zoom: 1,
    physics: {
        default: 'arcade',
        arcade:{
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [Menu, Story, Level1, EndStory, Credits],
};

let game = new Phaser.Game(config);

game.settings = {
    
}

let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE;