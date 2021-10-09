
const iohook = require('iohook');
let board = [{ row: [0, 0, 0, 0] }, { row: [0, 0, 0, 0] }, { row: [0, 0, 0, 0] }, { row: [0, 0, 0, 0] }];
let previous = [{ row: [0, 0, 0, 0] }, { row: [0, 0, 0, 0] }, { row: [0, 0, 0, 0] }, { row: [0, 0, 0, 0] }];
let simulate = [{ row: [0, 0, 0, 0] }, { row: [0, 0, 0, 0] }, { row: [0, 0, 0, 0] }, { row: [0, 0, 0, 0] }];
const weights = [ [60, 30, 25, 20], 
                  [30, 25, 10, 10],
                  [15, 5, 0, -5],
                  [5, 0, -5, -15],
            ]

addRandom();
showBoard();

function didMove(inQuestion) {  
    let didMove = false;
    for (let i = 0; i < 4; i++) {
        if (!arraysEqual(inQuestion[i].row, previous[i].row)) {
            didMove = true;
        }
    }
    return didMove;
}

function firstHeuristic(board) {
    let score = 0; 
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            score += board[i].row[j] * weights[i][j];
        }
    }
    return score;
}

setInterval( () => {playBot()}, 500);

function playBot() {
    let wonLost = false;
    let direction = '';
    //while (!wonLost) {
        let moveScores = []; //up, down, left, right
        upDateSimulate(board);
        for (let i = 0; i < 4; i++) { //simulate all four directions
            switch (i) {
                case 0: //up
                    for (let i = 0; i < 4; i++) {
                        let col = [];
                        simulate.forEach(row => {
                            col.push(row.row[i]);
                        })
                        let c = moveRowCol(col, 'left').nums;
                        let ct = 0;
                        simulate.forEach(row => {
                            row.row[0] = c[ct]
                            ct++;
                        })
                    }
                    if (didMove(simulate)) {
                        moveScores[0] = firstHeuristic(simulate);
                    } else {
                        moveScores[0] = -10000;
                    }
                    
                    upDateSimulate(board);
                break;

                case 1: //down
                    for (let i = 0; i < 4; i++) {
                        let col1 = [];
                        simulate.forEach(row => {
                            col1.push(row.row[i]);
                        })
                        let c1 = moveRowCol(col1, 'right').nums;
                        let ct = 0;
                        simulate.forEach(row => {
                            row.row[0] = c1[ct]
                            ct++;
                        })
                    }
                    if (didMove(simulate)) {
                        moveScores[1] = firstHeuristic(simulate);
                    } else {
                        moveScores[1] = -10000;
                    }
                upDateSimulate(board);
                break;
                
                case 2: //left
                    for (let i = 0; i < 4; i++) {
                        simulate[i].row = moveRowCol(simulate[i].row, 'left').nums;
                    }
                    if (didMove(simulate)) {
                        moveScores[2] = firstHeuristic(simulate);
                    } else {
                        moveScores[2] = -10000;
                    }
                    upDateSimulate(board);
                break;

                case 3: //right
                    for (let i = 0; i < 4; i++) {
                        simulate[i].row = moveRowCol(simulate[i].row, 'right').nums;
                    }
                    if (didMove(simulate)) {
                        moveScores[3] = firstHeuristic(simulate);
                    } else {
                        moveScores[3] = -10000;
                    }
                    upDateSimulate(board);
                break;
            }
        }
        console.log(moveScores);
        let greatest = -(100000);
        let idx = -1;
        for (let i = 0; i < 3; i++) {
            if (moveScores[i] > greatest) {
                greatest = moveScores[i];
                idx = i;
            }
        }
        switch (idx) {
            case 0:
                for (let i = 1; i <= 4; i++) {
                    doCombine(i + 4, 'left');
                }
                if (didMove(board)) {
                    addRandom();
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            previous[i].row[j] = board[i].row[j];
                        }
                    }
                }
                upDateSimulate(board);
                showBoard();
            break;
            //down
            case 1:
                for (let i = 1; i <= 4; i++) {
                    doCombine(i + 4, 'right');
                }
                if (didMove(board)) {
                    addRandom();
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            previous[i].row[j] = board[i].row[j];
                        }
                    }
                }
                upDateSimulate(board);
                showBoard();
            break;
            //left
            case 2:
                for (let i = 1; i <= 4; i++) {
                    doCombine(i, 'left');
                }
                if (didMove(board)) {
                    addRandom();
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            previous[i].row[j] = board[i].row[j];
                        }
                    }
                }
                upDateSimulate(board);
                showBoard();
            break;
            //right
            case 3:
                for (let i = 1; i <= 4; i++) {
                    doCombine(i, 'right');
                }
                if (didMove(board)) {
                    addRandom();
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            previous[i].row[j] = board[i].row[j];
                        }
                    }
                }
                upDateSimulate(board);
                showBoard();
            break;
        }
    //}
    return direction;
}

