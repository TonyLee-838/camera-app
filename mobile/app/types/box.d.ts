export type BoxPosition = Array<number>

export interface regulatedBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type boxPoints = {
    x: number;
    y: number;
}[]

export interface SimilarImage {
  width: number;
  height: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}


export type UserStatus = 'tooFar' | 'tooClose' | 'tooRight' | 'tooLeft' | 'fine' | 'none' | 'tooHigh' | 'tooLow'

// export enum SUGGESTION_MESSAGE {
//   far = '请移近一点',
//   close = '请移远一点',
//   right = '请向左移动',
//   left = '请向右移动',
//   fine = '完美',
//   none = '没有检测到人像'
// }
