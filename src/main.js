//Tennessee Phillips Ward, Katarina Kelso, Kalvin Vinski
//



let config = {
    type: Phaser.CANVAS,
    width: 540,
    height: 960,
    scene: [Menu, Play, Credits],

};

let game = new Phaser.Game(config);

game.settings = {
 
}

let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE;