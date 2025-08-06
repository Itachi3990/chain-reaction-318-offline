# Chain Reaction AI - Java Implementation

This is a Java port of the Chain Reaction AI originally written in C++. The AI uses minimax algorithm with alpha-beta pruning and various heuristics to make optimal moves in the Chain Reaction game.

## Files

- `ai.java` - Main class that handles command line arguments and coordinates the AI
- `GameState.java` - Represents a game state and handles child state generation
- `Minimax.java` - Implements the minimax algorithm with alpha-beta pruning
- `ChainReaction.java` - Handles chain reaction logic and board explosions
- `Heuristics.java` - Contains all evaluation heuristics
- `compile.bat` - Batch file to compile all Java files

## Compilation

```bash
javac *.java
```

Or use the provided batch file:

```bash
compile.bat
```

## Usage

```bash
java ai [depth] [heuristic] [color]
```

### Parameters

1. **depth** (optional, default: 5)

   - Search depth for the minimax algorithm
   - Higher values provide better moves but take longer

2. **heuristic** (optional, default: "tile_count")

   - `tile_count` - Counts tiles controlled by the player
   - `orb_count` - Counts total orbs controlled by the player
   - `orb_boundary_mix` - Combines orb count with boundary control
   - `boundary_control` - Prioritizes controlling boundary cells
   - `stack_control` - Weighs cells by their orb count squared
   - `random_move` - Makes random valid moves (depth automatically set to 1)

3. **color** (optional, default: "B")
   - `B` or `b` - Play for Blue
   - `R` or `r` - Play for Red

### Examples

```bash
# Default settings (depth=5, heuristic=tile_count, color=B)
java ai

# Custom depth and heuristic for Blue
java ai 7 orb_boundary_mix B

# Play for Red with boundary control heuristic
java ai 4 boundary_control R

# Random moves
java ai 1 random_move B
```

## Input/Output

### Input

The AI reads the current game state from `game_state.txt`. The file format is:

```
First line (ignored)
row1_cell1 row1_cell2 row1_cell3 ...
row2_cell1 row2_cell2 row2_cell3 ...
...
```

Where each cell is either:

- `0` - Empty cell
- `[count][color]` - Cell with orbs (e.g., `1R`, `2B`, `3R`)

### Output

The AI writes the resulting game state after making its move to `game_state.txt` and returns the move position as the exit code.

## Algorithm Details

### Minimax with Alpha-Beta Pruning

- **MAX_PLAYER**: The AI (playing for the specified color)
- **MIN_PLAYER**: The opponent
- Uses alpha-beta pruning for efficiency
- Evaluates board positions using the selected heuristic

### Game State Representation

- Board is represented as a 2D string array
- Each cell contains count + color (e.g., "2B" = 2 blue orbs)
- Empty cells are represented as "0"

### Chain Reaction Logic

- Cells explode when orb count reaches capacity:
  - Corner cells: capacity = 2
  - Edge cells: capacity = 3
  - Inner cells: capacity = 4
- Explosions send orbs to orthogonally adjacent cells
- Exploded orbs convert adjacent cells to the exploding player's color
- Chain reactions continue until no more cells can explode

## Heuristic Functions

1. **Tile Count**: Counts cells controlled by the player
2. **Orb Count**: Sums total orbs controlled by the player
3. **Boundary Control**: Gives extra weight to boundary cells
4. **Stack Control**: Weights cells by orb count squared
5. **Orb Boundary Mix**: Combines orb count with boundary control
6. **Random Move**: Returns constant value (for random play)

## Differences from C++ Version

The Java implementation maintains the same logic and algorithms as the C++ version but uses:

- Java collections (ArrayList, etc.) instead of STL containers
- Java I/O classes instead of C++ streams
- Function references (BiFunction) instead of C++ function pointers
- Java naming conventions (camelCase instead of snake_case)

## Exit Codes

The program returns the move position (1D index) as the exit code, or -1 on error.
