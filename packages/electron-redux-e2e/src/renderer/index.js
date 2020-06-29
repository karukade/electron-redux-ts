const { createStore, applyMiddleware } = require('redux');
const {
  forwardToMain,
  replayActionRenderer,
  getInitialStateRenderer,
  createAliasedAction,
} = require('electron-redux');
const { ipcRenderer } = require('electron');
const reducers = require('../reducers');
let store;

// setup store
async function setupStore() {
  const initialState = await getInitialStateRenderer(ipcRenderer);
  const store = createStore(reducers, initialState, applyMiddleware(forwardToMain(ipcRenderer)));
  replayActionRenderer(ipcRenderer, store);
  return store;
}

// set up renderer
function mount() {
  document.getElementById('app').innerHTML = `
    <p>
      Clicked: <span id="value">0</span> times
      <button id="increment">+</button>
      <button id="decrement">-</button>
      <button id="incrementAliased">Increment (aliased)</button>
    </p>
  `;

  document.getElementById('increment').addEventListener('click', () => {
    store.dispatch({ type: 'INCREMENT' });
  });

  document.getElementById('decrement').addEventListener('click', () => {
    store.dispatch({ type: 'DECREMENT' });
  });

  document.getElementById('incrementAliased').addEventListener('click', () => {
    store.dispatch(createAliasedAction('INCREMENT_ALIASED', () => ({ type: 'INCREMENT' }))());
  });
}

function renderValue() {
  document.getElementById('value').innerHTML = store.getState().toString();
}

async function init() {
  store = await setupStore();
  mount();
  renderValue();
  store.subscribe(renderValue);
}

init();
