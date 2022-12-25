import React from 'react';
import { Component } from 'react';
import Style from './body.module.scss';

export class FilterComp extends Component {
    state = {
        issuingCountryArr: [],
        compositionArr: [],
        qualityArr: [],
    }

    componentDidMount() {
        console.log("Filter request")
        fetch(`/filter`)
            .then(resp => {
                if (!resp.ok) {
                    throw Error(resp.statusText);
                }
                return resp.json();
            })
            .then(data => {
                console.log(data)
                let issuingCountry = data[0].map(obj => obj.issuing_country);
                let composition = data[1].map(obj => obj.composition);
                let quality = data[2].map(obj => obj.quality);
                this.setState({
                    issuingCountryArr: issuingCountry,
                    compositionArr: composition,
                    qualityArr: quality
                })
            })
            .catch(err => console.log(err))
    }

    contryHandler = (event) => {
        this.props.onChangeCountry(event.target.value)
    }

    compositionHandler = (event) => {
        this.props.onChangeComposition(event.target.value)
    }

    qualityHandler = (event) => {
        this.props.onChangeQuality(event.target.value)
    }

    priceFromHandler = (event) => {
        this.props.onChangePriceFrom(event.target.value)
    }

    priceToHandler = (event) => {
        this.props.onChangePriceTo(event.target.value)
    }

    yearFromHandler = (event) => {
        this.props.onChangeYearFrom(event.target.value)
    }

    yearToHandler = (event) => {
        this.props.onChangeYearTo(event.target.value)
    }

    render() {
        const { issuingCountry, composition, quality, priceFrom, priceTo, yearFrom, yearTo  } = this.props;

        let countryOptions = this.state.issuingCountryArr.map(item => <option key={item} value={item}>{item}</option>)
        let compositionOptions = this.state.compositionArr.map(item => <option key={item} value={item}>{item}</option>)
        let qualityOptions = this.state.qualityArr.map(item => <option key={item} value={item}>{item}</option>)
        return (
            <div className={Style.filterContainer}>
                <div className={Style.leftSideF}>
                    <label htmlFor="country-id">Issuing country</label>
                    <div>
                        <select name="" id="country-id" value={issuingCountry} onChange={this.contryHandler}>
                            <option value=""  style={{opacity: '0.5'}}>---</option>
                            {countryOptions}
                        </select>

                    </div>
                    <label htmlFor="metal-id">Metal</label>
                    <div>
                        <select name="" id="metal-id"  value={composition}  onChange={this.compositionHandler}>
                            <option value="" >---</option>
                            {compositionOptions}
                        </select>
                    </div>
                    <label htmlFor="quality-id">Quality of the coin</label>
                    <div>
                        <select name="" id="quality-id"  value={quality}  onChange={this.qualityHandler}>
                            <option value="" >---</option>
                            {qualityOptions}
                        </select>
                    </div>
                </div>
                <div className={Style.rightSideF}>
                    <label htmlFor="country-id">Price</label>
                    <div className={Style.fromToField}>
                        <span>from</span>
                        <input type="number" value={priceFrom} onChange={this.priceFromHandler} placeholder="---"/>
                        <span>to</span>
                        <input type="number" value={priceTo} onChange={this.priceToHandler} placeholder="---"/>
                    </div>
                    <label htmlFor="metal-id">Year of issue</label>
                    <div className={Style.fromToField}>
                        <span>from</span>
                        <input type="number" value={yearFrom} onChange={this.yearFromHandler}  placeholder="---"/>
                        <span>to</span>
                        <input type="number" value={yearTo} onChange={this.yearToHandler}  placeholder="---"/>
                    </div>
                </div>
            </div>
        );
    }
}