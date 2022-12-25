import React from 'react';
import HeaderComp from './components/header/HeaderComp';
import { BodyComp } from './components/body/BodyComp';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers'
// import { headerReducer } from './store/header/reducers'


const store = createStore(rootReducer);

function App() {
  return (
    <Provider store={store}>
      <HeaderComp />
      <div className="App">
        <BodyComp />
      </div>
    </Provider>
  );
}

export default App;
