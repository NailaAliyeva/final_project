import React from 'react';
import { Component } from 'react';
import Style from './list.module.scss';
import { GroupsComp } from '../croup/GroupsComp';
import { Route } from "react-router-dom";
import CoinsListComp from './coins-list/CoinsListComp';
import { BodyTopComp } from './BodyTopComp';
import { Search } from './search/Search';

export class ListComponent extends Component {
    state = {
        searchData: [],
        requestBody: {}
    }

    setSearchData = (data) => {
        this.setState({ searchData: data })
    }

    setRequestBody = async (data) => {
        await this.setState({ requestBody: data })
    }

    getRequestBody = () => {
        return this.state.requestBody;
    }

    render() {
        const  requestBody  = this.getRequestBody();
        const pathName = window.location.pathname.slice(1, window.location.pathname.length);

        return (
            <div className={Style.listContainer}>
                <BodyTopComp pathName={pathName.replace('list/', '')} setRequestBody={this.setRequestBody} setSearchData={this.setSearchData} />
                <Route exact path="/" component={GroupsComp} />
                <Route exact path="/list/:link">
                    <CoinsListComp requestBody={requestBody} />
                </Route>
            </div>
        );
    }
}