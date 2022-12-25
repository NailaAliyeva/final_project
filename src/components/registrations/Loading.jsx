import React, { Component }  from 'react';
import Style from './registration.module.scss';
import loading from '../../img/loading/loading.svg';

export class Loading extends Component {
    render() {
        return (
            <div className={Style.loadingDiv}>
                <img src={loading} alt="Loading gif" />
            </div>
        );
    }
}