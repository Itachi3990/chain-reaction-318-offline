#include "minimax.h"
#include <climits>
#include <fstream>

string getOpponentColor(string playingFor) {
    if (playingFor == "R") return "B";
    return "R";
}

bool isFullOfSameColor(const vector<vector<string>> &board) {
    string color = "";
    for (const auto &row : board) 
        for (const auto &cell : row)
            if (cell != "0") {  
                if (color.empty()) 
                    color = cell.substr(1); // Get the color of the first piece
                 else if (cell.substr(1) != color) 
                    return false; // Found a different color 
            }
        
    return !color.empty(); // Return true if at least one piece is present and all are of the same color
}

//returns move index
int minimax(vector<vector<string>> &initialBoard, int depth) {
    gameState *initialState = new gameState(initialBoard);
    int maxUtil = minimaxHelper(*initialState, depth, INT_MIN, INT_MAX);

    //loop through the children to find the ones with the max utility
    vector<gameState*> bestMoves;
    for (auto &child : initialState->children)
        if (child->score == maxUtil)
            bestMoves.push_back(child);
        
    // randomly select one of the best moves and print it
    int randomIndex = rand() % bestMoves.size();
    gameState *bestMove = bestMoves[randomIndex];
    
    // cout << "Best move board:" << endl;
    // for (const auto &row : bestMove->board) {
    //     for (const auto &cell : row) {
    //         cout << cell << " ";
    //     }
    //     cout << endl;
    // }

    ofstream file("game_state.txt");
    if (!file.is_open()) {
        cerr << "Error opening file for writing." << endl;
        return -1; // Error code
    }

    // Write the board to the file
    file << "AI Move:" << endl;
    for (const auto &row : bestMove->board) {
        for (const auto &cell : row)
            file << cell << " ";
        file << endl;
    }

    file.close();

    return bestMove->lastModifiedCell;
   
}

//with alpha-beta pruning
int minimaxHelper(gameState &state, int max_depth, int alpha, int beta) {
    //cout << "Evaluating depth: " << state.depth << endl;
    if (state.depth == max_depth) {
        state.score = gameState::currentHeuristic(state.board, gameState::playingFor);
        return state.score;
    }

    PLAYER currentPlayer = (state.depth % 2) ? MIN_PLAYER : MAX_PLAYER;

    state.populateImmediateChildren(currentPlayer);
    //cout << "Children count at depth " << state.depth << ": " << state.children.size() << endl;

    if (state.children.empty()) {
        state.score = gameState::currentHeuristic(state.board, gameState::playingFor);
        return state.score;
    }

    if (currentPlayer == MAX_PLAYER) {
        int maxEval = INT_MIN;
        for (auto &child : state.children) {
            int eval = minimaxHelper(*child, max_depth, alpha, beta);
            maxEval = max(maxEval, eval);
            alpha = max(alpha, eval);
            if (beta <= alpha)
                break; // Beta cut-off
        }
        state.score = maxEval;
        return maxEval;
    } else { // Min player
        int minEval = INT_MAX;
        for (auto &child : state.children) {
            int eval = minimaxHelper(*child, max_depth, alpha, beta);
            minEval = min(minEval, eval);
            beta = min(beta, eval);
            if (beta <= alpha)
                break; // Alpha cut-off
        }
        state.score = minEval;
        return minEval;
    }
} 

int getMaxWeight(int i, int j, vector<vector<string>> &board) {
    int rowCnt = board.size();
    int colCnt = board[0].size();
    int maxWeight = 4; // Default max weight

    if(i==0 || i==rowCnt-1) maxWeight--;
    if(j==0 || j==colCnt-1) maxWeight--;

    return maxWeight;
}

void claimOrbsOrthogonally (vector<vector<string>> &board, int i, int j, string color) {
    int rowCnt = board.size();
    int colCnt = board[0].size();

    int count;

    // Check up
    if (i > 0) {
        if(board[i-1][j] == "0") board[i-1][j] = "1" + color; 
        else {
            count = atoi(board[i-1][j].substr(0, 1).c_str());
            count++;
            board[i-1][j] = to_string(count) + color;
        }
    }
    // Check down
    if (i < rowCnt - 1) {
        if(board[i+1][j] == "0") board[i+1][j] = "1" + color;
        else {
            count = atoi(board[i+1][j].substr(0, 1).c_str());
            count++;
            board[i+1][j] = to_string(count) + color;
        }
    }
    // Check left
    if (j > 0) {
        if(board[i][j-1] == "0") board[i][j-1] = "1" + color;
        else {
            count = atoi(board[i][j-1].substr(0, 1).c_str());
            count++;
            board[i][j-1] = to_string(count) + color;
        }
    }
    // Check right
    if (j < colCnt - 1) {
        if(board[i][j+1] == "0") board[i][j+1] = "1" + color;
        else {
            count = atoi(board[i][j+1].substr(0, 1).c_str());
            count++;
            board[i][j+1] = to_string(count) + color;
        }
    }

}

void handleChainReaction(vector<vector<string>> &board) {
    bool reactionOccurred = true;

    while (reactionOccurred) {
        reactionOccurred = false;
        
        if(isFullOfSameColor(board))
            return; // Game over condition


        //cout << "Handling chain reaction..." << endl;

        for (int i = 0; i < board.size(); i++)
            for (int j = 0; j < board[i].size(); j++) {
                string cell = board[i][j];
                if (cell != "0") {
                    int count = atoi(cell.substr(0, 1).c_str());
                    int maxWeight = getMaxWeight(i, j, board);
                    if (count >= maxWeight) {
                        reactionOccurred = true; // A reaction occurred
                        string overloadedBy = cell.substr(1); // Get the color of the piece
                        int newCount = count - maxWeight; 
                        if(newCount == 0)
                            board[i][j] = "0"; // Remove the piece
                        else 
                            board[i][j] = to_string(newCount) + overloadedBy; // Update the count
                        claimOrbsOrthogonally(board, i, j, overloadedBy);
                    }
                }
            }
    }

    //cout << "Chain reaction completed." << endl;
}

void gameState::populateImmediateChildren(PLAYER player_type) {
    //cout << "Populating children for depth: " << depth << endl;

    string making_move_for = player_type == MAX_PLAYER ? playingFor : getOpponentColor(playingFor);
    for (int i = 0; i < board.size(); i++)
        for (int j = 0; j < board[i].size(); j++) {
            string cell = board[i][j];
            // Check if the cell is empty or contains a piece of the player
            if (cell == "0" || cell.find(making_move_for) != string::npos) {
                vector<vector<string>> newBoard = board;
                if (cell == "0")
                    newBoard[i][j] = "1"+ making_move_for;
                else {
                    int count = atoi(cell.substr(0, 1).c_str()); //can be atmost 1-3
                    count ++;
                    newBoard[i][j] = to_string(count) + making_move_for;
                }
                
                handleChainReaction(newBoard);

                int lastModifiedCellNo = i * newBoard[0].size() + j; // Convert 2D index to 1D index

                children.push_back(new gameState(newBoard, this, lastModifiedCellNo));                  
            }
        }
    //cout << "Children populated: " << children.size() << endl;
}