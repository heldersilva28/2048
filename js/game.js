// Game configuration
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 950,
  title: "2048",
  backgroundColor: 0xbbada0,
  scene: [SplashScreen, MainScene],
  pixelArt: true,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

// Constants
const TILESIZE = config.width / 4;

// Enum defining directions
const directions = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
};

// Global variables
let highScore = parseInt(localStorage.getItem('2048-highscore')) || 0;

// Save high score to localStorage
function saveHighScore() {
  localStorage.setItem('2048-highscore', highScore.toString());
}

// Initialize game
window.addEventListener('load', () => {
  window.game = new Phaser.Game(config);
});
