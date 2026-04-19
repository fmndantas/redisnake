import { describe, test, expect } from 'bun:test';

import type { Snake } from 'shared/types';
import * as snake from 'shared/snake';

describe('snake', () => {
    test('moves', () => {
        let initial: Snake = {
            points: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
        };
        let updated = snake.move(0, 1, initial);
        expect(updated.points).toHaveLength(3);
        expect(updated.points).toEqual([{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }])
    });
});
