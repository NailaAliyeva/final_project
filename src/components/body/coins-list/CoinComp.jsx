import React from 'react';
import { Component } from 'react';
import Style from './coinComponent.module.scss';
import { Link } from 'react-router-dom';
// import addToCart from '../../../img/add-to-cart/add-to-cart.svg';
import deleteIcon from '../../../img/delete/delete-icon.svg'
import editIcon from '../../../img/edit/edit.svg'

export class CoinComp extends Component {

    deleteButtonHandler = (coinId) => {
        this.props.addToRecycleBin(coinId);
    }

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
                return resp.json();
            })
            .then(data => {
            })
            .catch(error => {
                alert(error)
                console.log(error)
            })
    }

    // addToCollection = () => {
    //     const token = localStorage.getItem('token');

    //     if (!token) {
    //         return;
    //     }

    //     const { id, name, shortDescription, aversImg, backUrl } = this.props;
    //     alert(id)

    //     const requestBody = {
    //         coinId: id,
    //         token: token,

    //         name: name,
    //         shortDescription: shortDescription,
    //         aversImg: aversImg
    //     }

    //     fetch('/collection', {
    //         method: 'POST',
    //         body: JSON.stringify(requestBody),
    //         headers: { 'Content-type': 'application/json' }
    //     })
    //         .then(res => {
    //             if (!res.ok) {
    //                 throw Error(res.statusText);
    //             }

    //             return res.json();
    //         })
    //         .then(data => {
    //         })
    //         .catch(err => {
    //             console.log(err)
    //             alert(err)
    //         })
    // }

    render() {
        const adminTools = localStorage.getItem('admin');
        const { id, name, shortDescription, aversImg, backUrl } = this.props;

        let linkId = `/coin/${id}`;
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

                        {adminTools === 'true' ? (<div className={Style.adminToolsDiv}>
                            <Link to={{
                                pathname: "/coin-form",
                                state: {
                                    backUrl: '/',
                                    coinId: id
                                }
                            }} ><img src={editIcon} alt="Edit icon" /></Link>

                            <img src={deleteIcon} alt="Delete icon" onClick={() => this.deleteButtonHandler(id)} />
                        </div>) : null
                            // (<div className={Style.addToCartDiv} onClick={this.addToCollection}>
                            //     <img src={addToCart} alt="Add to cart" title="Add to cart" />
                            // </div>)
                        }

                    </div>
                    <p>{shortDescription}</p>

                </div>
                <div>
                </div>
            </div>
        );
    }
}