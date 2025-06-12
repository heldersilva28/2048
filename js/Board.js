class Board {
  constructor(scene) {
    this.scene = scene;
    // Initialize 4x4 board with null values
    this.board = [];
    for (let i = 0; i < 4; i++) {
      this.board[i] = [];
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = null;
      }
    }
    
    // Draw grid background
    this.drawGrid();
  }

  drawGrid() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xbbada0);
    graphics.fillRoundedRect(0, 150, config.width, config.width, 10);
    
    // Draw individual cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        graphics.fillStyle(0xcdc1b4);
        graphics.fillRoundedRect(
          i * TILESIZE + 10, 
          j * TILESIZE + 160, 
          TILESIZE - 20, 
          TILESIZE - 20, 
          5
        );
      }
    }
  }

  spawnTile() {
    const emptyCells = [];
    
    // Find all empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === null) {
          emptyCells.push({x: i, y: j});
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;
      const newTile = new Tile(this.scene, randomCell.x, randomCell.y, value);
      this.board[randomCell.x][randomCell.y] = newTile;
      
      // Spawn animation
      newTile.setScale(0);
      this.scene.tweens.add({
        targets: newTile,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Back.easeOut',
        onComplete: () => {
          newTile.displayWidth = TILESIZE - 20;
          newTile.scaleY = newTile.scaleX;
        }
      });
    }
  }

  moveLeft() {
    let moved = false;
    
    for (let j = 0; j < 4; j++) {
      // Create a temporary array to store tiles in this row
      let tiles = [];
      
      // Collect all non-null tiles in this row
      for (let i = 0; i < 4; i++) {
        if (this.board[i][j] !== null) {
          tiles.push(this.board[i][j]);
          this.board[i][j] = null;
        }
      }
      
      // Merge adjacent tiles with same value
      for (let t = 0; t < tiles.length - 1; t++) {
        if (tiles[t].value === tiles[t + 1].value) {
          tiles[t].value *= 2;
          this.scene.score += tiles[t].value;
          tiles[t].updateTileAppearance();
          tiles[t + 1].destroy();
          tiles.splice(t + 1, 1);
        }
      }
      
      // Place tiles back on board
      for (let t = 0; t < tiles.length; t++) {
        this.board[t][j] = tiles[t];
        if (tiles[t].posX !== t) {
          moved = true;
        }
        tiles[t].posX = t;
        tiles[t].posY = j;
      }
    }
    
    return moved;
  }

  moveRight() {
    let moved = false;
    
    for (let j = 0; j < 4; j++) {
      // Create a temporary array to store tiles in this row
      let tiles = [];
      
      // Collect all non-null tiles in this row
      for (let i = 3; i >= 0; i--) {
        if (this.board[i][j] !== null) {
          tiles.push(this.board[i][j]);
          this.board[i][j] = null;
        }
      }
      
      // Merge adjacent tiles with same value
      for (let t = 0; t < tiles.length - 1; t++) {
        if (tiles[t].value === tiles[t + 1].value) {
          tiles[t].value *= 2;
          this.scene.score += tiles[t].value;
          tiles[t].updateTileAppearance();
          tiles[t + 1].destroy();
          tiles.splice(t + 1, 1);
        }
      }
      
      // Place tiles back on board from right side
      for (let t = 0; t < tiles.length; t++) {
        let newX = 3 - t;
        this.board[newX][j] = tiles[t];
        if (tiles[t].posX !== newX) {
          moved = true;
        }
        tiles[t].posX = newX;
        tiles[t].posY = j;
      }
    }
    
    return moved;
  }

  moveUp() {
    let moved = false;
    
    for (let i = 0; i < 4; i++) {
      // Create a temporary array to store tiles in this column
      let tiles = [];
      
      // Collect all non-null tiles in this column
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== null) {
          tiles.push(this.board[i][j]);
          this.board[i][j] = null;
        }
      }
      
      // Merge adjacent tiles with same value
      for (let t = 0; t < tiles.length - 1; t++) {
        if (tiles[t].value === tiles[t + 1].value) {
          tiles[t].value *= 2;
          this.scene.score += tiles[t].value;
          tiles[t].updateTileAppearance();
          tiles[t + 1].destroy();
          tiles.splice(t + 1, 1);
        }
      }
      
      // Place tiles back on board
      for (let t = 0; t < tiles.length; t++) {
        this.board[i][t] = tiles[t];
        if (tiles[t].posY !== t) {
          moved = true;
        }
        tiles[t].posX = i;
        tiles[t].posY = t;
      }
    }
    
    return moved;
  }

  moveDown() {
    let moved = false;
    
    for (let i = 0; i < 4; i++) {
      // Create a temporary array to store tiles in this column
      let tiles = [];
      
      // Collect all non-null tiles in this column
      for (let j = 3; j >= 0; j--) {
        if (this.board[i][j] !== null) {
          tiles.push(this.board[i][j]);
          this.board[i][j] = null;
        }
      }
      
      // Merge adjacent tiles with same value
      for (let t = 0; t < tiles.length - 1; t++) {
        if (tiles[t].value === tiles[t + 1].value) {
          tiles[t].value *= 2;
          this.scene.score += tiles[t].value;
          tiles[t].updateTileAppearance();
          tiles[t + 1].destroy();
          tiles.splice(t + 1, 1);
        }
      }
      
      // Place tiles back on board from bottom
      for (let t = 0; t < tiles.length; t++) {
        let newY = 3 - t;
        this.board[i][newY] = tiles[t];
        if (tiles[t].posY !== newY) {
          moved = true;
        }
        tiles[t].posX = i;
        tiles[t].posY = newY;
      }
    }
    
    return moved;
  }

  arrayEquals(a) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((a[i][j] === null && this.board[i][j] !== null) ||
            (a[i][j] !== null && this.board[i][j] === null) ||
            (a[i][j] !== null && this.board[i][j] !== null && a[i][j].value !== this.board[i][j].value)) {
          return false;
        }
      }
    }
    return true;
  }

  checkGameOver() {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === null) {
          return false;
        }
      }
    }
    
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== null) {
          const current = this.board[i][j].value;
          if ((i < 3 && this.board[i + 1][j] !== null && this.board[i + 1][j].value === current) ||
              (j < 3 && this.board[i][j + 1] !== null && this.board[i][j + 1].value === current)) {
            return false;
          }
        }
      }
    }
    
    return true;
  }

  update() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== null) {
          this.board[i][j].update();
        }
      }
    }
  }
}
