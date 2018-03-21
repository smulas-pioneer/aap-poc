import * as React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import { Provider } from 'react-redux';
import * as reducers from './reducers';
import { configureStore, HashRouter as Router, loadConfiguration } from 'app-support';

import './styles/index.css';
import 'semantic-ui-css/semantic.min.css';
import './styles/hovereffect.css';
import { Root } from './components/Root';
import { AppState } from './reducers';
import { loadDatabase } from './_db/data';
import { Loader } from 'semantic-ui-react';

const startingState: any = {}

const store = configureStore(reducers.default, /*startingState,*/ true);

loadConfiguration('config.json').then((cfg: { APPNAME: string }) => {

    render(
        <div style={{ opacity: 0.9, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'whitesmoke' }}>
            <Loader style={{ opacity: 1 }} active size="huge">initializing..</Loader>
        </div>,
        document.getElementById('root')
    );



    loadDatabase(cfg.APPNAME).then(r => {
        render(
            <Provider store={store}>
                <Router>
                    <Root />
                </Router>
            </Provider>,
            document.getElementById('root')
        );
    });
});