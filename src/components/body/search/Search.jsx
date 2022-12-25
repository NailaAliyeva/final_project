import React from 'react';
import { Component } from 'react';
import { CoinComp } from '../coins-list/CoinComp';

export class Search extends Component {
    render() {
        const { result, resultCount } = this.props.searchData;

        let elements = [];
        if (result) {
            elements = result.map(obj => <CoinComp key={obj.id} backUrl='/search' {...obj} />);
        }
        return (
            <>
                <div style={{ width: '100%' }}><h3>Search results ({resultCount || 0})</h3></div>
                {elements}
            </>
        );
    }
}