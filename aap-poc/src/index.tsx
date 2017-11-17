import * as React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import { Provider } from 'react-redux';
import * as reducers from './reducers';
import { configureStore, HashRouter as Router } from 'app-support';

import './styles/index.css';
import 'semantic-ui-css/semantic.min.css';
import './styles/hovereffect.css';
import { Root } from './components/Root';
import { AppState } from './reducers';

const startingState: any = {}

const store = configureStore(reducers.default, /*startingState,*/ true);
render(
    <Provider store={store}>
        <Router >
            <Root />
        </Router>
    </Provider>,
    document.getElementById('root')
);