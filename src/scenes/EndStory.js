class EndStory extends Phaser.Scene {
    constructor() {
        super("endStoryScene");
    }

    preload(){
        this.load.image('parchment', './assets/backgrounds/Parchment.png');
        this.load.bitmapFont('arcade', './assets/fonts/arcade.png', './assets/fonts/arcade.xml');
    }

    create() {
        this.parchmentScale = 4;
        this.parchment = this.physics.add.sprite(game.config.width /2,0, 'parchment').setOrigin(0.5, 0).setScale(4, 4);
        //this.parchment.x = (game.config.width/2);
        if(this.parchment.displayHeight> game.config.height){
            while(this.parchment.displayHeight > game.config.height){
                this.parchmentScale -= .1;
                this.parchment.setScale(this.parchmentScale, this.parchmentScale);
            }
        }
        else {
            while(this.parchment.displayHeight < game.config.height){
                this.parchmentScale += .1;
                this.parchment.setScale(this.parchmentScale, this.parchmentScale);
            }
        }
        console.log(this.parchment.displayHeight + " " + game.config.height);
        this.content = [
            "  You have done it! You have defeated all of",
            " the ghosts in your path! Peter congratulates ",
            "you on a job well done and tells you how ",
            "great you are. ",
            " ",
            "But before you can celebrate, they go on to ",
            "say that that was only the beginning of a ",
            "long journey. Not wanting to drag you along ",
            "if that is not what you want, they ask you ",
            "if you are up for what’s ahead.",
            " ",
            " You have got this."
        ];

        this.line = [];

        this.wordIndex = 0;
        this.lineIndex = 0;

        this.wordDelay = 65;
        this.lineDelay = 1000;
        // this.text = this.add.text(this.parchment.x + this.parchment.displayWidth/6, 64, '', 
        // { font: "Arial", fill: "#5c0000", boundsAlignH: "center", boundsAlignV: "middle" });
        this.text = this.add.bitmapText(game.config.width/2 - this.parchment.displayWidth/2.6,
            this.parchment.displayHeight/7, 'arcade', '', 16).setTint(0x5c0000, 0x5c0000, 
            0x5c0000, 0x5c0000).setOrigin(0, 0).setScale(1, 1.3);
        this.text.ySpacing = 10;
            
        console.log(this.text.fontSize +  ' ' + 4*this.parchment.displayWidth/(6*44));
        if(this.text.fontSize > 4*this.parchment.displayWidth/(6*44)){
            while(this.text.fontSize > 4*this.parchment.displayWidth/(6*44)){
                this.text.setFontSize(this.text.fontSize - 1);
            }
        }
        else {
            while(this.text.fontSize < 4*this.parchment.displayWidth/(6*44)){
                this.text.setFontSize(this.text.fontSize + 1);
            }
        }
        console.log(this.text.fontSize);
        
        this.nextLine();
        
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); 
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        //if the player presses the up arrow the game will start
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start("menuScene");
        }
    }

    nextLine() {

        if (this.lineIndex === this.content.length) {
            //  We're finished
            return;
        }

        //  Split the current line on spaces, so one word per array element
        this.line = this.content[this.lineIndex].split('');

        //  Reset the word index to zero (the first word in the line)
        this.wordIndex = 0;

        //  Call the 'nextWord' function once for each word in the line (line.length)
        this.timer = this.time.addEvent({
            delay: this.wordDelay, 
            callback: this.nextWord,
            repeat: this.line.length,
            callbackScope: this,
        });

        //  Advance to the next line
        this.lineIndex++;

    }

    nextWord() {

        //  Add the next word onto the text string, followed by a space
        if(this.line[this.wordIndex] == undefined){
            return;
        }
        this.text.text = this.text.text.concat(this.line[this.wordIndex] + "");

        //  Advance the word index to the next word in the line
        this.wordIndex++;

        //  Last word?
        if (this.wordIndex === this.line.length){
            //  Add a carriage return
            this.text.text = this.text.text.concat("\n");

            //  Get the next line after the lineDelay amount of ms has elapsed
            this.timer = this.time.addEvent({
                delay: this.lineDelay, 
                callback: this.nextLine(),
                callbackScope: this,
            });
        }
    }
}