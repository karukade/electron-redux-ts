import { sum } from './module';

export const main = (func: typeof sum): number => func(1, 2);
