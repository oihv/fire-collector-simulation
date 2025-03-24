class Robot {
  constructor(wallWidth, horizontalLineGap) {
    this.gridX = 3; // starts from 1, end in 5
    this.gridY = 0; // starts from 0, end in 4
    this.x = wallWidth + 3 * horizontalLineGap;
    this.y = wallWidth;
    this.size = 60;

    this.speed = 15;
    this.speedX = 0;
    this.speedY = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.idle = true;
    this.vertex = [[this.x - this.size / 2, this.y - this.size / 2],
    [this.x, this.y + this.size / 2],
    [this.x + this.size / 2, this.y - this.size / 2]];
  }

  // Update the direction
  dir(newSpeedX, newSpeedY) {
    if (this.idle === false) return;
    if (this.isOutConstraint(newSpeedX, newSpeedY)) return;
    this.speedX = newSpeedX;
    this.speedY = newSpeedY;
    this.updateGrid();
    this. idle = false;
  }

  isOutConstraint(newSpeedX, newSpeedY) {
    let newGridX = this.gridX + newSpeedX;
    let newGridY = this.gridY + newSpeedY;
    if (newGridX > 5 || newGridX < 1) return true; 
    if (newGridY > 4 || newGridY < 0) return true; 
    return false;
  }

  updateGrid() {
    this.gridX += this.speedX;
    this.gridY += this.speedY;
    this.targetX = wallWidth + this.gridX * horizontalLineGap;
    this.targetY = wallWidth + this.gridY * verticalLineGap;
    if (this.gridY === 4) this.targetY -= 30;
  }

  updateVertex() {
    if (this.speedX === 1) {
      this.vertex[0][0] = this.x - this.size / 2;
      this.vertex[0][1] = this.y + this.size / 2;
      this.vertex[1][0] = this.x - this.size / 2;
      this.vertex[1][1] = this.y - this.size / 2;
      this.vertex[2][0] = this.x + this.size / 2;
      this.vertex[2][1] = this.y;
    }
    else if (this.speedX === -1) {
      this.vertex[0][0] = this.x + this.size / 2;
      this.vertex[0][1] = this.y + this.size / 2;
      this.vertex[1][0] = this.x + this.size / 2;
      this.vertex[1][1] = this.y - this.size / 2;
      this.vertex[2][0] = this.x - this.size / 2;
      this.vertex[2][1] = this.y;
    }
    else if (this.speedY === -1) {
      this.vertex[0][0] = this.x - this.size / 2;
      this.vertex[0][1] = this.y + this.size / 2;
      this.vertex[1][0] = this.x + this.size / 2;
      this.vertex[1][1] = this.y + this.size / 2;
      this.vertex[2][0] = this.x;
      this.vertex[2][1] = this.y - this.size / 2;
    }
    else if (this.speedY === 1) {
      this.vertex[0][0] = this.x - this.size / 2;
      this.vertex[0][1] = this.y - this.size / 2;
      this.vertex[1][0] = this.x + this.size / 2;
      this.vertex[1][1] = this.y - this.size / 2;
      this.vertex[2][0] = this.x;
      this.vertex[2][1] = this.y + this.size / 2;
    }
  }

  stop() {
    this.speedX = 0;
    this.speedY = 0;
  }

  realignPosition() {
    this.x = this.targetX;
    this.y = this.targetY;
  }

  update() {
    if (this.checkArriveTarget()) {
      this.idle = true;
      this.realignPosition();
      this.stop();
      this.updateVertex();
      return;
    }
    this.x += this.speedX * this.speed;
    this.y += this.speedY * this.speed;
  }

  checkArriveTarget() {
    if (this.speedX === 1 && this.x + this.size / 2 >= this.targetX) return true;
    else if (this.speedX === -1 && this.x - this.size / 2 <= this.targetX) return true;
    else if (this.speedY === -1 && this.y - this.size / 2 <= this.targetY) return true;
    else if (this.speedY === 1 && this.y + this.size / 2 >= this.targetY) return true;
    else return false;
  }

  show() {
    this.updateVertex();
    noStroke();
    fill('#778DA9');
    triangle(this.vertex[0][0], this.vertex[0][1], this.vertex[1][0], this.vertex[1][1], this.vertex[2][0], this.vertex[2][1]);
  }
};
