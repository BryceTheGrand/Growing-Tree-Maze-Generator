var w;
var rows, cols;
var grid = [];
var stack = [];
var sel, mazeSize, showGrid;
var start, pause, step;
var keyGen = "newest:100";
var keys, chance, canv, saveMaze;
var mazeCount = 1;

function setup() {

  canv = createCanvas(1000, 1000);
  canv.position(1, 1);
  noLoop();

  var textHelp = [];
  textHelp[0] = createDiv("Selection Mode:");
  textHelp[0].position(10, height + 52);
  textHelp[1] = createDiv("Cell Size: ");
  textHelp[1].position(10, height + 22);
  textHelp[2] = createDiv("Possible inputs: \"oldest\", \"newest\", \"middle\", \"random\". Eg. newest:100,random:50,oldest:20)");
  textHelp[2].position(400, height + 52);

  showGrid = createSelect();
  showGrid.position(10, height + 160);
  showGrid.option("true");
  showGrid.option("false");
  
  saveMaze = createButton("Save Maze");
  saveMaze.position(110, height + 160);
  saveMaze.mousePressed(() => save(canv, "Maze-" + mazeCount++));

  start = createButton("Start");
  start.position(10, height + 100);
  start.mousePressed(() => loop());

  pause = createButton("Pause");
  pause.position(70, height + 100);
  pause.mousePressed(() => noLoop());

  step = createButton("Step");
  step.position(140, height + 100);
  step.mousePressed(() => draw());

  restart = createButton("Restart (double click to change selection mode)");
  restart.position(10, height + 135);
  restart.mousePressed(modeChange);

  sel = createInput("newest:100");
  sel.position(150, height + 50);
  sel.changed(() => keyGen = sel.value());

  mazeSize = createInput(50);
  mazeSize.position(150, height + 20);
  mazeSize.changed(modeChange);

  generateKeys();

  w = 50;

  strokeWeight(1);

  function modeChange() {


    if (mazeSize.value() != "" && mazeSize.value() > 0 && mazeSize.value() <= 600)
      w = floor(mazeSize.value());

    rows = floor(height / w);
    cols = floor(width / w);

    for (let i = 0; i < rows; i++) {

      grid[i] = new Array(cols);

      for (let j = 0; j < rows; j++) {

        grid[i][j] = new Cell(i, j);

      }

    }

    stack = [];

    stack.push(grid[floor(random(rows))][floor(random(cols))]);

    generateKeys();

  }

  stack = [];

  rows = floor(height / w);
  cols = floor(width / w);

  for (let i = 0; i < rows; i++) {

    grid[i] = new Array(cols);

    for (let j = 0; j < rows; j++) {

      grid[i][j] = new Cell(i, j);

    }

  }

  stack.push(grid[floor(random(rows))][floor(random(cols))]);

}


function generateKeys() {

  if (keyGen != "") {

    let keyGenInfo = keyGen.split(",");
    keys = [];
    chance = [];
    let sum = 0;

    for (let keyGenIndex of keyGenInfo) {

      keys.push(split(trim(keyGenIndex), ':'));

    }


    for (let keyIndex of keys) {

      sum += int(trim(keyIndex[1]));

    }


    for (let keyIndex of keys) {

      chance.push(int(keyIndex[1]) / sum);

    }
    
    print(keys, chance);

  }

}


function getIndex() {


  let keyPicked = "";

  let picker = random(1);

  for (let i = 0; i < chance.length; i++) {

    if (picker < chance[i]) {

      keyPicked = keys[i][0];
      break;

    } else {

      picker -= chance[i];

    }

  }

  if (keyPicked == "random") {

    return floor(random(stack.length));

  } else if (keyPicked == "newest") {

    let index = 0;

    if (stack.length > 1)
      index = stack.length - 1;

    return index;

  } else if (keyPicked == "oldest") {

    let index = 0;
    return index;

  } else if (keyPicked == "middle") {

    return floor(stack.length / 2);

  }

}


function drawWalls() {
  
 for (let i = 0; i < rows; i++) {

      for (let j = 0; j < cols; j++) {

        grid[i][j].show();

      }

    } 
  
}


function draw() {
  stroke(51);
  background(255);

  if (showGrid.value() == "true") {

    for (let cell of stack) {

      cell.highlight(200, 100, 100, 150);

    }

    drawWalls();    

  }

  let current = stack[getIndex()]; //random, newest, oldest, middle

  if (current) {

    stack[stack.length - 1].highlight(150, 50, 255, 255);

    let neighbors = current.getNeighbors();

    if (neighbors.length > 0) {

      let next = neighbors[floor(random(neighbors.length))]
      removeWalls(current, next);
      current = next;
      current.visited = true;
      stack.push(current);

    } else {

      stack = stack.filter(cell => cell !== current);

    }

    if (stack.length == 0) {

      noLoop();

      print("Finished!\n");
      
      drawWalls();

      for (let i = 0; i < grid.length; i++) {

        for (let cell of grid[i]) {

          cell.highlight(255, 255, 255, 255);

        }

      }

    }

  }


  stroke(51);
  line(cols * w - 1, 0, cols * w - 1, height);
  line(0, rows * w - 1, width, rows * w - 1);


}


function removeWalls(a, b) {

  var x = a.col - b.col;
  var y = a.row - b.row;

  if (y == 1) {

    a.walls[0] = false;
    b.walls[2] = false;

  } else if (y == -1) {

    a.walls[2] = false;
    b.walls[0] = false;

  } else if (x == 1) {

    a.walls[3] = false;
    b.walls[1] = false;

  } else if (x == -1) {

    a.walls[1] = false;
    b.walls[3] = false;

  }

}


function Cell(row, col) {

  this.row = row;
  this.col = col;
  this.walls = [true, true, true, true];
  this.visited = false;


  this.getNeighbors = function() {

    let neighbors = [];
    let top, right, bottom, left;


    if (this.row > 0)
      top = grid[row - 1][col];

    if (this.col < cols - 1)
      right = grid[row][col + 1];

    if (this.row < rows - 1)
      bottom = grid[row + 1][col];

    if (this.col > 0)
      left = grid[row][col - 1];

    if (top && top.visited == false)
      neighbors.push(top);

    if (right && right.visited == false)
      neighbors.push(right);

    if (bottom && bottom.visited == false)
      neighbors.push(bottom);

    if (left && left.visited == false)
      neighbors.push(left);

    return neighbors;

  }


  this.show = function() {

    stroke(51);

    if (!this.visited) this.highlight(51, 51, 51, 100);

    if (this.walls[0])
      line(this.col * w, this.row * w, this.col * w + w, this.row * w);

    if (this.walls[1])
      line(this.col * w + w, this.row * w, this.col * w + w, this.row * w + w);

    if (this.walls[2])
      line(this.col * w, this.row * w + w, this.col * w + w, this.row * w + w);

    if (this.walls[3])
      line(this.col * w, this.row * w, this.col * w, this.row * w + w);

  }


  this.highlight = function(r, g, b, op) {

    fill(r, g, b, op);
    noStroke();
    rect(this.col * w + w / 10, this.row * w + w / 10, w - w / 5, w - w / 5);

  }

}