import { mocked } from 'ts-jest/utils';
import { ipcRenderer } from 'electron';
import forwardToMain, { forwardToMainWithParams } from '../forwardToMain';
import validateAction from '../../helpers/validateAction';

jest.unmock('../forwardToMain');

const mockedValidateAction = mocked(validateAction);

describe('forwardToMain', () => {
  beforeEach(() => {
    mockedValidateAction.mockReturnValue(true);
  });

  it("should pass an action through if it doesn't pass validation (FSA)", () => {
    const next = jest.fn();
    // thunk action
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const action = () => {};
    mockedValidateAction.mockReturnValue(false);

    forwardToMain(ipcRenderer)({} as any)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass an action through if it starts with @@', () => {
    const next = jest.fn();
    const action = { type: '@@SOMETHING' };

    forwardToMain(ipcRenderer)({} as any)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass an action through if it starts with redux-form', () => {
    const next = jest.fn();
    const action = { type: 'redux-form' };

    forwardToMain(ipcRenderer)({} as any)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass an action through if the scope is local', () => {
    const next = jest.fn();
    const action = {
      type: 'MY_ACTION',
      meta: {
        scope: 'local',
      },
    };

    forwardToMain(ipcRenderer)({} as any)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should forward any actions to the main process', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
      },
    };

    forwardToMain(ipcRenderer)({} as any)(next)(action);

    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);

    expect(next).toHaveBeenCalledTimes(0);
  });
});

describe('forwardToMainWithParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedValidateAction.mockReturnValue(true);
  });

  it('should forward an action through if it starts with @@', () => {
    const next = jest.fn();
    const action = { type: '@@SOMETHING' };

    forwardToMainWithParams()(ipcRenderer)({} as any)(next)(action);

    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);

    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should forward an action through if it starts with redux-form', () => {
    const next = jest.fn();
    const action = { type: 'redux-form' };

    forwardToMainWithParams()(ipcRenderer)({} as any)(next)(action);

    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);

    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should pass an action through if it is blacklisted', () => {
    const next = jest.fn();
    const action = { type: '@@SOMETHING' };

    forwardToMainWithParams({ blacklist: [/^@@/] })(ipcRenderer)({} as any)(
      next
    )(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
});
