import React, { Component } from 'react';
import Style from './recycle.module.scss';
import ListPopup from './ListPopup';
import { connect } from 'react-redux';
import { setCountRecycleBin } from '../../store/header/actions';
import { setCountRecycleBinType } from '../../store/recycle-bin/actions';
import recycleIcon from '../../img/delete/recycle-icon.svg';

class RecycleBinSection extends Component {
    state = {
        listCount: 0,
        data: [],
        listPopup: false,
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        let listName = this.props.listName.toLowerCase().split(' ')[0];

        const requestBody = {
            limit: 100,
            page: 1,
            showCoin: 0,
        }

        fetch(`/list/${listName}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-type': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText)
                }

                return res.json();
            })
            .then(data => {
                this.setState({ data: data[0] });
            })
            .catch(err => alert(err))
    }

    openListPopup = () => {
        this.setState({ listPopup: true });
    }

    closeListPopup = (evnt) => {
        console.log(evnt.target)        
        if (evnt.target.matches('.recycle_listPopupContainer__11X51')) {
            this.setState({ listPopup: false })
            window.location.reload(false);
        }
    }

    restoreByIdHndlr = (coinId) => {
        const conf = window.confirm("Are you sure?");
        if (!conf) {
            return;
        }
        const requestBody = {
            coinId: coinId,
            token: localStorage.getItem('token'),
            showCoin: 1,
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
                this.getData();
                // this.props.setCountRecycleBinType()
                // this.props.getData();

                this.props.setCountRecycleBin(Number(this.props.binCount) - 1);
            })
            .catch(error => {
                alert(error)
                console.log(error)
            })
    }

    restoreAllHndlr = () => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        let listName = this.props.listName.toLowerCase().split(' ')[0];

        const requestBody = {
            token: localStorage.getItem("token"),
            listName: listName
        }


        fetch(`/restore`, {
            method: 'PUT',
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
                window.location.reload(false);
            })
            .catch(err => alert(err))
    }

    deleteAllHndlr = () => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        let listName = this.props.listName.toLowerCase().split(' ')[0];

        const requestBody = {
            token: localStorage.getItem("token"),
            listName: listName
        }

        fetch(`/delete-all`, {
            method: 'DELETE',
            body: JSON.stringify(requestBody),
            headers: {'Content-type': 'application/json'}
        })
        .then(res => {
            if (!res.ok) {
                throw Error(res.statusText);
            }
            return res.json();
        })
        .then(data => {
            window.location.reload(false);
        })
        .catch(err => alert(err))

    }

    render() {
        const { count } = this.props;
        const { listName } = this.props;
        return (
            <div className={Style.recycleBinSection}>
                <div>
                    <h2>{listName}</h2>
                </div>
                <div className={Style.crcleDiv}>
                    <h2>{count}</h2>
                    <hr />
                    <img src={recycleIcon} alt="Recycle"/>
                </div>
                <div className={Style.buttonsDiv}>
                    <button onClick={this.openListPopup} className={Style.listButton}>List</button>
                    <button onClick={this.restoreAllHndlr} className={Style.restoreButton}>Restore All</button>
                    <button onClick={this.deleteAllHndlr} className={Style.deleteButton}>Delete All</button>
                </div>

                {this.state.listPopup ? <ListPopup restoreByIdHndlr={this.restoreByIdHndlr} data={this.state.data} closeListPopup={this.closeListPopup} /> : null}
            </div>
        );
    }
}

const putStateToProps = (state) => {
    return {
        binCount: state.header.count,

        commemorative: state.recycleBin.commemorative,
        bullion: state.recycleBin.bullion,
        exclusive: state.recycleBin.exclusive,
    };
}

const putPropsToState = {
    setCountRecycleBin,
    setCountRecycleBinType,
}

export default connect(putStateToProps, putPropsToState)(RecycleBinSection);