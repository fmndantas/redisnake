import { describe, test, expect } from 'bun:test';

import type { GameState } from 'server/game-loop';
import { updateFpsAwareEntity, speedLevel2UpdateRateInTicks, loop, updateSnake } from 'server/game-loop';

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

    // TEST: flake
    test('updates game state', () => {
        const [initialTick, updatedTick] = [59, 60];
        const initialSnake =
        {
            lastUpdatedAtTick: 0,
            updateIntervalInTicks: speedLevel2UpdateRateInTicks(0),
            entity: {
                points: [{ x: 0, y: 0 }],
                speedLevel: 0,
                dx: 0,
                dy: 0
            }
        };
        const updatedSnake = updateSnake(updatedTick, initialSnake);
        const initialGameState: GameState = {
            currentTick: initialTick,
            snakes: [initialSnake]
        }
        let result = loop(initialGameState);
        expect([result.currentTick, result.snakes[0]] as const).toEqual([updatedTick, updatedSnake])
    });
});
