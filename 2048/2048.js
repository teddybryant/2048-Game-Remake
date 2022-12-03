var score = 0;
var panel = [[],[],[],[]];
var milestone = 500;
var won = false;

var rows = 4;
var cols = 4;

window.onload = function() {
  gameSetup();
}

function gameSetup() {
  for (let row=0; row<rows; row++) {
    for (let col=0; col<cols; col++) {
      panel[row][col] = 0;
      let square = document.createElement("div");
      square.id = row.toString() + "," + col.toString();
      setSquare(square,0);
      document.getElementById("panel").append(square);
    }
  }
  place2();
  place2();
}

function place2() {
  let emptySquare = false;
  for (let row=0; row<rows; row++) {
    for (let col=0; col<cols; col++) {
      if(panel[row][col] == 0) {
        emptySquare = true;
      }
    }
  }
  if(!emptySquare) {
    toastr['error']("Try another direction","WRONG MOVE");
    checkLoss();
    return;
  }
  else {
    let found = false;
  while(!found) {
    let row = Math.floor(Math.random()*rows);
    let col = Math.floor(Math.random()*cols);
    
    if(panel[row][col] == 0) {
      panel[row][col] = 2; 
      let square = document.getElementById(row.toString() + "," + col.toString());
      square.innerText = "2";
      square.classList.add("the2");
      found = true;
      }
    }
  }
}

function setSquare(square, squareNum) {
  square.innerText = "";
  square.classList.value = "";
  square.classList.add("square");
  if(squareNum != 0) {
    square.innerText = squareNum;
    if(squareNum <= 1024) {
      square.classList.add("the" + squareNum.toString());
    }
    else {
      square.classList.add("the2048");
      if(!won) {
        alert("CONGRATULATIONS YOU HAVE REACHED 2048!\nFeel free to keep playing to get a higher score!");
        won = true;
      }
    } 
  }
}

function updateSquares(row) {
  row = row.filter(squareNum => squareNum != 0);
  for (let i=0; i < row.length-1; i++) {
    if(row[i] == row[i+1]) {
      row[i+1] = 0;
      row[i] *=2;
      score += row[i];
    }
  }
  row = row.filter(squareNum => squareNum != 0);
  while(row.length < cols) {
    row.push(0);
  }
  return row; 
}

function combineLR(right) {
  for (let row=0; row<rows; row++) {
    let theRow = panel[row];
    if(right) {
      theRow.reverse();
      theRow = updateSquares(theRow);
      theRow.reverse();
    }
    else {
      theRow = updateSquares(theRow);
    }
    panel[row] = theRow;
    
    for (let col = 0; col < cols; col++) {
      let square = document.getElementById(row.toString() + "," + col.toString());
      let squareNum = panel[row][col];
      setSquare(square,squareNum);
    }
  }
}

function combineUD(down) {
  for (let col = 0; col < cols; col++) {
    let theRow = [panel[0][col], panel[1][col], panel[2][col], panel[3][col]];
    if(down) {
      theRow.reverse();
      theRow = updateSquares(theRow);
      theRow.reverse();
    }
    else {
      theRow = updateSquares(theRow);
    }
    for (let row = 0; row < rows; row++) {
      panel[row][col] = theRow[row];
      let square = document.getElementById(row.toString() + "," + col.toString());
      let squareNum = panel[row][col];
      setSquare(square,squareNum);
    }  
  }
}
function checkLoss() {
   for (let row=0; row<rows; row++) {
      for (let col = 0; col < cols; col++) {
        if(panel[row][col] == panel[row][col+1]){
          return;
        }
      }
   }
   for (let col = 0; col < cols; col++) {
    let theCol = [panel[0][col], panel[1][col], panel[2][col], panel[3][col]];
     for (let row=0; row<rows; row++) {
       if(theCol[row] == theCol[row+1]) {
         return;
       }
     }
   }
   alert("YOU LOST\nRefresh the page to restart the game");
}

document.addEventListener("keyup", (event) => {
  if(event.code == "ArrowLeft" || event.code == "KeyA") {
    combineLR(false);
    place2();
  }
  else if (event.code == "ArrowRight" || event.code == "KeyD") {
    combineLR(true);
    place2();
  }
  else if (event.code == "ArrowUp" || event.code == "KeyW") {
    combineUD(false);
    place2();
  }
  else if (event.code == "ArrowDown" || event.code == "KeyS") {
    combineUD(true);
    place2();
  }
  document.getElementById("score").innerText = score;
  if(score >= milestone) {
    toastr['success']("You hit a new high score of " + milestone,"NICE JOB");
    milestone+=500;
  }
})