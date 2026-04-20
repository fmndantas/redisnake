import type { Snake, SpeedLevel } from 'shared/types';
import * as SnakeFunctions from 'shared/snake';

export type Tick = number;

interface FpsAwareEntity<T> {
    lastUpdatedAtTick: Tick;
    updateIntervalInTicks: number;
    entity: T;
}

export const speedLevel2UpdateRateInTicks = (speedLevel: SpeedLevel): number => {
    let rate = [60, 30, 20, 15, 12, 10, 9, 8, 7, 6][speedLevel];
    return rate === undefined ? 60 : rate;
}

export const updateFpsAwareEntity = <T>(
    updateFn: (value: T) => T,
    currentTick: Tick,
    fpsAwareEntity: FpsAwareEntity<T>
): FpsAwareEntity<T> => {
    if (currentTick - fpsAwareEntity.lastUpdatedAtTick != fpsAwareEntity.updateIntervalInTicks)
        return fpsAwareEntity;
    else
        return {
            lastUpdatedAtTick: currentTick,
            updateIntervalInTicks: fpsAwareEntity.updateIntervalInTicks,
            entity: updateFn(fpsAwareEntity.entity)
        };
};

const updateSnake = (currentTick: Tick, fpsSnake: FpsAwareEntity<Snake>) => updateFpsAwareEntity<Snake>(
    SnakeFunctions.move,
    currentTick,
    fpsSnake
);

export interface GameState {
    currentTick: number;
    snakes: FpsAwareEntity<Snake>[]
};

export const loop = (state: GameState): GameState => {
    return {
        currentTick: state.currentTick + 1,
        snakes: state.snakes.map(s => updateSnake(state.currentTick, s))
    };
};
