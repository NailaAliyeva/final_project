import React from 'react';
import { Component } from 'react';
import Style from './coinForm.module.scss';
import { Redirect } from 'react-router-dom';

export default class CoinForm extends Component {
    state = {
        backUrl: '',
        coinId: '',
        rootDirImg: 'http://localhost:3030/uploads',
        redirect: false,

        coinData: {
            id: '',
            name: null,
            shortDescription: null,
            description: null,
            issuingCountry: null,
            composition: null,
            quality: null,
            denomination: null,
            year: null,
            weight: null,
            price: null,
            aversImg: null,
            reversImg: null,
            coinType: 'Bullion',
            showCoin: 1
        }
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    componentDidMount = () => {
        if (this.props.history.location.state) {
            const { backUrl, coinId } = this.props.history.location.state;
            this.setState({ backUrl, coinId });

            if (coinId !== '') {
                this.getData(coinId);
            }
        }
    }

    getData(coinId) {
        fetch(`/coin/${coinId}`)
            .then(resp => {
                if (resp.status !== 404) {
                    return resp.json()
                }
            })
            .then(data => this.setState({ coinData: data }));
    }

    onChangeName = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            value = null;
        }
        this.setState({ coinData: { ...this.state.coinData, name: value } })
    }

    onChangeYear = (event) => {
        let value = event.target.value;
        this.setState({ coinData: { ...this.state.coinData, year: value } })
    }

    onChangePrice = (event) => {
        let value = event.target.value;
        this.setState({ coinData: { ...this.state.coinData, price: value } })
    }

    onChangeCountry = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            value = null;
        }
        this.setState({ coinData: { ...this.state.coinData, issuingCountry: value } })
    }

    onChangeMetal = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            value = null;
        }
        this.setState({ coinData: { ...this.state.coinData, composition: value } })
    }

    onChangeShortDescription = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            value = null;
        }
        this.setState({ coinData: { ...this.state.coinData, shortDescription: value } })
    }

    onChangeDescription = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            value = null;
        }
        this.setState({ coinData: { ...this.state.coinData, description: value } })
    }

    onChangeQuality = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            value = null;
        }
        this.setState({ coinData: { ...this.state.coinData, quality: value } })
    }

    onChangeWeight = (event) => {
        let value = event.target.value;
        this.setState({ coinData: { ...this.state.coinData, weight: value } })
    }

    onChangeType = (event) => {
        let value = event.target.value;
        this.setState({ coinData: { ...this.state.coinData, coinType: value } })
    }

    onChangeDenomination = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            value = null;
        }
        this.setState({ coinData: { ...this.state.coinData, denomination: value } })
    }

    sendReversImg = (event) => {
        const formData = new FormData();
        const photo = event.target;
        formData.append('photo', photo.files[0]);

        fetch(`/upload`, {
            method: 'POST',
            body: formData
        })
            .then(resp => resp.json())
            .then(data => this.setState({ coinData: { ...this.state.coinData, reversImg: `http://localhost:3030/uploads/new/${data.filename}` } }))
    }

    sendAversImg = (event) => {
        const formData = new FormData();
        const photo = event.target;
        formData.append('photo', photo.files[0]);

        fetch(`/upload`, {
            method: 'POST',
            body: formData
        })
            .then(resp => resp.json())
            .then(data => this.setState({ coinData: { ...this.state.coinData, aversImg: `http://localhost:3030/uploads/new/${data.filename}` } }))
    }

    sendDataToServer = (event) => {
        event.preventDefault();
        const requestBody = {
            token: localStorage.getItem('token'),
            coinData: this.state.coinData
        }

        fetch(`/coin`, {
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
                alert("Success");
                this.setRedirect();
            })
            .catch(error => {
                alert(error)
                console.log(error)
            })
    }

    render() {
        console.log(this.state.coinData)
        const { id, name, shortDescription, description, issuingCountry, composition, quality, denomination, year, weight, price, aversImg, reversImg, coinType } = this.state.coinData;
        const { backUrl, coinId } = this.state;
        return (
            <div className={Style.coinFormContainer}>
                {this.renderRedirect()}
                <h1>{coinId !== '' ? 'Coin data update' : 'Add coin'}</h1>
                <form onSubmit={this.sendDataToServer}>
                    <div className={Style.fomrSection}>
                        <label htmlFor="">Coin name</label>
                        <input type="text" placeholder='---' value={name} onChange={this.onChangeName} />
                        <label htmlFor="">Face value</label>
                        <input type="text" placeholder='---' value={denomination} onChange={this.onChangeDenomination} />
                        <label htmlFor="">Year of issue</label>
                        <input type="number" placeholder='---' value={year} onChange={this.onChangeYear} />
                        <label htmlFor="">Price</label>
                        <input type="number" step="0.01" placeholder='---' value={price} onChange={this.onChangePrice} />
                        <label htmlFor="">Country</label>
                        <input type="text" placeholder='---' value={issuingCountry} onChange={this.onChangeCountry} />
                        <label htmlFor="">Metal</label>
                        <input type="text" placeholder='---' value={composition} onChange={this.onChangeMetal} />
                    </div>
                    <div className={Style.fomrSection}>
                        <label htmlFor="">Short description</label>
                        <textarea name="" id="" placeholder='---' value={shortDescription} onChange={this.onChangeShortDescription}></textarea>
                        <label htmlFor="">Long description</label>
                        <textarea name="" id="" placeholder='---' value={description} onChange={this.onChangeDescription}></textarea>
                        <label htmlFor="">Quality of the coin</label>
                        <input type="text" placeholder='---' value={quality} onChange={this.onChangeQuality} />
                        <label htmlFor="">Weight</label>
                        <input type="number" step="any" placeholder='---' value={weight} onChange={this.onChangeWeight} />
                    </div>

                    <div className={Style.fomrSection}>
                        <div className={Style.coinsImagesContainer}>
                            <div className={Style.downloadImageDiv}>
                                <div className={Style.coinImageDiv}>
                                    {aversImg ? <img src={aversImg} alt="Avers image" /> : '+'}

                                </div>
                                <div>
                                    {/* <label for="profile_pic">Choose file to upload</label> */}
                                    <input type="file" id="avers_pic" name="avers_pic"
                                        onChange={this.sendAversImg}
                                        accept=".jpg, .jpeg, .png" />
                                </div>
                            </div>
                            <div className={Style.downloadImageDiv}>
                                <div className={Style.coinImageDiv}>
                                    {aversImg ? <img src={reversImg} alt="Reverse image" /> : '+'}
                                </div>
                                <input type="file" id="reverse_pic" name="reverse_pic"
                                    onChange={this.sendReversImg}
                                    accept=".jpg, .jpeg, .png" />
                            </div>
                        </div>

                        <label htmlFor="selectId">Type</label>
                        <select name="" id="selectId" value={coinType} onChange={this.onChangeType}>
                            <option value="Bullion">Bullion coins</option>
                            <option value="Exclusive">Exclusive coins</option>
                            <option value="Commemorative">Commemorative coins</option>
                        </select>
                        <div className={Style.buttonsDiv}>
                            <button type="submit" className={Style.submitButton}>Save</button>
                            <button type="button" className={Style.chancelButton}>Chancel</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}