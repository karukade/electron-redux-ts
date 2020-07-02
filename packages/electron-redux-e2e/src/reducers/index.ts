import { Reducer } from 'redux';

const counter: Reducer<number, { type: string }> = (state, action): number => {
  if (typeof state === 'undefined') {
    return 0;
  }

  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

export default counter;
