// 游戏方向枚举
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

// 坐标点接口
export interface Point {
  x: number
  y: number
}

// 蛇的节点
export type SnakeNode = Point

// 游戏状态枚举
export enum GameStatus {
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}