//Tennessee Phillips Ward, Katarina Kelso, Kalvin Vinski
//



let config = {
    type: Phaser.CANVAS,
    width: 1920,
    height: 1080,
    scene: [Menu],

};

let game = new Phaser.Game(config);

game.settings = {
 
}

let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE;