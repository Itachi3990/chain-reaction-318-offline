#include <iostream>
#include <vector>
using namespace std;

enum PLAYER { MAX_PLAYER, MIN_PLAYER };

class gameState {
    public:
    static int (*currentHeuristic)(vector<vector<string>> &b, string playingFor);
    static string playingFor;
    vector<vector<string>> board;
    int score;
    vector<gameState*> children;
    int depth;
    int lastModifiedCell = -1;

    gameState(vector<vector<string>> b, gameState *p = nullptr, int lastModified = -1)
        : board(b), score(0), lastModifiedCell(lastModified) {
        if (p)
            depth = p->depth + 1;
        else
            depth = 0; // Root node
    }  

    void populateImmediateChildren(PLAYER player_type);

    ~gameState() {
        for (auto child : children)
            delete child;
    }
};

int minimax(vector<vector<string>> &initialBoard, int depth);
int minimaxHelper(gameState &state, int max_depth, int alpha, int beta);
string getOpponentColor(string playingFor);