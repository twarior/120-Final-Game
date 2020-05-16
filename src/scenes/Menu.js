class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        //load audio here
        this.load.audio('sfx_select', './assets/sfx/menuSelect.mp3');
        
    }

    create() {
        //menu display
        let menuConfig = {
            fontFamily: 'Sunflower',
            fontSize: '28px',
            color: '#004FFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2 ;
        let textSpacer = 64;
        //this.add.text(centerX, centerY - textSpacer, 'FIRE TIRES', menuConfig).setOrigin(.5);
        this.add.text(centerX, centerY - textSpacer, 'Use  W, A, S, and D to move', menuConfig).setOrigin(.5);
        this.add.text(centerX, centerY, 'Press SPACE to Phase', menuConfig)
            .setOrigin(.5);
        this.add.text(centerX, centerY + textSpacer, 'Click any Mouse Button to Fire', menuConfig)
            .setOrigin(.5);
        this.add.text(centerX, centerY + 2*textSpacer, 'Press SPACE to Start', menuConfig)
            .setOrigin(.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); 
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    update() {
        //if the player presses the up arrow the game will start
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('sfx_select');
            this.scene.start("Level1Scene");
        }
        else if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            //this.scene.start("Credits.js");   
        }
    }
}