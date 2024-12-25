import Player from "./Player.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        // Preload assets
        Player.preload(this);
        this.load.image("road", "assets/images/road.png"); // Background road texture
        this.load.image("wall", "assets/images/wall.png"); // Wall texture
        this.load.audio("step", "assets/sound/step.wav");
        console.log("Assets preloaded");
    }

    create() {
        // Add step sound
        this.stepSound = this.sound.add("step", {
            loop: true,
            volume: 0.5,
        });

        // Create a tiled road background
        this.createRoadBackground();

        // Create the maze based on a matrix
        this.createMaze();

        // Initialize player
        this.initializePlayer();

        // Set up animations
        this.createAnimations();

        // Set up camera
        this.setupCamera();
    }

    createRoadBackground() {
        const road = this.add.tileSprite(256, 256, 512, 512, "road");
        road.setTileScale(12 / road.width, 12 / road.height);
        console.log("Road tiled and scaled");
    }

    createMaze() {
        const mazeMatrix = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
            [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
            [1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
            [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
            [1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        const tileSize = 26;
        mazeMatrix.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 1) {
                    const x = colIndex * tileSize;
                    const y = rowIndex * tileSize;
                    const wall = this.matter.add.image(x + tileSize / 2, y + tileSize / 2, "wall", null, {
                        isStatic: true,
                    });
                    wall.setOrigin(0.5, 0.5);
                    wall.setDisplaySize(tileSize, tileSize);
                }
            });
        });
    }

    initializePlayer() {
        this.player = new Player({
            scene: this,
            x: 100,
            y: 100,
            texture: "dude",
        });

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
    }

    createAnimations() {
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });
    }

    setupCamera() {
        this.cameras.main.setBounds(0, 0, 512, 512);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(6);
    }

    update() {
        this.player.update();

        // Play walking sound when moving
        const { left, right, up, down } = this.player.inputKeys;
        if (left.isDown || right.isDown || up.isDown || down.isDown) {
            if (!this.stepSound.isPlaying) {
                this.stepSound.play();
            }
        } else {
            this.stepSound.stop();
        }
    }

    resize() {
  const cam = this.cameras.main;
  const { width, height } = this.scale;

  // Keep camera centered without adjusting zoom
  cam.setViewport(0, 0, width, height);
}

}

