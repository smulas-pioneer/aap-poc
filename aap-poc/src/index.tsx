import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import * as reducers from './reducers';
import { configureStore, loadConfiguration } from 'app-support';
import {HashRouter as Router} from'react-router-dom';
import './styles/index.css';
import 'semantic-ui-css/semantic.min.css';
import './styles/hovereffect.css';
import { Root } from './components/Root';
import { loadDatabase } from './_db/data';
import { Loader } from 'semantic-ui-react';
import { setConfigJson } from "./actions/index";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import 'semantic-ui-css/semantic.min.css';
import './styles/hovereffect.css';
import './styles/bigone.css';
import './styles/bigone-gen.css';


import './styles/index.css';


const store = configureStore(reducers.default, /*startingState,*/ true);


loadConfiguration('config.json').then((_cfg) => {
  const cfg = _cfg as { APPNAME: string, CLIENT: string };
  store.dispatch(setConfigJson(cfg));

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
