// class defining the SplashScreen scene
class SplashScreen extends Phaser.Scene {
  constructor() {
    super("splashScreen");
  }

  create() {
    // Add background gradient effect
    var graphics = this.add.graphics();
    graphics.fillGradientStyle(0xbbada0, 0xbbada0, 0xa39489, 0xa39489, 1);
    graphics.fillRect(0, 0, config.width, config.height);

    // Title
    this.titleText = this.add.text(config.width/2, 200, "2048", {
      fontSize: "150px",
      fontFamily: "Arial, sans-serif",
      fill: "#776e65",
      fontStyle: "bold"
    });
    this.titleText.setOrigin(0.5, 0.5);

    // Add floating animation to title
    this.tweens.add({
      targets: this.titleText,
      y: this.titleText.y - 10,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Create New Game button with modern design
    this.createNewGameButton();

    // Best score label
    this.highScoreLabel = this.add.text(config.width/2, 600, "BEST SCORE", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      fill: "#776e65",
      fontStyle: "bold"
    });
    this.highScoreLabel.setOrigin(0.5, 0.5);

    this.highScoreLabelValue = this.add.text(config.width/2, 650, highScore, {
      fontSize: "48px",
      fontFamily: "Arial, sans-serif",
      fill: "#776e65",
      fontStyle: "bold"
    });
    this.highScoreLabelValue.setOrigin(0.5, 0.5);
  }



  // criação e aplicação de estilo ao butao
  createNewGameButton() {
    // Create button background with rounded corners
    const buttonWidth = 280;
    const buttonHeight = 80;
    const buttonX = config.width/2;
    const buttonY = 400;

    // Button background
    this.buttonBg = this.add.graphics();
    this.buttonBg.fillStyle(0x8f7a66);
    this.buttonBg.fillRoundedRect(
      buttonX - buttonWidth/2, 
      buttonY - buttonHeight/2, 
      buttonWidth, 
      buttonHeight, 
      15
    );

    // Button shadow for depth
    this.buttonShadow = this.add.graphics();
    this.buttonShadow.fillStyle(0x6d5d4f, 0.3);
    this.buttonShadow.fillRoundedRect(
      buttonX - buttonWidth/2 + 3, 
      buttonY - buttonHeight/2 + 3, 
      buttonWidth, 
      buttonHeight, 
      15
    );

    // Move shadow behind button
    this.buttonShadow.setDepth(-1);

    // Button text
    this.newGameText = this.add.text(buttonX, buttonY, "NEW GAME", {
      fontSize: "28px",
      fontFamily: "Arial, sans-serif",
      fill: "#f9f6f2",
      fontStyle: "bold"
    });
    this.newGameText.setOrigin(0.5, 0.5);

    // Make button interactive
    const buttonHitArea = new Phaser.Geom.Rectangle(
      buttonX - buttonWidth/2, 
      buttonY - buttonHeight/2, 
      buttonWidth, 
      buttonHeight
    );

    this.buttonBg.setInteractive(buttonHitArea, Phaser.Geom.Rectangle.Contains);

    // Hover effects
    this.buttonBg.on('pointerover', () => {
      this.onButtonHover();
    });

    this.buttonBg.on('pointerout', () => {
      this.onButtonOut();
    });

    this.buttonBg.on('pointerdown', () => {
      this.onButtonClick();
    });

    // Add subtle pulsing animation
    this.tweens.add({
      targets: [this.buttonBg, this.newGameText, this.playIcon],
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  onButtonHover() {
    // Change button color on hover
    this.buttonBg.clear();
    this.buttonBg.fillStyle(0x9f8a76);
    this.buttonBg.fillRoundedRect(
      config.width/2 - 140, 
      400 - 40, 
      280, 
      80, 
      15
    );

    // Scale up button elements
    this.tweens.add({
      targets: [this.buttonBg, this.newGameText, this.playIcon],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 150,
      ease: 'Power2.easeOut'
    });

    // Add glow effect to text - safer approach
    if (this.newGameText && this.newGameText.active) {
      this.newGameText.setStyle({ 
        fill: "#ffffff"
      });
    }
  }

  onButtonOut() {
    // Reset button color
    this.buttonBg.clear();
    this.buttonBg.fillStyle(0x8f7a66);
    this.buttonBg.fillRoundedRect(
      config.width/2 - 140, 
      400 - 40, 
      280, 
      80, 
      15
    );

    // Reset scale
    this.tweens.add({
      targets: [this.buttonBg, this.newGameText, this.playIcon],
      scaleX: 1,
      scaleY: 1,
      duration: 150,
      ease: 'Power2.easeOut'
    });

    // Remove glow effect - safer approach
    if (this.newGameText && this.newGameText.active) {
      this.newGameText.setStyle({ 
        fill: "#f9f6f2"
      });
    }
  }

  onButtonClick() {
    // Click animation
    this.tweens.add({
      targets: [this.buttonBg, this.newGameText, this.playIcon],
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 100,
      ease: 'Power2.easeOut',
      yoyo: true,
      onComplete: () => {
        // Add screen transition effect
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
          this.scene.start("playGame");
        });
      }
    });

    // Add particle effect on click
    this.createClickParticles();
  }

  createClickParticles() {
    // Create simple particle burst effect
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(config.width/2, 400, 5, 0xf9f6f2);
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50;
      
      this.tweens.add({
        targets: particle,
        x: config.width/2 + Math.cos(angle) * distance,
        y: 400 + Math.sin(angle) * distance,
        alpha: 0,
        duration: 300,
        ease: 'Power2.easeOut',
        onComplete: () => {
          if (particle && particle.active) {
            particle.destroy();
          }
        }
      });
    }
  }
}
