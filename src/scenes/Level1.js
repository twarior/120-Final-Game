class Level1 extends Phaser.Scene {
    constructor(){
        super("Level1Scene");
    }
    preload(){
        //load assets here
        this.load.image('playerSprite', './assets/sprites/Main_Char_Bang_Bang.png');
        this.load.image('enemySprite', './assets/enemies/badSmiley.png');
        this.load.image('target', './assets/sprites/reticle.png');
        this.load.image('background', './assets/backgrounds/background.png');
        this.load.image('normalWall', './assets/sprites/normWall.png');
        this.load.image('distortedWall', './assets/sprites/distWall.png');
        this.load.image('bullet', './assets/sprites/bullet.png');
        this.load.image('health', './assets/sprites/healthSprite.png');
        this.load.image('closedDoor', './assets/sprites/closedDoor.png');
        this.load.image('button', './assets/sprites/button.png');
        this.load.audio('sfx_gunshot', './assets/sfx/gunshot03.mp3');
        this.load.audio('sfx_playerHit', './assets/sfx/playerHit03.mp3');
        this.load.audio('sfx_phase', './assets/sfx/transitionMid.mp3');
        this.load.audio('sfx_enemyHit', './assets/sfx/Damage.mp3');
        this.load.image('bothWorldsSprites', './assets/tilemaps/Both_Maps_spritesheet.png');
	    this.load.tilemapTiledJSON('bothWorldsMap', './assets/tilemaps/Both_Maps.json');
    }

//=====================================================================================================

    create(){
        //create the tilemaps and the layers as constant objects so we can access them
        const map = this.make.tilemap({ key: 'bothWorldsMap' });
		const tileset = map.addTilesetImage('Both_Maps_spritesheet', 'bothWorldsSprites');
		
		const normalBackground = map.createStaticLayer('Norm_Background', tileset);
		const normalGates = map.createStaticLayer('Norm_Gates', tileset);
		const normalGraves = map.createStaticLayer('Norm_Graves', tileset);
		const normalMausoleum = map.createStaticLayer('Norm_Mausoleum', tileset);
		const normalFountain = map.createStaticLayer('Norm_Fountain', tileset);
		const normalDucks = map.createStaticLayer('Norm_Ducks', tileset);
		const distortedBackground = map.createStaticLayer('Dist_Background', tileset);
		const distortedGates = map.createStaticLayer('Dist_Gates', tileset);
		const distortedGraves = map.createStaticLayer('Dist_Graves', tileset);
		const distortedWell = map.createStaticLayer('Dist_Well', tileset);
		const distortedFountain =  map.createStaticLayer('Dist_Fountain', tileset);
        const distortedHoles =  map.createStaticLayer('Dist_Holes', tileset);
        
        //create arrays to store the collidiable objects and the non
        this.normalObjects = [normalGates, normalGraves, normalMausoleum, normalFountain];
        this.normalScenery = [normalBackground, normalDucks];
        this.distortedObjects = [distortedGates, distortedGraves, distortedWell, distortedFountain, 
            distortedHoles];
        this.distortedScenery = [distortedBackground];

        //height and width of the world based on the tilemap
        this.width = map.width*16;
        this.height = map.height*16;
        console.log(map.width + " " + map.height);

        //create world bounds
        this.physics.world.setBounds(0, 0, this.width, this.height);

        //timer
        this.timer = this.time.addEvent({
            loop: true
        });

        //game over boolean
        this.gameOver = false;

        //add player, and reticle sprites
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'playerSprite');
        this.reticle = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'target');

        //set the collisions to true for all collidable objects then set the distorted world to
        //invisable and inactive 
        for(let i = 0; i < this.normalObjects.length; i++){
            this.normalObjects[i].setCollisionByProperty({ collides: true});
        }
        for(let i = 0; i < this.distortedObjects.length; i++){    
            this.distortedObjects[i].setCollisionByProperty({ collides: true});
            this.distortedObjects[i].setActive(false).setVisible(false);
        }
        for(let i = 0; i < this.distortedScenery.length; i++){
            this.distortedScenery[i].setActive(false).setVisible(false);
        }

        //create toggles for the physics colliders in both worlds 
        this.normalGatesToggle = this.physics.add.collider(this.player, normalGates);
        this.normalGravesToggle = this.physics.add.collider(this.player, normalGraves);
        this.normalMausoleumToggle = this.physics.add.collider(this.player, normalMausoleum);
        this.normalFountainToggle = this.physics.add.collider(this.player, normalFountain);
        this.distortedGatesToggle = this.physics.add.collider(this.player, distortedGates);
        this.distortedGravesToggles = this.physics.add.collider(this.player, distortedGraves);
        this.distortedHolesToggle = this.physics.add.collider(this.player, distortedHoles);
        this.distortedWellToggle = this.physics.add.collider(this.player, distortedWell);
        this.distortedFountainToggle = this.physics.add.collider(this.player, distortedFountain);
        //put those in arrays for safe keeping
        this.normalColliderToggles = [this.normalGatesToggle, this.normalGravesToggle, 
            this.normalMausoleumToggle, this.normalFountainToggle];
        this.distortedColliderToggles = [this.distortedGatesToggle, this.distortedGravesToggles, 
            this.distortedHolesToggle, this.distortedWellToggle, this.distortedFountainToggle];
        //turn off the colliders in the distorted world
        for(let i = 0; i < this.distortedColliderToggles.length; i ++){
            this.distortedColliderToggles[i].active = false;
        }

        //create a boolean for keeping track of which world the player is in
        this.inNormalWorld = true;

        //sound files as their own object in the hope that i can play them inside of a physics collider
        this.gunshotSFX = this.sound.add('sfx_gunshot');
        this.playerHitSFX = this.sound.add('sfx_playerHit');
        this.phaseSFX = this.sound.add('sfx_phase');
        this.enemyHitSFX = this.sound.add('sfx_enemyHit');
        game.sound.volume = .05;


        //set image/sprite properties
        this.player.setCollideWorldBounds(true).setDrag(500, 500).setScale(1, 1).setOrigin(.5, .5);
        this.player.x = 64;
        this.player.y = 64;
        this.reticle.setCollideWorldBounds(true).setScale(1, 1).setOrigin(.5, .5);
        this.player.health = 3;

        //add bulllet groups for both player and enemies
        this.playerBullets = this.physics.add.group({classType: Bullet, runChildUpdate: true});
        this.enemyBullets = this.physics.add.group({classType: Bullet, runChildUpdate: true});

        //enemies
        this.enemies = [this.physics.add.sprite(300, 216, 'enemySprite').setCollideWorldBounds(true),
            this.physics.add.sprite(920, 380, 'enemySprite').setCollideWorldBounds(true)
            ];
        for(let i = 0; i < this.enemies.length; i += 1){
            this.enemies[i].health = 3;
            this.enemies[i].lastFired = i*500;
            this.enemies[i].dead = false;
        }

        // //dist enemies
        this.distEnemies = [this.physics.add.sprite(300, 300, 'enemySprite').setCollideWorldBounds(true),
            this.physics.add.sprite(920, 380, 'enemySprite').setCollideWorldBounds(true)
            ];
        
        for(let i = 0; i  < this.distEnemies.length; i += 1) { 
            this.distEnemies[i].health = 3;
            this.distEnemies[i].dead = false;
            this.distEnemies[i].dropped = false;
            this.physics.add.collider(this.player, this.distEnemies[i], this.playerHitMeleeCallback, null, this);
        }
        //make the distorted enemies inactive and invisible at start
        for(let i = 0; i < this.distEnemies.length; i++){
            this.distEnemies[i].setActive(false);
            this.distEnemies[i].setVisible(false);
        }

        this.doors = [];
        this.buttons = this.physics.add.staticGroup();

        this.button1 = this.buttons.create(690, 690, 'button').setScale(2).setRotation(1.5708).refreshBody();
        this.button2 = this.buttons.create(960, 960, 'button').setScale(2).setRotation(1.5708).refreshBody();
        // this.button1.pressed = false;
        // this.button2.pressed = false;
        // this.opened = false;

        //make health drop group
        this.healthDrops = [];
        for(let i = 0; i < 25; i++){
            this.healthDrops[i] = this.physics.add.sprite(-1000, -1000, 'health');
            this.healthDrops[i].setVisible(false).setActive(false);
        }

        //set camera zoom
        //this.cameras.main.zoom = 4;

        //create object for input with wasd keys and menu buttons up and down arrow
        this.moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
        });
        this.arrowKeys = this.input.keyboard.addKeys({
            'upArrow' : Phaser.Input.Keyboard.KeyCodes.UP,
            'downArrow' : Phaser.Input.Keyboard.KeyCodes.DOWN,
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

        this.input.on('pointerdown', function (pointer, time, lastFired) {
            if (this.player.active === false)
                return;
    
            // Get bullet from bullets group
            var bullet = this.playerBullets.get().setActive(true).setVisible(true);
    
            if (bullet)
            {  
                for(let i = 0; i < this.enemies.length; i ++){
                    this.physics.add.collider(this.enemies[i], bullet, this.enemyHitCallback, null, this);
                } 
                for(let i = 0; i < this.distEnemies.length; i ++){
                    this.physics.add.collider(this.distEnemies[i], bullet, this.enemyHitCallback, null, this);
                } 
                //stop the bullets on the present walls 
                for(let i = 0; i < this.normalObjects.length; i++){
                    if(this.inNormalWorld)
                        this.physics.add.collider(bullet, this.normalObjects[i], this.wallHitCallback, null, this);
                }
                for(let i = 0; i < this.distortedObjects.length; i++){
                    if(!this.inNormalWorld)
                        this.physics.add.collider(bullet, this.distortedObjects[i], this.wallHitCallback, null, this);
                }
                //need to add wall colliders here
                this.physics.add.collider(bullet, this.button1, this.buttonHitCallback, null, this);
                this.physics.add.collider(bullet, this.button2, this.buttonHitCallback, null, this);
                bullet.fire(this.player, this.reticle);
                this.gunshotSFX.play();
            }
        }, this);
    }

//=======================================================================================================

    update(time, delta){
        //player movement
        if (!this.gameOver && this.moveKeys.up.isDown){
            this.player.setAccelerationY(-800);
        }
        if (!this.gameOver && this.moveKeys.down.isDown){
            this.player.setAccelerationY(800);
        }
        if (!this.gameOver && this.moveKeys.left.isDown){
            this.player.setAccelerationX(-800);
        }
        if (!this.gameOver && this.moveKeys.right.isDown){
            this.player.setAccelerationX(800);
        }
        if (!this.gameOver && this.moveKeys.up.isUp && this.moveKeys.down.isUp){
            this.player.setAccelerationY(0);
        }
        if (!this.gameOver && this.moveKeys.left.isUp && this.moveKeys.right.isUp){
            this.player.setAccelerationX(0);
        }
        
        //camera tracks player 
        // var avgX = ((this.player.x + this.reticle.x)/2)-400;
        // var avgY = ((this.player.y + this.reticle.y)/2)-300;
        // this.cameras.main.scrollX = this.player.x - game.config.width/2;
        // this.cameras.main.scrollY = this.player.y - game.config.height/2;
        this.cameras.main.startFollow(this.player);

        //makes reticle move with player
        if(!this.gameOver){
            this.reticle.body.velocity.x = this.player.body.velocity.x;
            this.reticle.body.velocity.y = this.player.body.velocity.y;
        }

        // Constrain velocity of player
        this.constrainVelocity(this.player, 75);

        // Constrain position of reticle
        this.constrainReticle(this.reticle, this.player, 128);

        //points the player at the reticle
        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, 
            this.reticle.x, this.reticle.y)

        //phase the player if they press space
        if (Phaser.Input.Keyboard.JustDown(this.moveKeys.space) && !this.gameOver) {
            this.phase();
        }
        
        //make normal enemies rotate and fire
        for(let i = 0; i < this.enemies.length; i++){
            let enemy = this.enemies[i]; 
            enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            this.enemyFire(enemy, this.player, this);
        }
        //make distorted enemies run toward player
        for(let i = 0; i < this.distEnemies.length; i++){
            this.enemyMove(this.distEnemies[i], this.player, 16);
            if(this.distEnemies[i].dead == true && this.distEnemies[i].dropped == false){
                this.spawnHealth(this.distEnemies[i]);
            }
        }
        //puzzles m8
        
        if(this.button2.pressed == true && this.button1.pressed == true && this.opened == false){
            //console.log('both buttons pressed');
            this.openDoors();
            this.opened = true;
        }
        //console.log(this.player.x +" "+ this.player.y);
        this.playerWin();
        this.playerLose();
        this.restartGame();
    }

