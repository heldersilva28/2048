// class defining the MainScene scene
class MainScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  // preloading spritesheet
  preload() {
    this.load.spritesheet("tiles","assets/images/tiles.png",{
      frameWidth: 200,
      frameHeight: 200
    });
  }

  create() {
    this.board = new Board(this);
    this.score = 0;

    // Create initial tiles
    this.board.spawnTile();
    this.board.spawnTile();

    // Create header background
    const graphics = this.add.graphics();
    graphics.fillStyle(0xfaf8ef);
    graphics.fillRect(0, 0, config.width, 150);

    // Score display
    this.scoreLabel = this.add.text(20, 20, "SCORE", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      fill: "#bbada0",
      fontStyle: "bold"
    });

    this.scoreLabelValue = this.add.text(20, 45, "0", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      fill: "#776e65",
      fontStyle: "bold"
    });

    // Best score
    this.bestLabel = this.add.text(config.width - 20, 20, "BEST", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      fill: "#bbada0",
      fontStyle: "bold"
    });
    this.bestLabel.setOrigin(1, 0);

    this.bestLabelValue = this.add.text(config.width - 20, 45, highScore.toString(), {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      fill: "#776e65",
      fontStyle: "bold"
    });
    this.bestLabelValue.setOrigin(1, 0);

    // Create improved New Game button
    this.createNewGameButton();

    // Input handling
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Add WASD keys
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
  }

  createNewGameButton() {
    const buttonWidth = 140;
    const buttonHeight = 40;
    const buttonX = config.width/2;
    const buttonY = 100;

    // Button background with gradient
    this.newGameBg = this.add.graphics();
    this.drawButton(0x8f7a66, 0x7f6a56);

    // Button text
    this.newGameText = this.add.text(buttonX, buttonY, "RESTART GAME", {
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      fill: "#f9f6f2",
      fontStyle: "bold"
    });
    this.newGameText.setOrigin(0.5, 0.5);

    // Interactive area
    const hitArea = new Phaser.Geom.Rectangle(
      buttonX - buttonWidth/2,
      buttonY - buttonHeight/2,
      buttonWidth,
      buttonHeight
    );

    this.newGameBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    this.newGameBg.on('pointerover', () => {
      this.drawButton(0x9f8a76, 0x8f7a66);
    });

    this.newGameBg.on('pointerout', () => {
      this.drawButton(0x8f7a66, 0x7f6a56);
    });

    this.newGameBg.on('pointerdown', () => {
      this.tweens.add({
        targets: [this.newGameBg, this.newGameText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.scene.restart();
        }
      });
    });
  }

  drawButton(color1, color2) {
    const buttonWidth = 140;
    const buttonHeight = 40;
    const buttonX = config.width/2;
    const buttonY = 100;

    this.newGameBg.clear();
    this.newGameBg.fillGradientStyle(color1, color1, color2, color2);
    this.newGameBg.fillRoundedRect(
      buttonX - buttonWidth/2,
      buttonY - buttonHeight/2,
      buttonWidth,
      buttonHeight,
      8
    );
  }

  // updates game state
  update() {
    let moved = false;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || 
        Phaser.Input.Keyboard.JustDown(this.wasd.A)) {
      moved = this.board.moveLeft();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || 
               Phaser.Input.Keyboard.JustDown(this.wasd.D)) {
      moved = this.board.moveRight();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
               Phaser.Input.Keyboard.JustDown(this.wasd.W)) {
      moved = this.board.moveUp();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || 
               Phaser.Input.Keyboard.JustDown(this.wasd.S)) {
      moved = this.board.moveDown();
    }

    if (moved) {
      this.time.delayedCall(300, () => {
        this.board.spawnTile();
        if (this.board.checkGameOver()) {
          this.gameOver();
        }
      });
    }

    // Update board
    this.board.update();

    // Update score display
    this.scoreLabelValue.setText(this.score.toString());

    // Update best score
    if (this.score > highScore) {
      highScore = this.score;
      this.bestLabelValue.setText(highScore.toString());
      saveHighScore();
    }
  }

  gameOver() {
    // Save high score
    if (this.score > highScore) {
      highScore = this.score;
      saveHighScore();
    }

    const gameOverText = this.add.text(config.width/2, config.height/2, "Game Over!", {
      fontSize: "48px",
      fontFamily: "Arial, sans-serif",
      fill: "#776e65",
      fontStyle: "bold"
    });
    gameOverText.setOrigin(0.5, 0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start("splashScreen");
    });
  }
}
