var w;
var rows, cols;
var grid = [];
var stack = [];
var sel, mazeSize, showGrid;
var mode = "random";
var start, pause, step;
var keyGen = "random";


function setup() {

  createCanvas(1001, 1001);
  noLoop();

  var textHelp = [];
  textHelp[0] = createDiv("Selection Mode: ");
  textHelp[0].position(10, height + 52);
  textHelp[1] = createDiv("Cell Size: ");
  textHelp[1].position(10, height + 22);

  showGrid = createSelect();
  showGrid.position(10, height + 160);
  showGrid.option("true");
  showGrid.option("false");

  start = createButton("Start");
  start.position(10, height + 100);
  start.mousePressed(() => loop());

  pause = createButton("Pause");
  pause.position(70, height + 100);
  pause.mousePressed(() => noLoop());

  step = createButton("Step");
  step.position(140, height + 100);
  step.mousePressed(() => draw());

  restart = createButton("Restart");
  restart.position(10, height + 135);
  restart.mousePressed(modeChange);

  sel = createSelect();
  sel.position(150, height + 50);
  sel.option("random");
  sel.option("newest");
  sel.option("oldest");
  sel.option("middle");
  sel.option("random/newest : 50/50");
  sel.option("random/newest : 25/75");
  sel.option("random/newest : 5/95");
  sel.option("oldest/newest : 30/70");
  sel.changed(() => keyGen = sel.value());

  mazeSize = createInput();
  mazeSize.position(150, height + 20);
  mazeSize.changed(modeChange);

  
  
  

  w = 50;

  function modeChange() {

    if (mazeSize.value() != "" && mazeSize.value() > 0 && mazeSize.value() <= 600)
      w = floor(mazeSize.value());

    rows = floor(height / w);
    cols = floor(width / w);

    mode = sel.value();

    for (let i = 0; i < rows; i++) {

      grid[i] = new Array(cols);

      for (let j = 0; j < rows; j++) {

        grid[i][j] = new Cell(i, j);

      }

    }

    stack = [];

    stack.push(grid[floor(random(rows))][floor(random(cols))]);

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


function getIndex() {

  if (keyGen == "random") {

    let index = floor(random(stack.length));
    return index;

  } else if (keyGen == "newest") {

    let index;

    if (stack.length > 1)
      index = stack.length - 1;
    else
      index = 0;

    return index;

  } else if (keyGen == "oldest") {

    let index = 0;
    return index;

  } else if (keyGen == "middle") {

    let index = floor(stack.length / 2);
    return index;

  } else if (keyGen == "random/newest : 50/50") {

    if (random(1) < 0.5) {

      let index = floor(random(stack.length));
      return index;

    } else {

      let index;

      if (stack.length > 1)
        index = stack.length - 1;
      else
        index = 0;

      return index;

    }

  } else if (keyGen == "random/newest : 25/75") {

    if (random(1) < 0.25) {

      let index = floor(random(stack.length));
      return index;

    } else {

      let index;

      if (stack.length > 1)
        index = stack.length - 1;
      else
        index = 0;

      return index;

    }

  } else if (keyGen == "random/newest : 5/95") {

    if (random(1) < 0.05) {

      let index = floor(random(stack.length));
      return index;

    } else {

      let index;

      if (stack.length > 1)
        index = stack.length - 1;
      else
        index = 0;

      return index;

    }

  } else if (keyGen == "oldest/newest : 30/70") {

    if (random(1) < 0.30) {

      return 0;

    } else {

      let index;

      if (stack.length > 1)
        index = stack.length - 1;
      else
        index = 0;

      return index;

    }

  }

}


function draw() {
  stroke(51);
  strokeWeight(1);
    background(255);


  if (showGrid.value() == "true") {

    for (let i = 0; i < stack.length; i++) {

      stack[i].highlight(150, 255, 200);

    }


    for (let i = 0; i < rows; i++) {

      for (let j = 0; j < cols; j++) {

        grid[i][j].show();

      }

    }

  }

  let current = stack[getIndex(mode)]; //random, newest, oldest, middle

  if (current) {

    stack[stack.length - 1].highlight(0, 255, 200);

    let neighbors = current.getNeighbors();

    if (neighbors.length > 0) {

      let next = neighbors[floor(random(neighbors.length))]
      removeWalls(current, next);
      current = next;
      current.visited = true;
      stack.push(current);

    } else {

      for (let i = 0; i < stack.length; i++) {

        if (stack[i] === current) {

          stack.splice(i, 1);
          break;

        }

      }

    }

    if (stack.length == 0) {

      noLoop();
      
      print("Finished!\n");

      for (let i = 0; i < grid.length; i++) {

        for (let cell of grid[i]) {

          cell.highlight(255, 255, 255);

        }

      }
    }

  }

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
    
    if (!this.visited) this.highlight(51, 51, 51);

    if (this.walls[0])
      line(this.col * w, this.row * w, this.col * w + w, this.row * w);

    if (this.walls[1])
      line(this.col * w + w, this.row * w, this.col * w + w, this.row * w + w);

    if (this.walls[2])
      line(this.col * w, this.row * w + w, this.col * w + w, this.row * w + w);

    if (this.walls[3])
      line(this.col * w, this.row * w, this.col * w, this.row * w + w);

  }


  this.highlight = function(r, g, b) {

    fill(r, g, b);
    noStroke();
    rect(this.col * w + 1, this.row * w + 1, w - 1, w - 1);

  }

}