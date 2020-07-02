import { mocked } from 'ts-jest/utils';
import { webContents } from 'electron';
import forwardToRenderer from '../forwardToRenderer';

jest.unmock('../forwardToRenderer');

const mokedWebContents = mocked(webContents);

describe('forwardToRenderer', () => {
  it('should pass an action through to the main store', () => {
    const next = jest.fn();
    const action = { type: 'SOMETHING' };

    forwardToRenderer({} as any)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should forward any actions to the renderer', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
      },
    };
    const send = jest.fn();
    mokedWebContents.getAllWebContents.mockImplementation(() => [
      { send } as any,
    ]);

    forwardToRenderer({} as any)(next)(action);

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('redux-action', {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
        scope: 'local',
      },
    });
  });

  it('should ignore local actions', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        scope: 'local',
      },
    };
    const send = jest.fn();
    mokedWebContents.getAllWebContents.mockImplementation(() => [
      { send } as any,
    ]);

    forwardToRenderer({} as any)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
    expect(send).toHaveBeenCalledTimes(0);
  });
});
