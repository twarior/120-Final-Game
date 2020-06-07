class Level1 extends Phaser.Scene {
    constructor(){
        super("Level1Scene");
    }
    preload(){
        //load assets here
        //sprites
        this.load.image('playerSprite', './assets/sprites/Main_Char_Bang_Bang.png');
        this.load.image('portal', './assets/sprites/smallPortal.png');
        this.load.image('ghost1', './assets/enemies/Ghost1.png');
        this.load.image('ghost2', './assets/enemies/Ghost2.png');
        this.load.image('ghost3', './assets/enemies/Ghost3.png');
        this.load.image('ghost4', './assets/enemies/Ghost4.png');
        this.load.image('ghost5', './assets/enemies/Ghost5.png');
        this.load.image('ghost6', './assets/enemies/Ghost6.png');
        this.load.image('ghost7', './assets/enemies/Ghost7.png');
        this.load.image('ghost8', './assets/enemies/Ghost8.png');
        this.load.image('target', './assets/sprites/reticle.png');
        this.load.image('playerBullet', './assets/sprites/newBullet.png');
        this.load.image('bullet', './assets/sprites/copBullet.png');
        this.load.image('health', './assets/sprites/healthSprite.png');

        //texture atlases
        this.load.atlas('mainCharAtlas', './assets/textureAtlases/mainCharTextureAtlas.png',
            './assets/textureAtlases/mainCharTextureAtlas.json');
        this.load.atlas('cop1Atlas', './assets/textureAtlases/cop1TextureAtlas.png',
            './assets/textureAtlases/cop1TextureAtlas.json');
        this.load.atlas('cop2Atlas', './assets/textureAtlases/cop2TextureAtlas.png',
            './assets/textureAtlases/cop2TextureAtlas.json');
        this.load.atlas('cop3Atlas', './assets/textureAtlases/cop3TextureAtlas.png',
            './assets/textureAtlases/cop3TextureAtlas.json');

        //animation spritesheets
        this.load.spritesheet('cop1Death', './assets/animations/cop1Fall.png', 
            {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 5});
        this.load.spritesheet('cop2Death', './assets/animations/cop2Fall.png', 
            {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 5});
        this.load.spritesheet('cop3Death', './assets/animations/cop3Fall.png', 
            {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 5});

        //tilemap
        this.load.image('mapAssetsTilemap', './assets/tilemaps/mapAssetsTilemapExtruded.png');
        this.load.tilemapTiledJSON('bothWorldsMap', './assets/tilemaps/bothMapsWithObjects.json');
        
        //music
        this.load.audio('normSoundtrack', './assets/sfx/LightWorld.mp3');
        this.load.audio('distSoundtrack', './assets/sfx/Darkworld.mp3');

        //sfx
        this.load.audio('sfx_gunshot', './assets/sfx/gunshot03.mp3');
        this.load.audio('sfx_playerHit', './assets/sfx/playerHit03.mp3');
        this.load.audio('sfx_phase', './assets/sfx/transitionMid.mp3');
        this.load.audio('sfx_enemyHit', './assets/sfx/Damage.mp3');
        this.load.audio('sfx_wail', './assets/sfx/damnedWail.mp3');
        this.load.audio('sfx_openGate', './assets/sfx/gateOpen.mp3');
        this.load.audio('sfx_button', './assets/sfx/CoinGet.mp3');
        this.load.audio('sfx_ghostSigh', './assets/sfx/ghostExhale.mp3');
        this.load.audio('sfx_tazer', './assets/sfx/NewTazer.mp3');
        this.load.audio('sfx_police1', './assets/sfx/Police1.mp3');
        this.load.audio('sfx_police2', './assets/sfx/Police2.mp3');
        this.load.audio('sfx_police3', './assets/sfx/Police3.mp3');
        this.load.audio('sfx_police4', './assets/sfx/Police4.mp3');
        this.load.audio('sfx_police5', './assets/sfx/Police5.mp3');
        this.load.audio('sfx_button1', './assets/sfx/buttonSelect1.mp3');
        this.load.audio('sfx_button2', './assets/sfx/buttonSelect2.mp3');
    }

//=====================================================================================================

    create(){
        //create the tilemaps and the layers as constant objects so we can access them
        const map = this.make.tilemap({ key: 'bothWorldsMap' });
		const tileset = map.addTilesetImage('mapAssetsTilemap', 'mapAssetsTilemap', 16, 16, 1, 2);
		
		const normalBackground = map.createStaticLayer('Norm_Background', tileset);
		const normalGates = map.createStaticLayer('Norm_Gates', tileset);
		const normalGraves = map.createStaticLayer('Norm_Graves', tileset);
		const normalMausoleum = map.createStaticLayer('Norm_Mausoleum', tileset);
		const normalFountain = map.createStaticLayer('Norm_Fountain', tileset);
        const normalDucks = map.createStaticLayer('Norm_Ducks', tileset);
        const normalFlowers = map.createStaticLayer('Flowers', tileset);
        var door1 = map.createDynamicLayer('Door1', tileset);
        
		const distortedBackground = map.createStaticLayer('Dist_Background', tileset);
		const distortedGates = map.createStaticLayer('Dist_Gates', tileset);
		const distortedGraves = map.createStaticLayer('Dist_Graves', tileset);
		const distortedWell = map.createStaticLayer('Dist_Well', tileset);
		const distortedFountain =  map.createStaticLayer('Dist_Fountain', tileset);
        const distortedHoles =  map.createStaticLayer('Dist_Holes', tileset);
        const skeletonStatue = map.createStaticLayer('Skeleton_Statue', tileset);
        const groundGhosts = map.createStaticLayer('Ground_Ghost', tileset);
        const reaper = map.createStaticLayer('Reaper', tileset);
        const button1Door1 = map.createDynamicLayer('Button1_Door1', tileset);
        const button2Door1 = map.createDynamicLayer('Button2_Door1', tileset);
        
        
        this.skelly = skeletonStatue;

        this.door1Update = door1;
        this.b1 = button1Door1;
        this.b2 = button2Door1; 

        //create arrays to store the collidiable objects and the non
        this.normalObjects = [normalGates, normalGraves, normalMausoleum, normalFountain, door1];
        this.normalScenery = [normalBackground, normalDucks, normalFlowers];
        this.distortedObjects = [distortedGates, distortedGraves, distortedWell, distortedFountain, 
            distortedHoles, groundGhosts, reaper];
        this.distortedScenery = [distortedBackground];

        //height and width of the world based on the tilemap
        this.width = map.width*16;
        this.height = map.height*16;

        //create world bounds
        this.physics.world.setBounds(0, 0, this.width, this.height);

        //timer
        this.timer = this.time.addEvent({
            loop: true
        });

        //game over boolean
        this.gameOver = false;

        //add player, and reticle sprites
        const p1Spawn = map.findObject("P1 Spawn", obj => obj.name === "P1 Spawn");
        this.player = this.physics.add.sprite(p1Spawn.x, p1Spawn.y, 'mainCharAtlas');
        this.reticle = this.physics.add.sprite(p1Spawn.x, p1Spawn.y, 'target');
        this.portal = this.physics.add.sprite(this.player.x + 4, this.player.y + 4, 'portal').
        setAlpha(0).setOrigin(.5, .5).setScale(2);

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
        skeletonStatue.setCollisionByProperty({ collides: true});
        button1Door1.setCollisionByProperty({ collides: true});
        button2Door1.setCollisionByProperty({ collides: true});

        //create toggles for the physics colliders in both worlds 
        this.normalGatesToggle = this.physics.add.collider(this.player, normalGates);
        this.normalGravesToggle = this.physics.add.collider(this.player, normalGraves);
        this.normalMausoleumToggle = this.physics.add.collider(this.player, normalMausoleum);
        this.normalFountainToggle = this.physics.add.collider(this.player, normalFountain);
        this.door1Toggle = this.physics.add.collider(this.player, door1);
        this.button1Door1Toggle = this.physics.add.collider(this.player, this.b1);
        this.button2Door1Toggle = this.physics.add.collider(this.player, button2Door1);
        this.distortedGatesToggle = this.physics.add.collider(this.player, distortedGates);
        this.distortedGravesToggles = this.physics.add.collider(this.player, distortedGraves);
        this.distortedHolesToggle = this.physics.add.collider(this.player, distortedHoles);
        this.distortedWellToggle = this.physics.add.collider(this.player, distortedWell);
        this.distortedFountainToggle = this.physics.add.collider(this.player, distortedFountain);
        this.distortedGroundGhostsToggle = this.physics.add.collider(this.player, groundGhosts);
        this.distortedReaperToggle = this.physics.add.collider(this.player, reaper);
        this.skeletonStatue = this.physics.add.collider(this.player, skeletonStatue);
        //put those in arrays for safe keeping
        this.normalColliderToggles = [this.normalGatesToggle, this.normalGravesToggle, 
            this.normalMausoleumToggle, this.normalFountainToggle, this.door1Toggle];
        this.distortedColliderToggles = [this.distortedGatesToggle, this.distortedGravesToggles, 
            this.distortedHolesToggle, this.distortedWellToggle, this.distortedFountainToggle, 
            this.distortedGroundGhostsToggle, this.distortedReaperToggle];
        //turn off the colliders in the distorted world
        for(let i = 0; i < this.distortedColliderToggles.length; i ++){
            this.distortedColliderToggles[i].active = false;
        }

        //create a boolean for keeping track of which world the player is in
        this.inNormalWorld = true;


        //set image/sprite properties
        this.player.setCollideWorldBounds(true).setDrag(500, 500).setScale(1, 1).setOrigin(.5, .5);
        this.player.x = 64;
        this.player.y = 64;
        this.reticle.setCollideWorldBounds(true).setScale(1, 1).setOrigin(.5, .5);
        this.player.health = 5;
        this.player.invincible = false;
        this.player.justFired = false;


        //add bulllet groups for both player and enemies
        this.playerBullets = this.physics.add.group({classType: Bullet, runChildUpdate: true});
        this.enemyBullets = this.physics.add.group({classType: Bullet, runChildUpdate: true});

        //enemies
        //spawns are based on the map, i use a rondom image as a placeholder then set the alpha to zero 
        //and spawn the actual enemy on top of it
        this.copSprites = ['cop1Atlas', 'cop2Atlas', 'cop3Atlas'];
        this.normEnemySpawns = map.createFromObjects("Norm_Enemies", "normEnemySpawn", {
            key: 'ghost1',
            alpha: 0,
        });
        this.enemies = [];
        for(let i = 0; i < this.normEnemySpawns.length; i++){
            let enemy = this.physics.add.sprite(this.normEnemySpawns[i].x, this.normEnemySpawns[i].y, 
                this.copSprites[Math.floor(Math.random() * this.copSprites.length)]);
            for(let j = 0; j < this.normalObjects.length; j++){
                this.physics.add.collider(enemy, this.normalObjects[j]);
            }
            this.enemies.push(enemy);
        }
        //enemy properties
        for(let i = 0; i < this.enemies.length; i += 1){
            this.enemies[i].health = 3;
            this.enemies[i].lastFired = i*500;
            this.enemies[i].dead = false;
        }

        //aniamtion for cop deaths
        let config01 = {
            key: 'cop1Fall',
            frames: this.anims.generateFrameNumbers('cop1Death', {start: 0, end: 5, first: 0}),
            frameRate: 12,
            repeat: 0
        }
        this.anims.create(config01);
        let config02 = {
            key: 'cop2Fall',
            frames: this.anims.generateFrameNumbers('cop2Death', {start: 0, end: 5, first: 0}),
            frameRate: 12,
            repeat: 0
        }
        this.anims.create(config02);
        let config03 = {
            key: 'cop3Fall',
            frames: this.anims.generateFrameNumbers('cop3Death', {start: 0, end: 5, first: 0}),
            frameRate: 12,
            repeat: 0
        }
        this.anims.create(config03);

        //dist enemies
        //spawns are based on the map, i use a rondom image as a placeholder then set the alpha to zero 
        //and spawn the actual enemy on top of it
        this.ghostSprites = ['ghost1', 'ghost2', 'ghost3', 'ghost4', 'ghost5', 'ghost6', 'ghost7', 'ghost8'];
        this.distEnemySpawns = map.createFromObjects("Dist_Enemies", "distEnemySpawn", {
            key: 'ghost1',
            alpha: 0,  
        });
        this.distEnemies = [];
        for(let i = 0; i < this.distEnemySpawns.length; i++){
            let enemy = this.physics.add.sprite(this.distEnemySpawns[i].x, this.distEnemySpawns[i].y, 
                this.ghostSprites[Math.floor(Math.random() * this.ghostSprites.length)]);
            this.distEnemies.push(enemy);
        }
        //dist enemy properties
        for(let i = 0; i  < this.distEnemies.length; i += 1) { 
            this.distEnemies[i].health = 3;
            this.distEnemies[i].dead = false;
            this.distEnemies[i].dropped = false;
            this.distEnemies[i].goingRight = false;
            this.distEnemies[i].velocityX = 0;
            this.distEnemies[i].velocityY = 0;
            for(let j = 0; j < this.distortedObjects.length; j++){
                this.physics.add.collider(this.distEnemies[i], this.distortedObjects[j]);
            }
            this.physics.add.collider(this.player, this.distEnemies[i], this.playerHitMeleeCallback, null, this);
        }
        //make the distorted enemies inactive and invisible at start
        for(let i = 0; i < this.distEnemies.length; i++){
            this.distEnemies[i].setActive(false);
            this.distEnemies[i].setVisible(false);
        }

        
        //button and door groups
        this.door1Buttons = [];
        this.door1Button1 = false;
        this.door1Button2 = false;
        this.door1Buttons.push(this.door1Button1, this.door1Button2);
        this.opened = false;

        //make health drop group
        this.healthDrops = [];
        for(let i = 0; i < 25; i++){
            this.healthDrops[i] = this.physics.add.sprite(-1000, -1000, 'health');
            this.healthDrops[i].setVisible(false).setActive(false);
        }

        //set camera zoom
        this.cameras.main.zoom = 4;
        this.cameras.main.roundPixels = true;
        this.playerHUD();
        this.UICamera.roundPixels = true;

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
            if(!this.player.justFired)
                var bullet = this.playerBullets.get().setActive(true).setVisible(true).setTexture('playerBullet');
    
            if (bullet && !this.player.justFired)
            {  
                for(let i = 0; i < this.enemies.length; i ++){
                    this.physics.add.collider(this.enemies[i], bullet, this.enemyHitCallback, null, this);
                } 
                for(let i = 0; i < this.distEnemies.length; i ++){
                    this.physics.add.collider(this.distEnemies[i], bullet, this.enemyHitCallback, null, this);
                } 
                //stop the bullets on the present walls 
                for(let i = 0; i < this.normalObjects.length; i++){
                    if(this.inNormalWorld){
                        this.physics.add.collider(bullet, this.normalObjects[i], this.wallHitCallback,
                            null, this);   
                    }
                }
                for(let i = 0; i < this.distortedObjects.length; i++){
                    if(!this.inNormalWorld)
                        this.physics.add.collider(bullet, this.distortedObjects[i], this.wallHitCallback, null, this);
                }
                this.physics.add.collider(bullet, this.b1, this.buttonHitCallback, null, this);
                this.physics.add.collider(bullet, this.b2, this.buttonHitCallback, null, this);
                this.physics.add.collider(bullet, skeletonStatue, this.wallHitCallback, null, this);
                //need to add wall colliders here
                bullet.fire(this.player, this.reticle);
                this.gunshotSFX.play();
                this.player.justFired = true;
                this.playerNoFire = this.time.addEvent({
                    delay: 1500,
                    callback: ()=>{
                        this.player.justFired = false;
                    },
                    loop: false
                 });
                this.UICamera.ignore(bullet);
            }
        }, this);



        //play me some tunes
        this.musicNormal = this.sound.add('normSoundtrack');
        this.musicNormal.setLoop(true);
        this.musicNormal.play();
        this.musicNormal.setVolume(7);
        this.musicDist = this.sound.add('distSoundtrack');
        this.musicDist.setLoop(true);
        this.musicDist.play();
        this.musicDist.setVolume(0);

        //sound files as their own objects 
        this.gunshotSFX = this.sound.add('sfx_gunshot');
        this.playerHitSFX = this.sound.add('sfx_playerHit').setVolume(8);
        this.phaseSFX = this.sound.add('sfx_phase');
        this.enemyHitSFX = this.sound.add('sfx_enemyHit');
        this.playerHitTazer = this.sound.add('sfx_tazer').setVolume(2);
        this.ghostWail = this.sound.add('sfx_wail').setVolume(6);
        this.ghostSigh = this.sound.add('sfx_ghostSigh').setVolume(6);
        this.gateOpen = this.sound.add('sfx_openGate').setVolume(8);
        this.police1 = this.sound.add('sfx_police1').setVolume(7);
        this.police2 = this.sound.add('sfx_police2').setVolume(7);
        this.police3 = this.sound.add('sfx_police3').setVolume(7);
        this.police4 = this.sound.add('sfx_police4').setVolume(7);
        this.police5 = this.sound.add('sfx_police5').setVolume(7);
        this.button1SFX = this.sound.add('sfx_button1');
        this.button2SFX = this.sound.add('sfx_button2');
        game.sound.volume = .05;
        this.copDeathSounds = [this.police1, this.police2, this.police3, this.police4, this.police5];
        this.ghostDeathSounds = [this.ghostSigh, this.ghostWail];

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
        this.portal.x = this.player.x;
        this.portal.y = this.player.y;
        //camera tracks player 
        // var avgX = ((this.player.x + this.reticle.x)/2)-400;
        // var avgY = ((this.player.y + this.reticle.y)/2)-300;
        // this.cameras.main.scrollX = this.player.x - game.config.width/2;
        // this.cameras.main.scrollY = this.player.y - game.config.height/2;
        this.cameras.main.startFollow(this.player);

        //makes reticle move with player
        if(!this.gameOver){
            this.reticle.body.velocity.x = 0;
            this.reticle.body.velocity.y = 0;
        }

        // Constrain velocity of player
        this.constrainVelocity(this.player, 75);

        // Constrain position of reticle
        this.constrainReticle(this.reticle, this.player, 128);

        //points the player at the reticle
        this.whereToRotatePlayer = Phaser.Math.Angle.Between(this.player.x, this.player.y, 
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
        if(this.inNormalWorld == false){
            for(let i = 0; i < this.distEnemies.length; i++){
                this.enemyMove(this.distEnemies[i], this.player, 16);
                if(this.distEnemies[i].dead == true && this.distEnemies[i].dropped == false){
                    this.spawnHealth(this.distEnemies[i]);
                }
            }
        }
        //puzzles m8
        
        if(this.door1Button1 == true && this.door1Button2 == true && this.opened == false){
            //console.log('both buttons pressed');
            this.openDoors(this.door1Update);
            this.opened = true;
        }
        //console.log(this.player.x +" "+ this.player.y);
        this.playerWin();
        this.playerLose();
        this.restartGame();
        this.enemyRotation();
        this.playerRotation();
        this.rotateGhosts();
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
            this.musicNormal.setVolume(0);
            this.musicDist.setVolume(6);
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
            }
            for(let i = 0; i < this.distortedScenery.length; i++){    
                this.distortedScenery[i].active = false
                this.distortedScenery[i].setVisible(false);
            }
            this.musicDist.setVolume(0);
            this.musicNormal.setVolume(6);
        }
        //only respawn the enemies if they are not dead
        for(let i = 0; i < this.distEnemies.length; i++){
            if(this.distEnemies[i].dead == false) {
                if(this.distEnemies[i].active == true){
                    this.distEnemies[i].setVelocity(0);
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
        this.tweenPlayerPhase();
        this.justPhased = true;
        this.playerJustPhased = this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.justPhased = false;
            },
            loop: false
        });
        
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
                    health.setVelocity(0,0)
                    enemyHit.dropped = true;
                    this.UICamera.ignore(health);
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
            enemyHit.setVelocity(0,0);
            //kill enemy if health <= 0
            if(enemyHit.health <= 0) {
                enemyHit.setVelocity(0,0);
                enemyHit.setActive(false).setVisible(false).destroy();
                enemyHit.dead = true;
                this.copDeathAnimation(enemyHit);
                this.deathSound(enemyHit);
            }
            this.enemyHitSFX.play();
            //destroy bullet
            bulletHit.setActive(false).setVisible(false).destroy();
        }
    }
    
    //physics callback for when an enemy bullet hits the player
    playerHitCallback(playerHit, bulletHit) {
        // Reduce health of player
        if (bulletHit.active === true && playerHit.active === true && !this.player.invincible) {
            playerHit.health = playerHit.health - 1;
            bulletHit.setActive(false).setVisible(false).destroy();
            if(this.healthIcon05.active == true)
                this.healthIcon05.setActive(false).setVisible(false);
            else if(this.healthIcon04.active == true)
                this.healthIcon04.setActive(false).setVisible(false);  
            else if(this.healthIcon03.active == true)
                this.healthIcon03.setActive(false).setVisible(false);
            else if(this.healthIcon02.active == true)
                this.healthIcon02.setActive(false).setVisible(false);
            else if(this.healthIcon01.active == true)
                this.healthIcon01.setActive(false).setVisible(false);  
            this.playerHitTazer.play();
            this.player.invincible = true;
            this.playerNoHit = this.time.addEvent({
                delay: 1500,
                callback: ()=>{
                    this.player.invincible = false;
                },
                loop: false
            });
            this.tweenPlayerFlash();
        }
        
    }

    //physics callback for when an enemy punches the player
    playerHitMeleeCallback(playerHit, enemyHit) {
        if(playerHit.active === true && enemyHit.active === true && !this.player.invincible){
            playerHit.health -= 1;
            if(this.healthIcon05.active == true)
                this.healthIcon05.setActive(false).setVisible(false);
            else if(this.healthIcon04.active == true)
                this.healthIcon04.setActive(false).setVisible(false);  
            else if(this.healthIcon03.active == true)
                this.healthIcon03.setActive(false).setVisible(false);
            else if(this.healthIcon02.active == true)
                this.healthIcon02.setActive(false).setVisible(false);
            else if(this.healthIcon01.active == true)
                this.healthIcon01.setActive(false).setVisible(false);  
            this.playerHitSFX.play();
            this.player.invincible = true;
            this.playerNoHit = this.time.addEvent({
                delay: 1500,
                callback: ()=>{
                    this.player.invincible = false;
                },
                loop: false
            });
            this.tweenPlayerFlash();
        }
    }

    //phyics callback for when any type of bullet hits a wall
    //this should be basically the same as an enemy bullet cosd llision, but the enemy doesnt disapear. 
    wallHitCallback(bulletHit, wallHit) {
        if(wallHit.visible === true && bulletHit.active === true )
            bulletHit.setActive(false).setVisible(false).destroy();
        
    }

    //set button to pressed and destroy the bullet
    buttonHitCallback(bulletHit, buttonHit){
        if(buttonHit.visible === true && bulletHit.active === true){
            if(buttonHit.layer.name == "Button1_Door1"){
                this.door1Button1 = true;
                this.button1SFX.play();
                buttonHit.setAlpha(.5);
                //buttonHit.setTint(0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00);
            }
            else if(buttonHit.layer.name == "Button2_Door1"){
                this.door1Button2 = true;
                this.button2SFX.play();
                buttonHit.setAlpha(.5);
                //buttonHit.setTint(0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00);
            }
            bulletHit.setActive(false).setVisible(false).destroy();
        }
    }

    //phyics callback for health pickup object
    healthHitCallback(healthHit, playerHit){
        if(healthHit.active === true && playerHit.active === true){
            if(playerHit.health < 5){
                playerHit.health +=1;
                if(this.healthIcon02.active == false)
                    this.healthIcon02.setActive(true).setVisible(true);
                else if(this.healthIcon03.active == false)
                    this.healthIcon03.setActive(true).setVisible(true);  
                else if(this.healthIcon04.active == false)
                    this.healthIcon04.setActive(true).setVisible(true);
                else if(this.healthIcon05.active == false)
                    this.healthIcon05.setActive(true).setVisible(true); 
            }   
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
                this.UICamera.ignore(bullet);
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
        enemy.velocityX = velocityX;
        enemy.velocityY = velocityY;
    }

    openDoors(door){       
        door.y -= 48;
    }

    playerHUD(){
        this.playerHealthUI = this.add.group();{
            this.healthIcon01 = this.add.image(64, 64, 'health').setOrigin(0,0).setScrollFactor(0).setScale(4);
            this.healthIcon02 = this.add.image(64, 128, 'health').setOrigin(0,0).setScrollFactor(0).setScale(4);
            this.healthIcon03 = this.add.image(64, 192, 'health').setOrigin(0,0).setScrollFactor(0).setScale(4);
            this.healthIcon04 = this.add.image(64, 256, 'health').setOrigin(0,0).setScrollFactor(0).setScale(4);
            this.healthIcon05 = this.add.image(64, 320, 'health').setOrigin(0,0).setScrollFactor(0).setScale(4);
        }
        this.cameras.main.ignore(this.playerHealthUI);
        this.cameras.main.startFollow(this.player);
        this.UICamera = this.cameras.add(0,0, game.config.width, game.config.height);
        this.UICamera.ignore([this.player, this.reticle, this.enemies, this.distEnemies, 
            this.distortedObjects,this.distortedScenery, this.normalObjects, this.normalScenery, 
            this.playerBullets, this.enemyBullets, this.skelly, this.b1, this.b2, this.portal]);
        
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
            win = true;
        }
        if(win == true){
            this.player.active = false;
            this.player.destroy();
            this.winText = this.add.text(this.player.x, this.player.y, "YOU WIN");
            this.UICamera.ignore(this.winText);
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

    enemyRotation() {
        //console.log(this.enemies[0].rotation);
        for(let i = 0; i < this.enemies.length; i++){
            
            if(this.enemies[i].rotation < 1.0 && this.enemies[i].rotation > -1.0){
                this.enemies[i].setFrame("Cop_Right");
            }
            else if(this.enemies[i].rotation > -2.2 && this.enemies[i].rotation < -1.0){
                this.enemies[i].setFrame("Cop_Back");
            }
            else if(this.enemies[i].rotation < -2.2 || this.enemies[i].rotation > 2.2){
                this.enemies[i].setFrame("Cop_Left");
            }
            else if(this.enemies[i].rotation < 2.2 && this.enemies[i].rotation > 1.0){
                this.enemies[i].setFrame("Cop_Front");
            }
        }
    }

    playerRotation(){
        if(this.whereToRotatePlayer < .4 && this.whereToRotatePlayer > -.4){
            this.player.setFrame("Main_Char_Right");
        }
        else if(this.whereToRotatePlayer > -1.95 && this.whereToRotatePlayer < -1.2){
            this.player.setFrame("Main_Char_Back");
        }
        else if(this.whereToRotatePlayer < -2.83 || this.whereToRotatePlayer > 2.83){
            this.player.setFrame("Main_Char_Left");
        }
        else if(this.whereToRotatePlayer < 1.95 && this.whereToRotatePlayer > 1.2){
            this.player.setFrame("Main_Char_Front");
        }
        else if(this.whereToRotatePlayer < 1.2 && this.whereToRotatePlayer > .4){
            this.player.setFrame("Main_Char_Right_Down");
        }
        else if(this.whereToRotatePlayer < -.4 && this.whereToRotatePlayer > -1.2){
            this.player.setFrame("Main_Char_Right_Up");
        }
        else if(this.whereToRotatePlayer > 1.95 && this.whereToRotatePlayer < 2.83){
            this.player.setFrame("Main_Char_Left_Down");
        }
        else if(this.whereToRotatePlayer < -1.95 && this.whereToRotatePlayer > -2.83){
            this.player.setFrame("Main_Char_Left_Up");
        }
    }

    rotateGhosts(){
        for(let i = 0; i < this.distEnemies.length; i++){
            let enemy = this.distEnemies[i];
            if(enemy.dead == false && enemy.velocityX >= 0 && enemy.goingRight == false){
                enemy.flipX = true;
                enemy.goingRight = true;
            }
            else if(enemy.dead == false && enemy.velocityX <= 0 && enemy.goingRight == true){
                enemy.flipX = false;
                enemy.goingRight = false;
            }
        }
    }

    tweenPlayerFlash() {
        this.tweens.add({
            targets: this.player,
            alpha: 0,
            duration: 250,
            yoyo: true,
            repeat: 3
        });
    }

    tweenPlayerPhase() {
        if(!this.justPhased){
            this.tweens.add({
                targets: this.portal,
                alpha: 1,
                duration: 250,
                yoyo: true
            });
            this.portal.setAlpha(0);
        }
    }

    copDeathAnimation(cop) {
        let tempAnimKey;
        let tempCopKey;
        let isCop = false;
        if(cop.texture.key == 'cop1Atlas'){
            tempAnimKey = 'cop1Fall';
            tempCopKey = 'cop1Death';
            isCop = true;
        }
        else if (cop.texture.key == 'cop2Atlas'){
            tempAnimKey = 'cop2Fall';
            tempCopKey = 'cop2Death';
            isCop = true;
        }
        else if(cop.texture.key == 'cop3Atlas'){
            tempAnimKey = 'cop3Fall';
            tempCopKey = 'cop3Death';
            isCop = true;
        }
        if(isCop == true){
            let death = this.add.sprite(cop.x, cop.y, tempCopKey);
            this.UICamera.ignore(death);
            death.anims.play(tempAnimKey);
            death.on('animationcomplete', () => {
                death.destroy();
            });
        }
    }

    deathSound(enemy) {
        let tempSound;
        if(enemy.texture.key == 'cop1Atlas' || enemy.texture.key == 'cop2Atlas' || enemy.texture.key == 'cop3Atlas'){
            tempSound = this.copDeathSounds[Math.floor(Math.random() * this.copDeathSounds.length)];
            console.log(Math.floor(Math.random() * this.copDeathSounds.length))  
        }
        else {
            tempSound = this.ghostDeathSounds[Math.floor(Math.random() * this.ghostDeathSounds.length)];
        }
        if(tempSound) {
            tempSound.play();
        }
    }

}