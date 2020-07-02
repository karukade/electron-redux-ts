import { mocked } from 'ts-jest/utils';
import createAliasedAction from '../createAliasedAction';
import aliasRegistry from '../../registry/alias';

jest.unmock('../createAliasedAction');

const mockedAliasRegistry = mocked(aliasRegistry, true);

describe('createAliasedAction', () => {
  it('should register the action in the registry', () => {
    const fn = jest.fn();
    createAliasedAction('some', fn);

    expect(mockedAliasRegistry.set).toHaveBeenCalledTimes(1);
    expect(mockedAliasRegistry.set).toHaveBeenCalledWith('some', fn);
  });

  it('should return the aliased action', () => {
    const fn = jest.fn();
    const actionCreator = createAliasedAction('some', fn);

    expect(actionCreator).toBeInstanceOf(Function);

    const action = actionCreator(1, 2);

    expect(action).toEqual({
      type: 'ALIASED',
      payload: [1, 2],
      meta: {
        trigger: 'some',
      },
    });
  });
});
