package com.crsp.app;
import java.util.Random;
public class Heuristics {

    public static int tileCount(String[][] board, String playingFor) {
        int score = 0;
        boolean opponentFound = false;

        for (String[] row : board) {
            for (String cell : row) {
                if (cell.contains(playingFor)) {
                    score++;
                } else if (!cell.equals("0")) {
                    opponentFound = true; // Found a piece of the opponent
                }
            }
        }

        // If no opponent pieces are found, return a high score
        if (!opponentFound)
            return 50000;

        return score;
    }

    public static int orbCount(String[][] board, String playingFor) {
        int score = 0;
        boolean opponentFound = false;

        for (String[] row : board) {
            for (String cell : row) {
                if (cell.contains(playingFor)) {
                    // Extract the count of orbs from the cell
                    int count = Integer.parseInt(cell.substring(0, 1));
                    score += count; // Add the count of orbs for the playingFor color
                } else if (!cell.equals("0")) {
                    opponentFound = true; // Found a piece of the opponent
                }
            }
        }

        // If no opponent pieces are found, return a high score
        if (!opponentFound)
            return 50000;
        return score;
    }

    public static int boundaryControl(String[][] board, String playingFor) {
        int score = 0;

        int rowCnt = board.length;
        int colCnt = board[0].length;

        for (int i = 0; i < rowCnt; i++) {
            for (int j = 0; j < colCnt; j++) {
                String cell = board[i][j];
                if (cell.contains(playingFor)) {
                    // Check if the cell is on the boundary
                    if (i == 0 || i == rowCnt - 1) {
                        score++; // Increase score for boundary control
                    }
                    if (j == 0 || j == colCnt - 1) {
                        score++; // Increase score for boundary control
                    }
                    score++; // Increase score for non-boundary control
                } else if (!cell.equals("0")) {
                    // Check if the cell is on the boundary
                    if (i == 0 || i == rowCnt - 1) {
                        score--; // Decrease score for opponent's boundary control
                    }
                    if (j == 0 || j == colCnt - 1) {
                        score--; // Decrease score for opponent's boundary control
                    }
                }
            }
        }

        return score;
    }

    public static int stackControl(String[][] board, String playingFor) {
        int score = 0;
        boolean opponentFound = false;

        for (String[] row : board) {
            for (String cell : row) {
                if (cell.contains(playingFor)) {
                    int count = Integer.parseInt(cell.substring(0, 1));
                    score += count * count; // Add the count of pieces for the playingFor color
                } else if (!cell.equals("0")) {
                    opponentFound = true; // Found a piece of the opponent
                }
            }
        }

        // If no opponent pieces are found, return a high score
        if (!opponentFound)
            return 50000;

        return score;
    }

    public static int orb_boundary_mix(String[][] board, String playingFor) {
        int score = 0;

        int rowCnt = board.length;
        int colCnt = board[0].length;

        for (int i = 0; i < rowCnt; i++) {
            for (int j = 0; j < colCnt; j++) {
                String cell = board[i][j];
                if (cell.contains(playingFor)) {
                    // Check if the cell is on the boundary
                    if (i == 0 || i == rowCnt - 1) {
                        score++; // Increase score for boundary control
                    }
                    if (j == 0 || j == colCnt - 1) {
                        score++; // Increase score for boundary control
                    }
                    // Extract the count of orbs from the cell
                    int count = Integer.parseInt(cell.substring(0, 1));
                    score += count; // Add the count of orbs for the playingFor color
                } else if (!cell.equals("0")) {
                    // Check if the cell is on the boundary
                    if (i == 0 || i == rowCnt - 1) {
                        score--; // Decrease score for opponent's boundary control
                    }
                    if (j == 0 || j == colCnt - 1) {
                        score--; // Decrease score for opponent's boundary control
                    }
                }
            }
        }

        return score;
    }

    public static int random_move(String[][] board, String playingFor) {
        return 1;
    }
}
