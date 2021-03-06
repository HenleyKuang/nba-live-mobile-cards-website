import React from 'react';
import ReactDOM from 'react-dom';

import {
    HashRouter,
    Route
  } from 'react-router-dom';

import DatabaseHTML from './database';
import CardProfileHTML from './card-profile';
import CardCompareHTML from './compare-tool';

import './index.css';
import 'react-table/react-table.css';
// import 'bootstrap/dist/css/bootstrap.3.3.7.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <HashRouter>
        <div>
            <Route exact path="/" component={DatabaseHTML} />
            <Route path="/card-profile" component={CardProfileHTML} />
            <Route path="/compare" component={CardCompareHTML} />
        </div>
    </HashRouter >,
    document.getElementById('root')
);