function upDateSimulate(b) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            simulate[i].row[j] = b[i].row[j];
        }
    }
}

function showBoard() {
    let b = '';
    board.forEach(row => {
        row.row.forEach(tile => {
            if (tile < 10) {
                b += `${tile}   `;
            } else if (tile < 100) {
                b += `${tile}  `;
            } else {
                b += `${tile} `;
            }
        })
        b += '\n\n';
    })
    console.log(b);
}

function addRandom() {
    let done = false;
    while (!done) {
        let x = Math.trunc((Math.random() * 4));
        let y = Math.trunc((Math.random() * 4));
        let tile = board[y].row[x];
        let rand = Math.random();
        if (tile === 0) {
            if (rand < 0.8) {
                board[y].row[x] = 2;
            } else {
                board[y].row[x] = 4;
            }
            done = true;
        }
    }
}

function getTotalEmpty() {
    let ct = 0;
    board.forEach(row => {
        row.row.forEach(tile => { if (tile === 0) { ct++; } })
    })
    return ct;
}
//left === up for cols and visa versa
function moveRowCol(rowCol, dir) {
    let look = rowCol;
    let combo = false;
    let didMove = false;
    if (dir === 'left') {
        for (let i = 1; i < 4; i++) {
            if (!combo) {
                if (look[i] === look[i - 1] && look[i] != 0) {
                    look[i - 1] += look[i];
                    look[i] = 0;
                    combo = true; 
                
                } else if (look[i - 2] === look[i] && look[i - 1] === 0 && look[i] != 0) {
                    look[i - 2] += look[i];
                    look[i] = 0;
                    combo = true;
                
                } else if (look[i - 3] === look[i] && look[i - 1] === 0 && look[i - 2] === 0 && look[i] != 0) {
                    look[i - 3] += look[i];
                    look[i] = 0;
                    combo = true;
                
                }
            }
        }
        for (let j = 3; j >= 0; j--) {
            if (look[j] != 0 && look[j - 1] === 0) {
                look[j - 1] = look[j];
                look[j] = 0;
            }
        }
        //dumb fix for an issue when 0 2 0 2 might happen
        for (let j = 3; j >= 0; j--) {
            if (look[j] != 0 && look[j - 1] === 0) {
                look[j - 1] = look[j];
                look[j] = 0;
            }
        }
        for (let j = 3; j >= 0; j--) {
            if (look[j] != 0 && look[j - 1] === 0) {
                look[j - 1] = look[j];
                look[j] = 0;
            }
        }
    } else if (dir === 'right') {
        for (let i = 2; i >= 0; i--) {
            if (!combo) {
                if (look[i] === look[i + 1] && look[i] != 0) {
                    look[i + 1] += look[i];
                    look[i] = 0;
                    combo = true; 
                } else if (look[i + 2] === look[i] && look[i + 1] === 0 && look[i] != 0) {
                    look[i + 2] += look[i];
                    look[i] = 0;
                    combo = true;
                
                } else if (look[i + 3] === look[i] && look[i + 1] === 0 && look[i + 2] === 0 && look[i] != 0) {
                    look[i + 3] += look[i];
                    look[i] = 0;
                    combo = true;
                }
            }
        }
        for (let j = 0; j < 4; j++) {
            if (look[j] != 0 && look[j + 1] === 0) {
                look[j + 1] = look[j];
                look[j] = 0;
            }
        }
        //absolute fuckery here but who actually cares amirite?
        for (let j = 0; j < 4; j++) {
            if (look[j] != 0 && look[j + 1] === 0) {
                look[j + 1] = look[j];
                look[j] = 0;
            }
        }
        for (let j = 0; j < 4; j++) {
            if (look[j] != 0 && look[j + 1] === 0) {
                look[j + 1] = look[j];
                look[j] = 0;
            }
        }
    }
    console.log
    return { nums: look, bool: didMove };
}

