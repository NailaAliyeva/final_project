import React from 'react';
import { Component } from 'react';
import { CoinComp } from './CoinComp';
import Pagination from '@material-ui/lab/Pagination';
import Style from './coinComponent.module.scss';
import { connect } from 'react-redux';
import { setCountRecycleBin } from '../../../store/header/actions';

class CoinsListComp extends Component {

    state = {
        data: [],
        requestBody: {},
        resultCount: 0,
        pages: 0,
        searchResult: false,
        limit: 6,
        page: 1,
    }

    componentDidMount() {
        const { requestBody } = this.props;
        this.setState({ requestBody: requestBody });

        this.getData(this.state.page);
    }

    componentWillReceiveProps() {
        const { requestBody } = this.props;
        this.setState({ requestBody: requestBody });

        this.getData(this.state.page);
    }

    getData(page) {
        const getUrl = window.location.pathname;
        const coorectUrl = getUrl.replace('/list', '');

        if (coorectUrl === '/search') {
            const { requestBody } = this.props;

            fetch(`/search`, {
                method: 'POST',
                body: JSON.stringify({
                    ...requestBody,
                    limit: this.state.limit,
                    page: page
                }),
                headers: { 'Content-type': 'application/json' }
            })
                .then(resp => resp.json())
                .then(data => {
                    let pages = Math.ceil(data.resultCount / this.state.limit);
                    this.setState({
                        data: data.result,
                        pages: pages,
                        resultCount: data.resultCount,
                        searchResult: true,
                    })
                })
        } else {
            fetch(`/list${coorectUrl}`, {
                method: 'POST',
                body: JSON.stringify({
                    limit: this.state.limit,
                    page: page,
                    showCoin: 1
                }),
                headers: { 'Content-type': 'application/json' }
            })
                .then(resp => resp.json())
                .then(data => {
                    let pages = Math.ceil(data[1] / this.state.limit);
                    this.setState({
                        data: data[0],
                        pages: pages
                    })
                })
        }

    }

    onChancePagination = (e, page) => {
        this.setState({ page: page });
        this.getData(page)
    }

    addToRecycleBin = (coinId) => {
        const conf = window.confirm("Are you sure?");
        if (!conf) {
            return;
        }
        
        const requestBody = {
            coinId: coinId,
            token: localStorage.getItem('token'),
            showCoin: 0,
        }

        fetch('/recycle-bin', {
            method: 'PUT',
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
                this.getData(this.state.page);
                this.props.setCountRecycleBin(Number(this.props.count) + 1)
            })
            .catch(error => {
                alert(error)
                console.log(error)
            })

    }

    render() {
        let elements = [];
        if (this.state.data && this.state.data.length !== 0) {
            elements = this.state.data.map(obj => <CoinComp key={obj.id} backUrl={window.location.pathname} {...obj} addToRecycleBin={this.addToRecycleBin} />);
        }
        return (
            <>
                {this.state.searchResult ? (
                    <div className={Style.searchInfoDiv}>
                        <div className={Style.searchInfoSection}>
                            <span>Found:</span>
                            <h3>{this.state.resultCount}</h3>
                        </div>
                    </div>) : null}

                {elements}
                <div className={Style.paginationContainer}>
                    <Pagination count={this.state.pages} color="primary" onChange={this.onChancePagination} />
                </div>
            </>
        );
    }
}

const putStateToProps = (state) => {
    return {
        count: state.header.count
    };
}

const putPropsToState = {
    setCountRecycleBin,
}

export default connect(putStateToProps, putPropsToState)(CoinsListComp);