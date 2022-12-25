import React from 'react';
import { Component } from 'react';
import Style from './history.module.scss';
import { HistoryCoinComponent } from './HistoryCoinComponent';
import { showHistori } from '../../../store/header/actions';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

class History extends Component {

    state = {
        data: []
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const requestBody = {
            token: localStorage.getItem('token')
        }

        fetch('/get-history', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-type': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res.json();
            })
            .then(data => {
                this.setState({ data: data })
            })
            .catch(err => {
                alert(err);
                console.log(err);
            })
    }

    closeHistory = (evnt) => {
        if (evnt.target.matches('.history_historyContainer__6t4Hj')) {
            this.props.showHistori(false);
        }
    }

    render() {
        let { data } = this.state;
        data.sort((a, b) => {
            return new Date(b.addedData) - new Date(a.addedData);
        });


        let backUrl = window.location.pathname;

        let rows = data.map(obj => {
            
            let d = new Date(obj.addedData);
            let newD = dayjs(d);
            let getDate = newD.format('YYYY-MM-DD');
            let getTime = ` ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
            return (<>
                <HistoryCoinComponent key={obj.id} {...obj} backUrl={backUrl} />
                <div className={Style.dateContainer}>
                    <span>{getDate} {getTime}</span>
                </div>
            </>);
        })
        return (
            <div className={Style.historyContainer} onClick={this.closeHistory}>
                <div className={Style.historyMainBody}>
                    {rows}
                </div>
            </div>
        );
    }
}


const putStateToProps = (state) => {
    return {
        showHistory: state.header.showHistory
    };
}

const putPropsToState = {
    showHistori
}

export default connect(putStateToProps, putPropsToState)(History);