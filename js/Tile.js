// class defining the Tile Sprite
class Tile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, value) {
    super(scene, x * TILESIZE + 0.5 * TILESIZE, y * TILESIZE + 0.5 * TILESIZE + 150, "tiles");
    scene.add.existing(this);

    this.setOrigin(0.5, 0.5);
    this.displayWidth = TILESIZE - 20;
    this.scaleY = this.scaleX;
    this.scene = scene;

    this.posX = x;
    this.posY = y;

    this.lastPosX = this.posX;
    this.lastPosY = this.posY;

    this.value = value;
    this.updateTileAppearance();
  }

  updateTileAppearance() {
    let costume = 0;
    
    if (this.value == 2) costume = 0;
    else if (this.value == 4) costume = 1;
    else if (this.value == 8) costume = 2;
    else if (this.value == 16) costume = 3;
    else if (this.value == 32) costume = 4;
    else if (this.value == 64) costume = 5;
    else if (this.value == 128) costume = 6;
    else if (this.value == 256) costume = 7;
    else if (this.value == 512) costume = 8;
    else if (this.value == 1024) costume = 9;
    else if (this.value == 2048) costume = 10;
    
    this.setFrame(costume);
  }

  // updates state of tile
  update() {
    // Enhanced movement animations with easing
    if (this.posX != this.lastPosX) {
      var tmpX = this.lastPosX;
      this.lastPosX = this.posX;
      this.scene.add.tween({
        targets: this,
        duration: 150,
        delay: 0,
        ease: 'Power2.easeOut',
        x: this.posX * TILESIZE + 0.5 * TILESIZE,
      });
    }
    if (this.posY != this.lastPosY) {
      var tmpY = this.lastPosY;
      this.lastPosY = this.posY;
      this.scene.add.tween({
        targets: this,
        duration: 150,
        delay: 0,
        ease: 'Power2.easeOut',
        y: this.posY * TILESIZE + 0.5 * TILESIZE + 150,
      });
    }
  }
}
