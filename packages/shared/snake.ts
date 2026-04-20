import type { Snake } from './types';
import * as point from './point';

export const move = (snake: Snake): Snake => {
    return { ...snake, points: snake.points.map(p => point.move(snake.dx, snake.dy, p)) };
}
