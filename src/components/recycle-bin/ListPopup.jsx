import React, { Component } from 'react';
import Style from './recycle.module.scss';
import { BinCoinComp } from './BinCoinComp';

export default class ListPopup extends Component {
    render() {
        const { data } = this.props;
        let rows = [];
        if (data) {
            rows = data.map(obj => (<BinCoinComp key={obj.id} data={obj} restoreByIdHndlr={this.props.restoreByIdHndlr} />))
        }
        
        return (
            <div className={Style.listPopupContainer} onClick={this.props.closeListPopup}>
                <div className={Style.listContainer}>
                    {rows}
                </div>
            </div>
        );
    }
}