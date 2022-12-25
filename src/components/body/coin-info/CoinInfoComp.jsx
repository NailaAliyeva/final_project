import React, { Component } from 'react';
import Style from './coinInfo.module.scss';
import { Link } from 'react-router-dom';

export class CoinInfoComp extends Component {
    state = {
        coinData: {},
    }

    componentDidMount() {
        this.getDataById();
    }

    getDataById() {
        const { match } = this.props;
        fetch(`${match.url}`)
            .then(res => res.json())
            .then(data => this.setState({ coinData: data }));
    }


    render() {
        let locationState = this.props.location.state;

        const { id, name, shortDescription, description, issuingCountry, composition, quality, denomination, year, weight, price, aversImg, reversImg } = this.state.coinData;
        let arr = String(description).split("\n");
        arr = arr.filter(text => text !== '');

        let textCoun = arr.map(text => <p key={text}>{text}</p>)
        return (
            <div className={Style.infoContainer}>
                <div className={Style.leftSide}>
                    <img src={aversImg} alt="Avers" />
                    <img src={reversImg} alt="Revers" />
                </div>
                <div className={Style.rightSide}>
                    <div className={Style.topDiv}>
                        <h3>{name}</h3>
                        <p>{shortDescription}</p>
                        {textCoun}
                    </div>
                    <div className={Style.bottomDiv}>
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Issuing Country</td>
                                        <td>{issuingCountry}</td>
                                    </tr>
                                    <tr>
                                        <td>Composition</td>
                                        <td>{composition}</td>
                                    </tr>
                                    <tr>
                                        <td>Quality</td>
                                        <td>{quality}</td>
                                    </tr>
                                    <tr>
                                        <td>Denomination</td>
                                        <td>{denomination}</td>
                                    </tr>
                                    <tr>
                                        <td>Year</td>
                                        <td>{year}</td>
                                    </tr>
                                    <tr>
                                        <td>Weight</td>
                                        <td>{weight} g</td>
                                    </tr>
                                    <tr>
                                        <td>Price</td>
                                        <td>{price}$</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div className={Style.buttonsDiv}>
                        <Link to={locationState.backUrl}>Back to the list</Link>
                    </div>
                </div>
            </div>
        );
    }
}