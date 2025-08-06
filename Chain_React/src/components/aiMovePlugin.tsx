 import { registerPlugin } from '@capacitor/core';

export interface AiMovePlugin {
  makeMove(options: { stateStr: string, rows: number, depth: number, heuristic: string, playingFor: string }): Promise<{ aiMove: number }>;
}

const AiMove = registerPlugin<AiMovePlugin>('AiMove');

export default AiMove;