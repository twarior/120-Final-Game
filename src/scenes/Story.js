class Story extends Phaser.Scene {
    constructor() {
        super("storyScene");
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
            "You are an orphaned child who roams the ", 
            "streets, scavenging to survive. ",
            " ",
            "While rummaging through some trash, you ", 
            "stumble upon an unloaded gun with… a ",
            "peculiar aura. ",
            " ",
            "Upon picking it up, it shakes with an ",
            "unearthly energy and glows a ",
            "phosphorescent green. ",
            " ",
            "Before you have time to process what ",
            "is happening, a small ghost pops out. ",
            " ",
            "It looks ",
            "shaken, but when it realizes you can see ",
            "it, it introduces itself as Peter and ",
            "asks for your help in keeping their ",
            "world safe. ",
            " ",
            "Not knowing what else to do... ",
            "you agree. ", 
            " ",
            "Together, you travel between the physical ",
            "and supernatural world, vanquishing the  ",
            "ill-spirited specters. Peter teaches you ",
            "about ghostly bullets and phasing ",
            "between worlds. ", 
            " ",
            "There is, however, a small problem. The ", 
            "police don’t really appreciate a child ",
            "running around with a gun, so they are ",
            "going to try to stop you... "

        ];

        this.line = [];

        this.wordIndex = 0;
        this.lineIndex = 0;

        this.wordDelay = 65;
        this.lineDelay = 1000;
        // this.text = this.add.text(this.parchment.x + this.parchment.displayWidth/6, 64, '', 
        // { font: "Arial", fill: "#5c0000", boundsAlignH: "center", boundsAlignV: "middle" });
        this.text = this.add.bitmapText(game.config.width/2 - this.parchment.displayWidth/3,
            this.parchment.displayHeight/5, 'arcade', '', 16).setTint(0x5c0000, 0x5c0000, 
            0x5c0000, 0x5c0000).setOrigin(0, 0).setScale(1, 1);
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
            this.sound.play('sfx_select');
            this.scene.start("Level1Scene");
        }
        else if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            //this.scene.start("Credits.js");   
        }
        else if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
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