import React from 'react';
import { Component } from 'react';
import Style from './history.module.scss';
import { Link } from 'react-router-dom';

export class HistoryCoinComponent extends Component {

    addDataToHistory = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }
        const { id, name, shortDescription, aversImg } = this.props;

        const requestBody = {
            coinId: id,
            token: token,

            name: name,
            shortDescription: shortDescription,
            aversImg: aversImg
        }

        fetch('/history', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-type': 'application/json' }
        })
            .then(resp => {
                if (!resp.ok) {
                    throw Error(resp.statusText);
                }
            })
            .catch(error => {
                alert(error)
                console.log(error)
            })

    }

    render() {
        const { coinId, name, shortDescription, aversImg, backUrl } = this.props;
        console.log([coinId, name, shortDescription, aversImg, backUrl])
        let linkId = `/coin/${coinId}`;
        return (
            <div className={Style.coinContainer}>
                <div>
                    <div className={Style.imageDiv}>
                        <img src={aversImg} alt="Coin image" />
                    </div>
                </div>

                <div className={Style.infoDiv}>
                    <div className={Style.linkAndAddToCartDiv}>
                        <Link to={{
                            pathname: linkId,
                            state: {
                                backUrl: backUrl,
                            }
                        }} onClick={this.addDataToHistory}>{name}</Link>
                    </div>
                    <p>{shortDescription}</p>

                </div>
                <div>
                </div>
            </div>
        );
    }
}