import { describe, test, expect } from 'bun:test';

import type { Point } from 'shared/types';
import * as point from 'shared/point';

describe('snake', () => {
    test('moves', () => {
        let initial: Point = {
            x: 0,
            y: 0,
        };
        let updated = point.move(1, 0, initial);
        expect(updated.x).toBe(1);
        expect(updated.y).toBe(0);
    });
});
