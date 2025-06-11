#include <vector>
#include <string>
using namespace std;

int tileCount(vector<vector<string>> &board, string playingFor);
int orbCount(vector<vector<string>> &board, string playingFor);
int boundaryControl(vector<vector<string>> &board, string playingFor);
int stackControl(vector<vector<string>> &board, string playingFor);
int orb_boundary_mix(vector<vector<string>> &board, string playingFor);
int random_move(vector<vector<string>> &board, string playingFor);
