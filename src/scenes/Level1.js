class Level1 extends Phaser.Scene {
    constructor(){
        super("Level1");
    }
    preload(){
        //load assets here
        this.load.image('playerSprite', './assets/sprites/smileyGun.png');
        this.load.image('enemySprite', './assets/enemies/badSmiley.png');
        this.load.image('target', './assets/sprites/reticle.png');
        this.load.image('background', './assets/backgrounds/background.png');
        this.load.image('normalWall', './assets/sprites/normWall.png');
        this.load.image('distortedWall', './assets/sprites/distWall.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');
    }

//=====================================================================================================

    create(){
        //create world bounds
        this.physics.world.setBounds(0, 0, 1920, 1080);

        //timer
        this.timer = this.time.addEvent({
            loop: true
        });

        //add background, player, and reticle sprites
        var background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'playerSprite');
        this.reticle = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'target');

        //set image/sprite properties
        this.player.setCollideWorldBounds(true).setDrag(500, 500).setScale(1, 1).setOrigin(.5, .5);
        this.reticle.setCollideWorldBounds(true).setScale(1, 1).setOrigin(.5, .5);
        this.player.health = 10;

        //add bulllet groups for both player and enemies
        this.playerBullets = this.physics.add.group({classType: Bullet, runChildUpdate: true});
        this.enemyBullets = this.physics.add.group({classType: Bullet, runChildUpdate: true});

        //enemies
        this.enemies = [];
        for(let i = 0; i < 10; i += 1){
            this.enemies[i] = this.physics.add.sprite(100, (i+1)*(100), 'enemySprite').setCollideWorldBounds(true);
            this.enemies[i].health = 3;
            this.enemies[i].lastFired = i*500;
        }

        //dist enemies
        this.distEnemies = [];
        for(let i = 0; i  < 10; i += 1) {
            this.distEnemies[i] = this.physics.add.sprite(900, (i+1)*(100), 'enemySprite').setCollideWorldBounds(true);
            this.distEnemies[i].health = 3;
        }
        for(let i = 0; i < this.distEnemies.length; i++){
            this.distEnemies[i].setActive(false);
            this.distEnemies[i].setVisible(false);
        }
        


        //add wall groups
        this.normWalls = this.physics.add.staticGroup();
        this.distWalls = this.physics.add.staticGroup();

        //create the walls
        for(let i = 69; i < game.config.width; i+=250){
            //create walls at i, i with a doubled scaled
            //we need to refresh the body so the physics body is the same as the image, 
            //and not the origional size
            this.normWalls.create(i, i, 'normalWall').setScale(2).refreshBody();
            this.distWalls.create(i*2, i*2, 'distortedWall').setScale(2).refreshBody();
        }
        
        //add collision with walls
        this.normalWallToggle = this.physics.add.collider(this.player, this.normWalls);
        this.distortedWallToggle = this.physics.add.collider(this.player, this.distWalls);
        //hopefully this will make the distorted wall invisable and no have collision
        this.distWalls.setAlpha(0);
        this.distortedWallToggle.active = false;

        //set camera zoom
        this.cameras.main.zoom = 2;

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
            } 
        }, this);


        //function needed to fire bullets, cannot do in update for some reason
        this.input.on('pointerdown', function (pointer, time, lastFired) {
            if (this.player.active === false)
                return;
    
            // Get bullet from bullets group
            var bullet = this.playerBullets.get().setActive(true).setVisible(true);
    
            if (bullet)
            {
                bullet.fire(this.player, this.reticle);
                for(let i = 0; i < this.enemies.length; i ++){
                    this.physics.add.collider(this.enemies[i], bullet, this.enemyHitCallback);
                } 
                if(this.normalWallToggle.active == true) {
                    this.physics.add.collider(bullet, this.normWalls, this.wallHitCallback);
                }
                else {
                    this.physics.add.collider(bullet, this.distWalls, this.wallHitCallback);
                }
            }
        }, this);
    }

