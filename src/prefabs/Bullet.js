class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        
        super(scene, x, y, texture);
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'bullet');
        this.speed = 10;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(11, 6);
    }

    //fires a bullet from the shooter at the target
    fire(shooter, target) {
        this.setPosition(shooter.x, shooter.y); //initial postion
        this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

        if(target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    }

    update(time, delta) {
        this.x += this.xSpeed; //* delta;
        this.y += this.ySpeed; //* delta;
        this.born += delta;

        if (this.born > 1500) {
            this.destroy();
            this.setActive(false);
            this.setVisible(false);
            
        }
    }   



}