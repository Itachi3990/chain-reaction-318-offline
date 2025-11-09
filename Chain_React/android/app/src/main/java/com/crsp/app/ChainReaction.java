package com.crsp.app;
public class ChainReaction {

    public static int getMaxWeight(int i, int j, String[][] board) {
        int rowCnt = board.length;
        int colCnt = board[0].length;
        int maxWeight = 4; // Default max weight

        if (i == 0 || i == rowCnt - 1)
            maxWeight--;
        if (j == 0 || j == colCnt - 1)
            maxWeight--;

        return maxWeight;
    }

    public static void claimOrbsOrthogonally(String[][] board, int i, int j, String color) {
        int rowCnt = board.length;
        int colCnt = board[0].length;

        // Check up
        if (i > 0) {
            if (board[i - 1][j].equals("0")) {
                board[i - 1][j] = "1" + color;
            } else {
                int count = Integer.parseInt(board[i - 1][j].substring(0, 1));
                count++;
                board[i - 1][j] = count + color;
            }
        }

        // Check down
        if (i < rowCnt - 1) {
            if (board[i + 1][j].equals("0")) {
                board[i + 1][j] = "1" + color;
            } else {
                int count = Integer.parseInt(board[i + 1][j].substring(0, 1));
                count++;
                board[i + 1][j] = count + color;
            }
        }

        // Check left
        if (j > 0) {
            if (board[i][j - 1].equals("0")) {
                board[i][j - 1] = "1" + color;
            } else {
                int count = Integer.parseInt(board[i][j - 1].substring(0, 1));
                count++;
                board[i][j - 1] = count + color;
            }
        }

        // Check right
        if (j < colCnt - 1) {
            if (board[i][j + 1].equals("0")) {
                board[i][j + 1] = "1" + color;
            } else {
                int count = Integer.parseInt(board[i][j + 1].substring(0, 1));
                count++;
                board[i][j + 1] = count + color;
            }
        }
    }

    public static void handleChainReaction(String[][] board) {
        boolean reactionOccurred = true;

        while (reactionOccurred) {
            reactionOccurred = false;

            if (Minimax.isFullOfSameColor(board)) {
                return; // Game over condition
            }

            for (int i = 0; i < board.length; i++) {
                for (int j = 0; j < board[i].length; j++) {
                    String cell = board[i][j];
                    if (!cell.equals("0")) {
                        int count = Integer.parseInt(cell.substring(0, 1));
                        int maxWeight = getMaxWeight(i, j, board);
                        if (count >= maxWeight) {
                            reactionOccurred = true; // A reaction occurred
                            String overloadedBy = cell.substring(1); // Get the color of the piece
                            int newCount = count - maxWeight;
                            if (newCount == 0) {
                                board[i][j] = "0"; // Remove the piece
                            } else {
                                board[i][j] = newCount + overloadedBy; // Update the count
                            }
                            claimOrbsOrthogonally(board, i, j, overloadedBy);
                        }
                    }
                }
            }
        }
    }
}
