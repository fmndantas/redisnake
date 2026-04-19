import type { Point } from './types';

export const move = (dx: number, dy: number, point: Point): Point => {
    return { x: point.x + dx, y: point.y + dy };
}

