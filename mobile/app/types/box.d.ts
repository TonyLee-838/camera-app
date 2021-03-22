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


export type userState = 'far' | 'close' | 'offset' | 'ok' | 'no-person'