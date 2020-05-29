class Story extends Phaser.Scene {
    constructor() {
        super("storyScene");
    }

    preload(){
        this.load.image('parchment', './assets/backgrounds/Parchment.png');
    }

    create() {
        this.parchmentScale = 4;
        this.parchment = this.physics.add.sprite(0,0, 'parchment').setOrigin(0, 0).setScale(4, 4);
        this.parchment.x = (game.config.width/2) - (this.parchment.displayWidth/2);
        while(this.parchment.displayHeight > game.config.height){
            this.parchmentScale -= .1;
            this.parchment.setScale(this.parchmentScale, this.parchmentScale);
        }
        console.log(this.parchment.displayHeight + " " + game.config.height);
        this.content = [
            "You're a homeless orphan who scavenges the ",
            "streets to survive. ",
            "While rummaging though some trash, you encounter ",
            "an unloaded gun with... ",
            "a peculiar aura. ",
            "Upon picking it up, a ghost pops out of it. ",
            "When it realizes you can see it, it asks for ",
            "your help. ",
            "Together, you travel between the physical ",
            "and supernatural world, vanquishing the ", 
            "spirits that wish ill upon both using ",
            "ghostly bullets created by your new friend. ",
            "Unfortunately, the police do not appreciate ",
            "a child running around with a gun, so they try ",
            "to stop you... "
        ];

        this.line = [];

        this.wordIndex = 0;
        this.lineIndex = 0;

        this.wordDelay = 400;
        this.lineDelay = 1000;
        this.text = this.add.text(this.parchment.x + this.parchment.displayWidth/6, 64, '', 
        { font: "18px Arial", fill: "#5c0000", boundsAlignH: "center", boundsAlignV: "middle" });

        
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
        this.line = this.content[this.lineIndex].split(' ');

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
        this.text.text = this.text.text.concat(this.line[this.wordIndex] + " ");

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