import React from 'react';
import { Component } from 'react';
import Style from './body.module.scss';
import { ListComponent } from './ListComp';
import { Route, Switch } from "react-router-dom";
import { CoinInfoComp } from './coin-info/CoinInfoComp';
import CoinForm from './coin-form/CoinForm';
import RecycleBin from '../recycle-bin/RecycleBin';

export class BodyComp extends Component {
    render() {
        return (
            <div className={Style.mainContainer}>
                <Switch>
                    <Route exact path="/coin/:id" component={CoinInfoComp} />
                    <Route exact path ="/coin-form" component={CoinForm} />
                    <Route exact path ="/recycle-bin" component={RecycleBin} />
                    <ListComponent />
                </Switch>
            </div>
        );
    }
}