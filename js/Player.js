export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);

        this.scene = scene;
        this.scene.add.existing(this);

        // const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        // const playerCollider = Bodies.circle(this.x, this.y, 16, { isSensor: false, label: 'playerCollider' }); // Smaller size
        // const playerSensor = Bodies.circle(this.x, this.y, 18, { isSensor: true, label: 'playerSensor' });
        // const compoundBody = Body.create({
        //     parts: [playerCollider, playerSensor],
        //     frictionAir: 0.35,
        // });
        //
        // this.setExistingBody(compoundBody);
        // this.setFixedRotation();
        // this.setScale(0.5); // Scale down the sprite to make it smaller
        // this.setOrigin(0.4, 0.7); // Set the anchor to the center

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;

        // Create a square collider for the body
        const playerCollider = Bodies.rectangle(this.x, this.y, 28, 42, {
            isSensor: false,
            label: 'playerCollider'
        }); // Width and height set to 32x32

        // Create a slightly larger square sensor for interactions
        const playerSensor = Bodies.rectangle(this.x, this.y, 32, 46, {
            isSensor: true,
            label: 'playerSensor'
        }); // Slightly larger to allow interaction detection

        // Combine the parts into a compound body
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 0.35, // Smooth movement
        });

        // Attach the compound body to the player sprite
        this.setExistingBody(compoundBody);
        this.setFixedRotation(); // Prevent rotation on collision
        this.setScale(0.5); // Keep scale normal
        this.setOrigin(0.5, 0.54); // Adjust sprite origin to match the square collider


        // Initialize animations
        this.isMoving = false; // To track movement state
        this.lastDirection = 'turn'; // To track the last played animation
    }

    static preload(scene) {
        // Preload player sprite
        scene.load.spritesheet('dude', 'assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    update() {
        const speed = 2;
        let playerVelocity = new Phaser.Math.Vector2();
        let newDirection = null;

        if (this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
            newDirection = 'left';
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
            newDirection = 'right';
        }

        if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }

        // Handle animations and step sound
        if (newDirection || playerVelocity.length() > 0) {
            if (!this.isMoving) {
                // Start step sound if not already playing
                if (!this.stepSound || !this.stepSound.isPlaying) {
                    this.stepSound = this.scene.sound.add('step', { loop: true, volume: 0.5 });
                    this.stepSound.play();
                }
            }
            this.isMoving = true;

            if (newDirection && this.lastDirection !== newDirection) {
                this.anims.play(newDirection, true);
                this.lastDirection = newDirection;
            }
        } else {
            if (this.isMoving) {
                // Stop step sound when player stops
                if (this.stepSound && this.stepSound.isPlaying) {
                    this.stepSound.stop();
                }
                this.anims.play('turn');
                this.isMoving = false;
                this.lastDirection = 'turn';
            }
        }

        // Update velocity
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
    }

}

