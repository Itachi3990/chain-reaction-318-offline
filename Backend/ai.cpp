#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <ctime>
#include "minimax.h"
#include "heuristics.h"

using namespace std;

ifstream file("game_state.txt");
    
int (*gameState::currentHeuristic)(vector<vector<string>> &b, string playingFor) = tileCount;
string gameState::playingFor = "B"; //Blue, the player for whom ai is making the move
int depth = 5; 

int makeMove() {
    vector<string> lineFromFile;

    string line;
    getline(file, line); // Read first line and ignore it

    while (getline(file, line)) 
        lineFromFile.push_back(line); // Read the rest of the lines
    
    file.close();
    
    vector<vector<string>> board;
    for (const auto& line : lineFromFile) {
        vector<string> row;
        stringstream ss(line);

        //space as delimiter
        string cell;
        while (ss >> cell) 
            row.push_back(cell);

        // Add the row to the game state
        board.push_back(row);
    }

    //print the game state
    cout << "Processing game state:" << endl;
    for (const auto& row : board) {
        for (const auto& cell : row)
            cout << cell << " ";
        cout << endl;
    }

    cout << endl;

    return minimax(board, depth);
 
}

// args: depth, heuristic, jar jonno move korbo tar color
int main(int argc, char* argv[]) {
    srand(time(0));

    depth = argv[1] ? atoi(argv[1]) : 5; // Default depth is 5 if not provided

    string heuristic = argv[2] ? argv[2] : "tile_count"; 

    if(heuristic == "tile_count")
        gameState::currentHeuristic = tileCount;
    else if(heuristic == "orb_count")
        gameState::currentHeuristic = orbCount;
    else if(heuristic == "orb_boundary_mix")
        gameState::currentHeuristic = orb_boundary_mix;
    else if (heuristic == "boundary_control")
        gameState::currentHeuristic = boundaryControl;
    else if (heuristic == "stack_control")
        gameState::currentHeuristic = stackControl;
    else if (heuristic == "random_move"){
        gameState::currentHeuristic = random_move;
        depth = 1;
    }
    
    else {
        cerr << "Unknown heuristic: " << heuristic << endl;
        return 1; // Exit with error code
    }

    string haveToPlayFor = argv[3] ? argv[3] : "B"; // Default to "B" if not provided
    if (haveToPlayFor == "B" || haveToPlayFor == "b") {
        gameState::playingFor = "B"; // Blue
    } else if (haveToPlayFor == "R" || haveToPlayFor == "r") {
        gameState::playingFor = "R"; // Red
    } else {
        cerr << "Unknown player color: " << haveToPlayFor << endl;
        return 1; // Exit with error code
    }

    // Check if the file is open
    if (!file.is_open()) {
        cerr << "Error opening file!" << endl;
        return 1;
    }

    int move_posn = makeMove();
    return move_posn; 
}