import type { Snake } from './types';
import * as point from './point';

export const move = (dx: number, dy: number, snake: Snake): Snake => {
    return { points: snake.points.map(p => point.move(dx, dy, p)) };
}
