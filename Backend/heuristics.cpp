#include <iostream>
#include <vector>
using namespace std;

int tileCount(vector<vector<string>> &board, string playingFor) {
    int score = 0; bool opponentFound = false;

    for (const auto &row : board)
        for (const auto &cell : row) {
            if (cell.find(playingFor) != string::npos)
                score++;
            else if (cell != "0") opponentFound = true; // Found a piece of the opponent
        }

    // If no opponent pieces are found, return a high score
    if(!opponentFound) return 50000;
           
    return score;
}

int orbCount(vector<vector<string>> &board, string playingFor) {
    int score = 0; bool opponentFound = false;

    for (const auto &row : board)
        for (const auto &cell : row) {
            if (cell.find(playingFor) != string::npos){
                // Extract the count of orbs from the cell
                int count = atoi(cell.substr(0, 1).c_str());
                score += count; // Add the count of orbs for the playingFor color
            }
            else if (cell != "0") opponentFound = true; // Found a piece of the opponent    
        }
    
    // If no opponent pieces are found, return a high score
    if(!opponentFound) return 50000;
    return score;
}

int boundaryControl(vector<vector<string>> &board, string playingFor) {
    int score = 0; bool opponentFound = false;

    int rowCnt = board.size();
    int colCnt = board[0].size();

    for (int i = 0; i < rowCnt; i++) {
        for (int j = 0; j < colCnt; j++) {
            string cell = board[i][j];
            if (cell.find(playingFor) != string::npos) {
                // Check if the cell is on the boundary
                if (i == 0 || i == rowCnt - 1)
                    score ++; // Increase score for boundary control
                if (j == 0 || j == colCnt - 1)
                    score ++; // Increase score for boundary control
                score++; // Increase score for non-boundary control
            }
            else if (cell != "0") {
                opponentFound = true; // Found a piece of the opponent
                // Check if the cell is on the boundary
                if (i == 0 || i == rowCnt - 1)
                    score --; // Decrease score for opponent's boundary control
                if (j == 0 || j == colCnt - 1)
                    score --; // Decrease score for opponent's boundary control
            }
        }
    }

    return score;
}

int stackControl(vector<vector<string>> &board, string playingFor) {
    int score = 0; bool opponentFound = false;

    int rowCnt = board.size();
    int colCnt = board[0].size();

    for (int i = 0; i < rowCnt; i++) {
        for (int j = 0; j < colCnt; j++) {
            string cell = board[i][j];
            if (cell.find(playingFor) != string::npos) {
                int count = atoi(cell.substr(0, 1).c_str());
                score += count*count; // Add the count of pieces for the playingFor color
            }
            else if (cell != "0")
                opponentFound = true; // Found a piece of the opponent

        }
    }

    // If no opponent pieces are found, return a high score
    if(!opponentFound) return 50000;

    return score;
}

int orb_boundary_mix(vector<vector<string>> &board, string playingFor) {
    int score = 0; bool opponentFound = false;

    int rowCnt = board.size();
    int colCnt = board[0].size();

    for (int i = 0; i < rowCnt; i++) {
        for (int j = 0; j < colCnt; j++) {
            string cell = board[i][j];
            if (cell.find(playingFor) != string::npos) {
                // Check if the cell is on the boundary
                if (i == 0 || i == rowCnt - 1)
                    score ++; // Increase score for boundary control
                if (j == 0 || j == colCnt - 1)
                    score ++; // Increase score for boundary control
                // Extract the count of orbs from the cell
                int count = atoi(cell.substr(0, 1).c_str());
                score += count; // Add the count of orbs for the playingFor color
            }
            else if (cell != "0") {
                opponentFound = true; // Found a piece of the opponent
                // Check if the cell is on the boundary
                if (i == 0 || i == rowCnt - 1)
                    score --; // Decrease score for opponent's boundary control
                if (j == 0 || j == colCnt - 1)
                    score --; // Decrease score for opponent's boundary control
            }
        }
    }

    return score;
}

int random_move(vector<vector<string>> &board, string playingFor) {
    return 1;
}