function doCombine(col, dir) {
    switch (col) {
        //top row
        case 1:
            board[0].row = moveRowCol(board[0].row, dir).nums;
        break;
        //next row down
        case 2:
            board[1].row = moveRowCol(board[1].row, dir).nums;
        break;
        //next row down
        case 3:
            board[2].row = moveRowCol(board[2].row, dir).nums;
        break;
        //next row down
        case 4:
            board[3].row = moveRowCol(board[3].row, dir).nums;
        break;
        //left most column
        case 5:
            let col = [];
            board.forEach(row => {
                col.push(row.row[0]);
            })
            let c = moveRowCol(col, dir).nums;
            let ct = 0;
            board.forEach(row => {
                row.row[0] = c[ct]
                ct++;
            })
        break;
        //next column
        case 6:
            let col1 = [];
            board.forEach(row => {
                col1.push(row.row[1]);
            })
            let c1 = moveRowCol(col1, dir).nums;
            let ct1 = 0;
            board.forEach(row => {
                row.row[1] = c1[ct1]
                ct1++;
            })
        break;
        //next column
        case 7:
            let col2 = [];
            board.forEach(row => {
                col2.push(row.row[2]);
            })
            let c2 = moveRowCol(col2, dir).nums;
            let ct2 = 0;
            board.forEach(row => {
                row.row[2] = c2[ct2]
                ct2++;
            })
        break;
        //next column
        case 8:
            let col3 = [];
            board.forEach(row => {
                col3.push(row.row[3]);
            })
            let c3 = moveRowCol(col3, dir).nums;
            let ct3 = 0;
            board.forEach(row => {
                row.row[3] = c3[ct3]
                ct3++;
            })
        break;
    }
}

function getCols() {
    let cols = [];
    for (let i = 0; i < 4; i++) {
        let c = [];
        board.forEach(row => {
            c.push(row.row[i]);
        })
        cols.push(c);
    }
    return cols;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function checkLose() {
    let lost = true;
    if (getTotalEmpty() != 0) {
        lost = false;
    } else {
        board.forEach(row => {
            for (let i = 1; i < 4; i++) {
                if (row.row[i] === row.row[i - 1]) {
                    lost = false;
                }
            }
        })
        getCols().forEach(col => {
            for (let i = 1; i < 4; i++) {
                if (col[i] === col[i - 1]) {
                    lost = false;
                }
            }
        })
    } 
    return lost; 
}

function checkWin() {
    let didWin = false;
    board.forEach(row => {
        row.row.forEach(tile => {
            if (tile === 2048) {
                didWin = true;
            }
        })
    })
    return didWin;
}

iohook.on('keydown', event => {
    if (!checkLose()) {
        switch (event.rawcode) {
            //up
            case 38:
                for (let i = 1; i <= 4; i++) {
                    doCombine(i + 4, 'left');
                }
                if (didMove(board)) {
                    addRandom();
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            previous[i].row[j] = board[i].row[j];
                        }
                    }
                }
                showBoard();
            break;
            //down
            case 40:
                for (let i = 1; i <= 4; i++) {
                    doCombine(i + 4, 'right');
                }
                if (didMove(board)) {
                    addRandom();
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            previous[i].row[j] = board[i].row[j];
                        }
                    }
                }
                showBoard();
            break;
            //left
            case 37:
                for (let i = 1; i <= 4; i++) {
                    doCombine(i, 'left');
                }
                if (didMove(board)) {
                    addRandom();
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            previous[i].row[j] = board[i].row[j];
                        }
                    }
                }
                showBoard();
            break;
            //right
            case 39:
                for (let i = 1; i <= 4; i++) {
                    doCombine(i, 'right');
                }
                if (didMove(board)) {
                    addRandom();
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            previous[i].row[j] = board[i].row[j];
                        }
                    }
                }
                showBoard();
            break;
        } 
    } else if (checkWin()) {
        console.log('You WIN!');
    } else {
          console.log("You've LOST!") ; 
    }
})

iohook.start();