class Fire extends MainObj {
  constructor(gridX, gridY, color) {
    super(gridX, gridY);
    this.color = color;
    this.size = 30;
  }

  show() {
    fill(this.color);
    circle(this.x, this.y, this.size);
  }
}

function randomizeFireLocation() {
  for (var i = 0; i < 4 ; i++) {
    fireArr.push(new Fire(floor(random(1, 5)), floor(random(1, 4)), '#a2d2ff'))
    console.log(floor(random(1, 5)))
  }
  for (var i = 0; i < 4 ; i++) {
    fireArr.push(new Fire(floor(random(1, 5)), floor(random(1, 4)), '#c1121f'))
  }
}

function setFireLocation() {
  for (var i = 0; i < 4; i++) {
    
  }
}
