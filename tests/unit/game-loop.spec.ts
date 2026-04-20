import { describe, test, expect } from 'bun:test';

import { updateFpsAwareEntity } from 'server/game-loop';

describe('game loop', () => {
    test('don\'t updates fps aware entity on the wrong tick', () => {
        const entity = {
            lastUpdatedAtTick: 0,
            updateIntervalInTicks: 60,
            entity: 1
        };
        let result = updateFpsAwareEntity<number>(x => x + 1, 59, entity);
        expect(result.lastUpdatedAtTick).toEqual(0);
        expect(result.entity).toEqual(1);
    });

    test('updates fps aware entity in the right tick', () => {
        const entity = {
            lastUpdatedAtTick: 0,
            updateIntervalInTicks: 60,
            entity: 1
        };
        let result = updateFpsAwareEntity<number>(x => x + 1, 60, entity);
        expect(result.lastUpdatedAtTick).toEqual(60);
        expect(result.entity).toEqual(2);
    });
});