//=======================================================================================================

    update(time, delta){
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
        if (this.moveKeys.up.isUp && this.moveKeys.down.isUp){
            this.player.setAccelerationY(0);
        }
        if (this.moveKeys.left.isUp && this.moveKeys.right.isUp){
            this.player.setAccelerationX(0);
        }
        
        //camera tracks player 
        // var avgX = ((this.player.x + this.reticle.x)/2)-400;
        // var avgY = ((this.player.y + this.reticle.y)/2)-300;
        // this.cameras.main.scrollX = this.player.x - game.config.width/2;
        // this.cameras.main.scrollY = this.player.y - game.config.height/2;
        this.cameras.main.startFollow(this.player);

        //makes reticle move with player
        this.reticle.body.velocity.x = this.player.body.velocity.x;
        this.reticle.body.velocity.y = this.player.body.velocity.y;

        // Constrain velocity of player
        this.constrainVelocity(this.player, 250);

        // Constrain position of reticle
        this.constrainReticle(this.reticle, this.player, 200);

        //points the player at the reticle
        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, 
            this.reticle.x, this.reticle.y)

        //phase the player if they press space
        if (Phaser.Input.Keyboard.JustDown(this.moveKeys.space)) {
            this.phase();
        }
        
        //make enemies rotate
        if(this.enemies){
            for(let i = 0; i < this.enemies.length; i++){
                if(this.enemies[i].active == true) {
                    let enemy = this.enemies[i]; 
                    enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                    this.enemyFire(enemy, this.player, this);
                }
            }
        }
    }

//=======================================================================================================

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

    phase() {
        if(this.normalWallToggle.active == true){
            this.normalWallToggle.active = false;
            this.normWalls.setAlpha(0);
            this.distortedWallToggle.active = true;
            this.distWalls.setAlpha(1);
        }
        else {
            this.normalWallToggle.active = true;
            this.normWalls.setAlpha(1);
            this.distortedWallToggle.active = false;
            this.distWalls.setAlpha(0);
        }
        for(let i = 0; i < this.distEnemies.length; i++){
            if(this.distEnemies[i].active == true){
                this.distEnemies[i].setActive(false);
                this.distEnemies[i].setVisible(false);
            }
        }
        for(let i = 0; i < this.distEnemies.length; i++){
            if(this.distEnemies[i].active == true){
                this.distEnemies[i].setActive(false);
                this.distEnemies[i].setVisible(false);
            }
            else{
                this.distEnemies[i].setActive(true);
                this.distEnemies[i].setVisible(true);
            }
        }
        for(let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].active == true){
                this.enemies[i].setActive(false);
                this.enemies[i].setVisible(false);
            }
            else{
                this.enemies[i].setActive(true);
                this.enemies[i].setVisible(true);
            }
        }
    }

    enemyHitCallback(enemyHit, bulletHit) {
        //reduce health of enemy
        if (bulletHit.active === true && enemyHit.active === true) {
            enemyHit.health -= 1;
            //console.log('enemy at: ' + enemyHit.x + ', ' + enemyHit.y + ' has ' + enemyHit.health + 
                //' remaining');
            
            //kill enemy if health <= 0
            if(enemyHit.health <= 0) {
                enemyHit.y -= 4000;
                enemyHit.destroy();
            }

            //destroy bullet
            bulletHit.setActive(false).setVisible(false);
        }
    }
    
    playerHitCallback(playerHit, bulletHit) {
        // Reduce health of player
        if (bulletHit.active === true && playerHit.active === true) {
            playerHit.health = playerHit.health - 1;
            console.log("Player hp: ", playerHit.health);
        }
        if (playerHit.health <=0 ){
            // this.add.text(playerHit.x, playerHit.y, 'GAME OVER', menuConfig).setOrigin(.5);
            console.log('GAME OVER');
        }
        bulletHit.setActive(false).setVisible(false);
    }

    wallHitCallback(bulletHit, wallHit) {
        if(wallHit.active === true && bulletHit.active === true){
            bulletHit.setActive(false).setVisible(false);
        }
    }

    enemyFire(enemy, player, gameObject) {
        if (enemy.active === false){
            return;
        }
        if ((this.timer.getElapsed() - enemy.lastFired + 50) > 3000){
            enemy.lastFired = this.timer.getElapsed();
            // Get bullet from bullets group
            var bullet = this.enemyBullets.get().setActive(true).setVisible(true);

            if (bullet){
                bullet.fire(enemy, player);
                
                // Add collider between bullet and player
                gameObject.physics.add.collider(player, bullet, this.playerHitCallback);
                //collider between walls depending on whats active
                if(this.normalWallToggle.active == true) {
                    gameObject.physics.add.collider(bullet, this.normWalls, this.wallHitCallback);
                }
                else {
                    gameObject.physics.add.collider(bullet, this.distWalls, this.wallHitCallback);
                }
            }
        }
    }
}