package com.crsp.app;
import java.util.function.BiFunction;

public class ai {
    private static BiFunction<String[][], String, Integer> currentHeuristic = Heuristics::tileCount;
    private static String playingFor = "B"; // Blue, the player for whom ai is making the move

    public static int aiMove(String stateStr, int row, int depth, String heuristic, String haveToPlayFor) {
        try {
            // Set the heuristic function
            switch (heuristic) {
                case "tile_count":
                    currentHeuristic = Heuristics::tileCount;
                    break;
                case "orb_count":
                    currentHeuristic = Heuristics::orbCount;
                    break;
                case "orb_boundary_mix":
                    currentHeuristic = Heuristics::orb_boundary_mix;
                    break;
                case "boundary_control":
                    currentHeuristic = Heuristics::boundaryControl;
                    break;
                case "stack_control":
                    currentHeuristic = Heuristics::stackControl;
                    break;
                case "random_move":
                    currentHeuristic = Heuristics::random_move;
                    depth = 1;
                    break;
                default:
                    throw new IllegalArgumentException("Unknown heuristic: " + heuristic);
            }

            // Set the playing color
            if (haveToPlayFor.equalsIgnoreCase("B")) {
                playingFor = "B"; // Blue
            } else if (haveToPlayFor.equalsIgnoreCase("R")) {
                playingFor = "R"; // Red
            } else {
                throw new IllegalArgumentException("Unknown player color: " + haveToPlayFor);
            }

            // Parse the state string into a 2D board
            String[] cells = stateStr.split(",");
            int col = cells.length / row;
            String[][] board = new String[row][col];

            for (int i = 0; i < row; i++) {
                for (int j = 0; j < col; j++) {
                    board[i][j] = cells[i * col + j];
                }
            }

            // Get the AI move
            return Minimax.minimax(board, depth, currentHeuristic, playingFor);

        } catch (Exception e) {
            System.err.println("Error in aiMove: " + e.getMessage());
            return -1; // Error code
        }
    }
}
