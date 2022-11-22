import { createStore } from 'redux';

const initialState = {
    counter: 0
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'clickCounter/incremented':
            return {
                ...state,
                counter: state.counter += 1
            };

        case 'clickCounter/decremented':
            return {
                ...state,
                counter: state.counter -= 1
            };
        default:
            return state;
    }
}

export const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true })
)

store.subscribe( () => {
    const state = store.getState();
    // save to localStorage, send to backend to save to DB
    console.log('Redux store change', state);
})