const weights = [ [60, 30, 25, 20], 
                  [30, 25, 10, 10],
                  [15, 5, 0, -5],
                  [5, 0, -5, -15],
            ]

function firstHeuristic(board) {
    console.log(board);
    let score = 0; 
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            score += board[i].row[j] * weights[i][j];
        }
    }
    return score;
}

exports.firstHeuristic = firstHeuristic();