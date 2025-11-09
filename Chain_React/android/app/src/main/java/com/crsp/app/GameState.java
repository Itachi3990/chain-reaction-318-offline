package com.crsp.app;

import java.util.*;
import java.util.function.BiFunction;

enum Player {
    MAX_PLAYER, MIN_PLAYER
}

public class GameState {
    public String[][] board;
    public int score;
    public List<GameState> children;
    public int depth;
    public int lastModifiedCell = -1;

    public GameState(String[][] board, GameState parent, int lastModified) {
        this.board = copyBoard(board);
        this.score = 0;
        this.lastModifiedCell = lastModified;
        this.children = new ArrayList<>();

        if (parent != null) {
            this.depth = parent.depth + 1;
        } else {
            this.depth = 0; // Root node
        }
    }

    public GameState(String[][] board) {
        this(board, null, -1);
    }

    private String[][] copyBoard(String[][] original) {
        String[][] copy = new String[original.length][];
        for (int i = 0; i < original.length; i++) {
            copy[i] = original[i].clone();
        }
        return copy;
    }

    public void populateImmediateChildren(Player playerType, String playingFor) {
        String makingMoveFor = playerType == Player.MAX_PLAYER ? playingFor : getOpponentColor(playingFor);

        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                String cell = board[i][j];
                // Check if the cell is empty or contains a piece of the player
                if (cell.equals("0") || cell.contains(makingMoveFor)) {
                    String[][] newBoard = copyBoard(board);

                    if (cell.equals("0")) {
                        newBoard[i][j] = "1" + makingMoveFor;
                    } else {
                        int count = Integer.parseInt(cell.substring(0, 1)); // can be at most 1-3
                        count++;
                        newBoard[i][j] = count + makingMoveFor;
                    }

                    ChainReaction.handleChainReaction(newBoard);

                    int lastModifiedCellNo = i * newBoard[0].length + j; // Convert 2D index to 1D index

                    children.add(new GameState(newBoard, this, lastModifiedCellNo));
                }
            }
        }
    }

    private String getOpponentColor(String playingFor) {
        return playingFor.equals("R") ? "B" : "R";
    }
}
