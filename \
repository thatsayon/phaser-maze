import MainScene from "./MainScene.js";

const config = {
  type: Phaser.WEBGL,
  backgroundColor: '#351f1b',
  parent: 'survival-game',
  scale: {
    mode: Phaser.Scale.RESIZE, // Automatically adjusts to fit the window size
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game both horizontally and vertically
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [MainScene],
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision',
      },
    ],
  },
};

// Create the game instance
const game = new Phaser.Game(config);

// Handle resizing dynamically
window.addEventListener('resize', () => {
  if (game.isBooted) {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }
});

