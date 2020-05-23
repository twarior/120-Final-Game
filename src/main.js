//Tennessee Phillips Ward, Katarina Kelso, Kalvin Vinski
//



let config = {
    type: Phaser.CANVAS,
    width: 400,
    height: 300,
    pixelArt: true,
    zoom: 4,
    physics: {
        default: 'arcade',
        arcade:{
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [Menu, Play, Level1, ],
};

let game = new Phaser.Game(config);

game.settings = {
    
}

let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE;