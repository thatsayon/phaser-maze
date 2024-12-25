import Player from "./Player.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        // Load assets
        Player.preload(this);
        this.load.image('road', 'assets/images/road.png'); // Background road texture
        this.load.image('wall', 'assets/images/wall.png'); // Wall texture
        console.log('Assets preloaded');
    }

    create() {
        // Create the tiled road background
        const road = this.add.tileSprite(256, 256, 512, 512, 'road');
        road.setTileScale(12 / road.width, 12 / road.height);
        console.log('Road tiled and scaled');

        // Maze matrix: 1 = wall, 0 = empty space
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

        // Calculate positions for wall tiles
        const tileSize = 26; // Each wall tile is 12x12 pixels
        const startX = 0; // Top-left corner of the screen
        const startY = 0;

        const walls = this.add.group({ classType: Phaser.GameObjects.Image });
        // Loop through the maze matrix and create walls for cells with value 1
        mazeMatrix.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 1) {
                    const x = colIndex * tileSize;
                    const y = rowIndex * tileSize;

                    const wall = this.matter.add.image(x + tileSize / 2, y + tileSize / 2, 'wall', null, {
                        isStatic: true,
                    });

                    wall.setOrigin(0.5, 0.5);
                    wall.setDisplaySize(tileSize, tileSize); // Ensure it matches the visual grid size
                }
            });
        });

         this.player = new Player({ scene: this, x: 100, y: 100, texture: 'dude' });

    // Animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20,
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
    });

    // Input keys
    this.player.inputKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
    });

        // this.cameras.main.startFollow(this.player); 
        // this.cameras.main.roundPixels = true;
        // // this.physics.world.setFPS(60); 
        // this.cameras.main.zoom = 1;
//         //
//         this.cameras.main.setBounds(0, 0, 512, 512);
// this.cameras.main.startFollow(this.player, false); // Disable smooth follow for accurate centering
// this.cameras.main.setZoom(2); // Set desired zoom level (e.g., 2x zoom)
// this.cameras.main.roundPixels = true; // Prevent rendering artifacts during zoom
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
  this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
  this.cameras.main.setZoom(5);


    }

    update() {
        this.player.update();
        // Add animations or logic here if needed
    }
}

