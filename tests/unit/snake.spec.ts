import { describe, test, expect } from 'bun:test';

import type { Snake } from 'shared/types';
import * as SnakeFunctions from 'shared/snake';

describe('snake', () => {
    test('moves', () => {
        let initial: Snake = {
            points: [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 }
            ],
            speedLevel: 0,
            dx: 0,
            dy: 1
        };
        let updated = SnakeFunctions.move(initial);
        expect(updated.points).toHaveLength(3);
        expect(updated.points).toEqual([{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }])
    });
});
