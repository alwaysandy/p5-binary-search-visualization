/* 
  Each object of this class represents a number to be searched within a box
*/
class NumBox {
  constructor(num, x, y) {
    this.num = num;
    this.x = x;
    this.y = y;
    this.is_key = false;
    this.findable = true;
  }

  show() {
    if (this.is_key) {
      fill(0, 200, 0)
    } else if (!this.findable) {
      fill(200)
    } else {
      fill(255)
    }
    stroke(5);
    rectMode(CENTER)
    square(this.x, this.y, SQUARESIZE);

    fill(0);
    textSize(30);
    textAlign(CENTER, CENTER);
    text(this.num, this.x, this.y);
  }
}

/* Each object of this class represents a triangle pointing at a number in a box */
class Pointer {
  constructor(x, y, index, color) {
    this.x = x;
    this.y = y;
    this.new_x = x;
    this.new_y = y;
    this.color = color;
    this.index = index;
  }

  show() {
    stroke(5);
    if (this.color == "blue") {
      fill(0, 0, 255);
    } else if (this.color == "green") {
      fill(0, 255, 0);
    } else if (this.color == "black") {
      fill(0, 0, 0);
    } else {
      fill(255, 0, 0);
    }

    triangle(this.x - 7, this.y + 45, this.x, this.y + 35, this.x + 7, this.y + 45);
  }
}



/* p5 CONSTANTS */
const SQUARESIZE = 60;
const PADDING = 20;
const TO_SEARCH = [-81, -3, 5, 19, 21, 111, 111, 111, 129, 252];
const TO_FIND = -82;

// Stores the square with number inside objects
const NUM_BOXES = [];

for (let i = 0; i < TO_SEARCH.length; i++) {
  let nb = new NumBox(TO_SEARCH[i].toString(), PADDING + (SQUARESIZE / 2) + (i * (SQUARESIZE + PADDING)), 50);
  NUM_BOXES.push(nb);
}

let lowPointer, midPointer, highPointer;
let doneSearching = false;

function setup() {
  // Allow padding between and around the squares
  const CANVAS_X = TO_SEARCH.length * (SQUARESIZE + PADDING) + PADDING;
  createCanvas(CANVAS_X, 135);

  lowPointer = new Pointer(NUM_BOXES[0].x, NUM_BOXES[0].y, 0, "blue");
  let hi = NUM_BOXES.length - 1;
  highPointer = new Pointer(NUM_BOXES[hi].x, NUM_BOXES[hi].y, hi, "red");
  let mi = Math.floor((lowPointer.index + highPointer.index) / 2)
  midPointer = new Pointer(NUM_BOXES[mi].x, NUM_BOXES[mi].y, mi, "green");
}

function mousePressed() {
  if (doneSearching) {
    doneSearching = false;
    NUM_BOXES[midPointer.index].is_key = false;
    for (let n of NUM_BOXES) {
      n.findable = true;
    }
    setup();
    return;
  }

  let low = lowPointer.index;
  let high = highPointer.index;
  let middle = midPointer.index;

  if (low <= high) {
    if (TO_SEARCH[middle] == TO_FIND) {
      checkIfDone();
    } else if (TO_SEARCH[middle] > TO_FIND) {
      high = middle - 1;
      highPointer.index = high;

      if (low <= high) {
        middle = Math.floor((low + high) / 2);
        midPointer.index = middle;
      }

      checkIfDone();
      updatePointers();
    } else {
      low = middle + 1;
      lowPointer.index = middle + 1;

      if (low <= high) {
        middle = Math.floor((low + high) / 2);
        midPointer.index = middle;
      }

      checkIfDone();
      updatePointers();
    }
  }
}

function checkIfDone() {
  if (lowPointer.index < 0 || lowPointer.index >= TO_SEARCH.length || lowPointer.index > highPointer.index) {
    doneSearching = true;
    setIsntFindable();
  } else if (highPointer.index < 0 || highPointer.INDEX >= TO_SEARCH.length) {
    doneSearching = true;
    setIsntFindable();
  } else if (midPointer.index == - 1) {
    doneSearching = true;
    setIsntFindable();
  } else if (TO_SEARCH[midPointer.index] == TO_FIND) {
    doneSearching = true;
    NUM_BOXES[midPointer.index].is_key = true;
  }

  return false;
}

function updatePointers() {
  let low = lowPointer.index;
  let high = highPointer.index;
  let mid = midPointer.index;

  if (low == -1) {
    lowPointer.new_x = NUM_BOXES[0].x - 20;
    lowPointer.new_y = NUM_BOXES[0].y;
  } else if (low >= TO_SEARCH.length) {
    lowPointer.new_x = NUM_BOXES[TO_SEARCH.length - 1].x + 20;
    lowPointer.new_y = NUM_BOXES[TO_SEARCH.length - 1].y;
  } else {
    lowPointer.new_x = NUM_BOXES[low].x;
    lowPointer.new_y = NUM_BOXES[low].y;
  }

  if (high < 0) {
    highPointer.new_x = NUM_BOXES[0].x - 20;
    highPointer.new_y = NUM_BOXES[0].y;
  } else if (high >= TO_SEARCH.length) {
    highPointer.new_x = NUM_BOXES[TO_SEARCH.length - 1].x + 20;
    highPointer.new_y = NUM_BOXES[TO_SEARCH.length - 1].y;
  } else {
    highPointer.new_x = NUM_BOXES[high].x;
    highPointer.new_y = NUM_BOXES[high].y;
  }
  
  midPointer.new_x = NUM_BOXES[mid].x;
  midPointer.new_y = NUM_BOXES[mid].y;

  if (lowPointer.index == midPointer.index) {
    midPointer.new_y += 15;
  }

  if (lowPointer.index == highPointer.index && midPointer.index == highPointer.index) {
    highPointer.new_y += 30;
  } else if (lowPointer.index == highPointer.index || midPointer.index == highPointer.index) {
    highPointer.new_y += 15;
  }
}

function setIsntFindable() {
  for (let n of NUM_BOXES) {
    n.findable = false;
  }
}

// Update x value until it reaches 'new_x' then update y until it reaches 'new_y'
function animatePointer(pointer) {
  if (pointer.x != pointer.new_x) {
    if (pointer.x < pointer.new_x) {
      pointer.x += 1;
    } else {
      pointer.x -= 1;
    }
  } else if (pointer.y != pointer.new_y) {
    if (pointer.y < pointer.new_y) {
      pointer.y += 1;
    } else {
      pointer.y -= 1;
    }
  }
}

function draw() {
  background(255);
  frameRate(144);

  for (let nb of NUM_BOXES) {
    nb.show();
  }

  animatePointer(lowPointer);
  animatePointer(midPointer);
  animatePointer(highPointer);

  lowPointer.show();
  midPointer.show();
  highPointer.show();
}
