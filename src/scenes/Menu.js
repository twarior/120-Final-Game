class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        //load audio here
        this.load.audio('sfx_select', './assets/sfx/menuSelect.mp3');
        this.load.image('menu', './assets/backgrounds/phaserMenu.png');
    }

    create() {
        //menu display
        let menuConfig = {
            fontFamily: 'Sunflower',
            fontSize: '10px',
            color: '#004FFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        game.sound.volume = .1;

        this.menuScale = 4;
        this.menu = this.add.image(game.config.width/2, 0, 'menu').setOrigin(0.5,0).setScale(4);
        if((this.menu.displayHeight < game.config.height) || (this.menu.displayWidth < game.config.width)){
            while((this.menu.displayHeight < game.config.height) || (this.menu.displayWidth < game.config.width)){
                this.menuScale += .01;
                this.menu.setScale(this.menuScale, this.menuScale);
            }
        }
        while((this.menu.displayHeight > game.config.height) || (this.menu.displayWidth > game.config.width)){
            this.menuScale -= .01;
            this.menu.setScale(this.menuScale, this.menuScale);
        }
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
            this.scene.start("storyScene");
        }
        else if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start("creditsScene");   
        }
    }
}