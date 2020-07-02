import { createStore, applyMiddleware, Store } from 'redux';
import {
  forwardToMain,
  replayActionRenderer,
  getInitialStateRenderer,
  createAliasedAction,
} from 'electron-redux';

import { ipcRenderer } from 'electron';

import reducers from '../reducers';

let store: Store;

// setup store
async function setupStore() {
  const initialState = await getInitialStateRenderer(ipcRenderer);
  const createdStore = createStore(
    reducers,
    initialState,
    applyMiddleware(forwardToMain(ipcRenderer))
  );
  replayActionRenderer(ipcRenderer, createdStore);
  return createdStore;
}

// set up renderer
function mount() {
  (document.getElementById('app') as HTMLElement).innerHTML = `
    <p>
      Clicked: <span id="value">0</span> times
      <button id="increment">+</button>
      <button id="decrement">-</button>
      <button id="incrementAliased">Increment (aliased)</button>
    </p>
  `;

  document.getElementById('increment')?.addEventListener('click', () => {
    store.dispatch({ type: 'INCREMENT' });
  });

  document.getElementById('decrement')?.addEventListener('click', () => {
    store.dispatch({ type: 'DECREMENT' });
  });

  document.getElementById('incrementAliased')?.addEventListener('click', () => {
    store.dispatch(
      createAliasedAction('INCREMENT_ALIASED', () => ({ type: 'INCREMENT' }))()
    );
  });
}

function renderValue() {
  (document.getElementById(
    'value'
  ) as HTMLElement).innerHTML = store.getState().toString();
}

async function init() {
  store = await setupStore();
  mount();
  renderValue();
  store.subscribe(renderValue);
}

init();
