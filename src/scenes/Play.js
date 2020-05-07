class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }
    preload(){
        //load assets here
        this.load.spritesheet('playerSprite', './assets/sprites/smileyGun.png', 
            {frameWidth: 44, frameHeight:38});
        this.load.image('target', './assets/sprites/reticle.png');
        this.load.image('background', './assets/backgrounds/background.png');
    }

    create(){
        //create world bounds
        this.physics.world.setBounds(0, 0, 1920, 1080);

        //add background, player, and reticle sprites
        var background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'playerSprite');
        this.reticle = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'target');

        //set image/sprite properties
        this.player.setCollideWorldBounds(true).setDrag(500, 500).setScale(1, 1).setOrigin(0, 0);
        this.reticle.setCollideWorldBounds(true).setScale(1, 1).setOrigin(0, 0);

        //set camera zoom
        this.cameras.main.zoom = 1;

        //create object for input with wasd keys
        this.moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
        });
        
        //locks pointer on mousedown
        game.canvas.addEventListener('mousedown', function () {
            game.input.mouse.requestPointerLock();
        });

        // Exit pointer lock when Q or escape (by default) is pressed.
        this.input.keyboard.on('keydown_Q', function (event) {
            if (game.input.mouse.locked){
                 game.input.mouse.releasePointerLock();
            }     
        }, 0, this);


        // Move reticle upon locked pointer move
        this.input.on('pointermove', function (pointer) {
            if (this.input.mouse.locked) {
                // Move reticle with mouse
                this.reticle.x += pointer.movementX;
                this.reticle.y += pointer.movementY;

                // Only works when camera follows player
                var distX = this.reticle.x - this.player.x;
                var distY = this.reticle.y - this.player.y;

                // Ensures reticle cannot be moved offscreen
                // if (distX > game.config.width)
                //     this.reticle.x = this.player.x+800;
                // else if (distX < -800)
                //     this.reticle.x = this.player.x-800;

                // if (distY > 600)
                //     this.reticle.y = this.player.y+600;
                // else if (distY < -600)
                //     this.reticle.y = this.player.y-600;
            } 
        }, this);
    }

    update(){
        //player movement
        if (this.moveKeys.up.isDown){
            this.player.setAccelerationY(-800);
        }
        if (this.moveKeys.down.isDown){
            this.player.setAccelerationY(800);
        }
        if (this.moveKeys.left.isDown){
            this.player.setAccelerationX(-800);
        }
        if (this.moveKeys.right.isDown){
            this.player.setAccelerationX(800);
        }
        if (this.moveKeys.up.isUp){
            this.player.setAccelerationY(0);
        }
        if (this.moveKeys.down.isUp){
            this.player.setAccelerationY(0);
        }
        if (this.moveKeys.left.isUp){
            this.player.setAccelerationX(0);
        }
        if (this.moveKeys.right.isUp){
            this.player.setAccelerationX(0);
        }
        
        //camera tracks player 
        var avgX = ((this.player.x + this.reticle.x)/2)-400;
        var avgY = ((this.player.y + this.reticle.y)/2)-300;
        this.cameras.main.scrollX = avgX;
        this.cameras.main.scrollY = avgY;

        //makes reticle move with player
        this.reticle.body.velocity.x = this.player.body.velocity.x;
        this.reticle.body.velocity.y = this.player.body.velocity.y;

        // Constrain velocity of player
        this.constrainVelocity(this.player, 500);

        // Constrain position of reticle
        this.constrainReticle(this.reticle, this.player, 200);
        
    }

    constrainVelocity(sprite, maxVelocity)
    {
        if (!sprite || !sprite.body)
          return;
    
        var angle, currVelocitySqr, vx, vy;
        var vx = sprite.body.velocity.x;
        var vy = sprite.body.velocity.y;
        var currVelocitySqr = vx * vx + vy * vy;
    
        if (currVelocitySqr > maxVelocity * maxVelocity)
        {
            angle = Math.atan2(vy, vx);
            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;
            sprite.body.velocity.x = vx;
            sprite.body.velocity.y = vy;
        }
    }

    constrainReticle(reticle, player, radius) {
        var distX = reticle.x - player.x; // X distance between player & reticle
        var distY = reticle.y - player.y; // Y distance between player & reticle

        // Ensures reticle cannot be moved offscreen
        if (distX > 800)
            reticle.x = player.x+800;
        else if (distX < -800)
            reticle.x = player.x-800;

        if (distY > 600)
            reticle.y = player.y+600;
        else if (distY < -600)
            reticle.y = player.y-600;

        // Ensures reticle cannot be moved further than dist(radius) from player
        var distBetween = Phaser.Math.Distance.Between(player.x, player.y, reticle.x, reticle.y);
        if (distBetween > radius)
        {
            // Place reticle on perimeter of circle on line intersecting player & reticle
            var scale = distBetween/radius;

            reticle.x = player.x + (reticle.x-player.x)/scale;
            reticle.y = player.y + (reticle.y-player.y)/scale;
        }
    }
}