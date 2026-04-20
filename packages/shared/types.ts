export type SpeedLevel = number;

export interface Point {
    x: number,
    y: number
}

export interface Snake {
    points: Point[]
    speedLevel: SpeedLevel
    dx: number,
    dy: number
}