//=======================================================================================================

    //makes sure the player can't zoom too fast
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

    //constrain the reticle to a circel around the player so it cant go off screen or somewhere unexpected
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

    //main mechanic of the game. "phase" the player by setting the objects around them to inactive and 
    //invisible. might need to change when tilemaps are introduced
    phase() {
        this.sound.play('sfx_phase');
        //phase the walls back and forth
        if(this.inNormalWorld == true){
            this.inNormalWorld = false;
            for(let i = 0; i < this.normalColliderToggles.length; i++){
                this.normalColliderToggles[i].active = false;
            }
            for(let i = 0; i < this.normalObjects.length; i++){
                this.normalObjects[i].active = false
                this.normalObjects[i].setVisible(false);
            }
            for(let i = 0; i < this.normalScenery.length; i++){
                this.normalScenery[i].active = false
                this.normalScenery[i].setVisible(false);
            }
            for(let i = 0; i < this.distortedColliderToggles.length; i++){
                this.distortedColliderToggles[i].active = true;
            }
            for(let i = 0; i < this.distortedObjects.length; i++){    
                this.distortedObjects[i].active = true
                this.distortedObjects[i].setVisible(true);
            }
            for(let i = 0; i < this.distortedScenery.length; i++){    
                this.distortedScenery[i].active = true
                this.distortedScenery[i].setVisible(true);
            }
        }
        else {
            this.inNormalWorld = true;
            for(let i = 0; i < this.normalColliderToggles.length; i++){
                this.normalColliderToggles[i].active = true;
            }
            for(let i = 0; i < this.normalObjects.length; i++){
                this.normalObjects[i].active = true
                this.normalObjects[i].setVisible(true);
            }
            for(let i = 0; i < this.normalScenery.length; i++){
                this.normalScenery[i].active = true
                this.normalScenery[i].setVisible(true);
            }
            for(let i = 0; i < this.distortedColliderToggles.length; i++){
                this.distortedColliderToggles[i].active = false;
            }
            for(let i = 0; i < this.distortedObjects.length; i++){    
                this.distortedObjects[i].active = false
                
                this.distortedObjects[i].setVisible(false);
                console.log(this.distortedObjects[i]);
            }
            for(let i = 0; i < this.distortedScenery.length; i++){    
                this.distortedScenery[i].active = false
                this.distortedScenery[i].setVisible(false);
            }
        }
        //only respawn the enemies if they are not dead
        for(let i = 0; i < this.distEnemies.length; i++){
            if(this.distEnemies[i].dead == false) {
                if(this.distEnemies[i].active == true){
                    this.distEnemies[i].setActive(false);
                    this.distEnemies[i].setVisible(false);
                }
                else{
                    this.distEnemies[i].setActive(true);
                    this.distEnemies[i].setVisible(true);
                }
            }
        }
        for(let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].dead == false) {
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
        //make sure the bullets dont collide with the non-active walls
        //could place them in the first section when we switch the walls but that seems too cluttered
        // if(this.normalWallToggle.active == true){
        //         let collider = this.physics.world.colliders.getActive().find(function(i){
        //             return i.name == 'distortedWallCollider'
        //         });
        //         if(collider){
        //             //console.log('dist wall collider destroyed');
        //             collider.destroy();
        //         }
        // }
        // else if (this.distortedWallToggle.active == true){
        //     let collider = this.physics.world.colliders.getActive().find(function(i){
        //         return i.name == 'normalWallCollider'
        //     });
        //     if(collider){
        //         //console.log('normal wall collider destroyed');
        //         collider.destroy();
        //     }
        // }
    }

    spawnHealth(enemyHit){
        let randomNum = Math.floor(Math.random()*100);
        if(randomNum >= 50){
            for(let i = 0; i < this.healthDrops.length; i++){
                if(this.healthDrops[i].active == false){
                    let health = this.healthDrops[i];
                    health.x = enemyHit.x;
                    health.y = enemyHit.y;
                    health.setActive(true).setVisible(true);
                    this.physics.add.collider(health, this.player, this.healthHitCallback, null, this);
                    enemyHit.dropped = true;
                    break;
                }
            }
        }
    }

    //physics callback for when a player created bullet hits an enemy
    enemyHitCallback(enemyHit, bulletHit, healthDrops) {
        //reduce health of enemy
        if (bulletHit.active === true && enemyHit.active === true) {
            enemyHit.health -= 1;
            //console.log('enemy at: ' + enemyHit.x + ', ' + enemyHit.y + ' has ' + enemyHit.health + 
                //' remaining');
            
            //kill enemy if health <= 0
            if(enemyHit.health <= 0) {
                enemyHit.setVelocity(0,0);
                enemyHit.setActive(false).setVisible(false).destroy();
                enemyHit.dead = true;
            }
            this.enemyHitSFX.play();
            //destroy bullet
            bulletHit.setActive(false).setVisible(false).destroy();
        }
    }
    
    //physics callback for when an enemy bullet hits the player
    playerHitCallback(playerHit, bulletHit) {
        // Reduce health of player
        if (bulletHit.active === true && playerHit.active === true) {
            playerHit.health = playerHit.health - 1;
            console.log("Player hp: ", playerHit.health);
            bulletHit.setActive(false).setVisible(false).destroy();
            if (playerHit.health <=0 ){
                // this.add.text(playerHit.x, playerHit.y, 'GAME OVER', menuConfig).setOrigin(.5);
                console.log('GAME OVER');
            }
            this.playerHitSFX.play();
        }
    }

    //physics callback for when an enemy punches the player
    playerHitMeleeCallback(playerHit, enemyHit) {
        if(playerHit.active === true && enemyHit.active === true){
            playerHit.health -= 1;
            console.log("Player hp: ", playerHit.health);
            if (playerHit.health <=0 ){
                // this.add.text(playerHit.x, playerHit.y, 'GAME OVER', menuConfig).setOrigin(.5);
                console.log('GAME OVER');
            }
            this.playerHitSFX.play();
        }
    }

    //phyics callback for when any type of bullet hits a wall
    //this should be basically the same as an enemy bullet cosd llision, but the enemy doesnt disapear. 
    wallHitCallback(bulletHit, wallHit) {
        //console.log(bulletHit + "should be destored");
        //console.log(wallHit);
        //console.log(wallHit.layer.visible);
        if(wallHit.visible === true && bulletHit.active === true )
            bulletHit.setActive(false).setVisible(false).destroy();
        
    }

    //set button to pressed and destroy the bullet
    buttonHitCallback(bulletHit, buttonHit){
        if(buttonHit.active === true && bulletHit.active === true){
            bulletHit.setActive(false).setVisible(false).destroy();
        }
        buttonHit.pressed = true;
    }

    //phyics callback for health pickup object
    healthHitCallback(healthHit, playerHit){
        if(healthHit.active === true && playerHit.active === true){
            playerHit.health +=1;
            console.log("Player hp: ", playerHit.health);
        }
        healthHit.setActive(false).setVisible(false);
    }

    //makes the enemy fire toward the player with a cooldown of about 3 seconds
    enemyFire(enemy, player, gameObject) {
        if (enemy.active === false){
            return;
        }//                                 chnage this number here for a different cooldown
        if ((this.timer.getElapsed() - enemy.lastFired + 50) > 3000){
            enemy.lastFired = this.timer.getElapsed();
            // Get bullet from bullets group
            var bullet = this.enemyBullets.get().setActive(true).setVisible(true);

            if (bullet){
                bullet.fire(enemy, player);
                
                // Add collider between bullet and player
                gameObject.physics.add.collider(player, bullet, this.playerHitCallback, null, this);
                //collider between walls depending on whats active
                if(this.inNormalWorld == true) {
                    for(let i = 0; i < this.normalObjects.length; i++){
                        gameObject.physics.add.collider(bullet, this.normalObjects[i], this.wallHitCallback);
                    }
                }
                else {
                    for(let i = 0; i < this.normalObjects.length; i++){
                        gameObject.physics.add.collider(bullet, this.distortedObjects[i], this.wallHitCallback);
                    }
                }
            }
        }
    }

    //move the enemy toward the player, 
    enemyMove(enemy, player, maxVelocity) {
        if(enemy.active === false){
            return;
        }
        let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
        let velocityX = Math.cos(angle)*maxVelocity;
        let velocityY = Math.sin(angle)*maxVelocity;
        enemy.setVelocity(velocityX, velocityY);
    }

    openDoors(){
        for(let i = 0; i < 100; i++) {
            for(let i = 0; i < this.doors.length; i ++){
                this.doors[i].x -= 10;
            }
        }
        //console.log('doors open wide');
    }

    playerWin() {
        let win = false;
        for(let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].dead == false){
                win = false;
                break;
            }
            win = true;
        }
        for(let i = 0; i < this.distEnemies.length; i++){
            if(this.distEnemies[i].dead == false){
                win = false;
                break;
            }
        }
        if(win == true){
            this.player.active = false;
            this.player.destroy();
            this.add.text(this.player.x, this.player.y, "YOU WIN");
            this.gameOver = true;
        }    
    }

    playerLose() {
        if(this.player.health <= 0){
            this.player.active = false;
            this.player.destroy();
            this.add.text(this.player.x, this.player.y, "YOU LOSE");
            this.gameOver = true;
        }
    }

    restartGame() {
        if(this.gameOver == true){
            this.add.text(this.player.x - 96, this.player.y + 32, '⇡ to Restart or ⇣ for Menu'); 
            if (this.arrowKeys.upArrow.isDown){
                game.settings.gameScore = 0;
                this.scene.restart(game.settings.gameScore);
            }
            else if (this.arrowKeys.downArrow.isDown){
                this.scene.start("menuScene");
            }
        }
    }

}