package com.crsp.app;

import java.io.*;
import java.util.*;
import java.util.function.BiFunction;

public class Minimax {

    public static boolean isFullOfSameColor(String[][] board) {
        String color = "";
        for (String[] row : board) {
            for (String cell : row) {
                if (!cell.equals("0")) {
                    if (color.isEmpty()) {
                        color = cell.substring(1); // Get the color of the first piece
                    } else if (!cell.substring(1).equals(color)) {
                        return false; // Found a different color
                    }
                }
            }
        }
        return !color.isEmpty(); // Return true if at least one piece is present and all are of the same color
    }

    // returns move index
    public static int minimax(String[][] initialBoard, int depth,
            BiFunction<String[][], String, Integer> heuristic,
            String playingFor) {
        GameState initialState = new GameState(initialBoard);
        int maxUtil = minimaxHelper(initialState, depth, Integer.MIN_VALUE, Integer.MAX_VALUE,
                heuristic, playingFor);

        // loop through the children to find the ones with the max utility
        List<GameState> bestMoves = new ArrayList<>();
        for (GameState child : initialState.children) {
            if (child.score == maxUtil) {
                bestMoves.add(child);
            }
        }

        // randomly select one of the best moves
        Random random = new Random();
        int randomIndex = random.nextInt(bestMoves.size());
        GameState bestMove = bestMoves.get(randomIndex);

        // try (PrintWriter writer = new PrintWriter(new FileWriter("game_state.txt"))) {
        //     writer.println("AI Move:");
        //     for (String[] row : bestMove.board) {
        //         for (String cell : row) {
        //             writer.print(cell + " ");
        //         }
        //         writer.println();
        //     }
        // } catch (IOException e) {
        //     System.err.println("Error opening file for writing: " + e.getMessage());
        //     return -1; // Error code
        // }

        return bestMove.lastModifiedCell;
    }

    // with alpha-beta pruning
    public static int minimaxHelper(GameState state, int maxDepth, int alpha, int beta,
            BiFunction<String[][], String, Integer> heuristic,
            String playingFor) {
        if (state.depth == maxDepth) {
            state.score = heuristic.apply(state.board, playingFor);
            return state.score;
        }

        Player currentPlayer = (state.depth % 2) == 1 ? Player.MIN_PLAYER : Player.MAX_PLAYER;

        state.populateImmediateChildren(currentPlayer, playingFor);

        if (state.children.isEmpty()) {
            state.score = heuristic.apply(state.board, playingFor);
            return state.score;
        }

        if (currentPlayer == Player.MAX_PLAYER) {
            int maxEval = Integer.MIN_VALUE;
            for (GameState child : state.children) {
                int eval = minimaxHelper(child, maxDepth, alpha, beta, heuristic, playingFor);
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) {
                    break; // Beta cut-off
                }
            }
            state.score = maxEval;
            return maxEval;
        } else { // Min player
            int minEval = Integer.MAX_VALUE;
            for (GameState child : state.children) {
                int eval = minimaxHelper(child, maxDepth, alpha, beta, heuristic, playingFor);
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) {
                    break; // Alpha cut-off
                }
            }
            state.score = minEval;
            return minEval;
        }
    }
}
