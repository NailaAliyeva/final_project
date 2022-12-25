import React, { Component } from 'react';
import Style from './recycle.module.scss';
import RecycleBinSection from './RecycleBinSection';
import { connect } from 'react-redux';
import { setCountRecycleBinType } from '../../store/recycle-bin/actions';

class RecycleBin extends Component {
    componentDidMount() {
        this.getData();
    }

    getData() {
        fetch('/recycle-bin')
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res.json();
            })
            .then(data => {
                this.props.setCountRecycleBinType(data)
            })
            .catch(err => alert(err));
    }

    render() {
        const { commemorative, bullion, exclusive } = this.props;
        return (
            <div className={Style.recycleBinContainer}>
                <h1>Recycle Bin</h1>
                <div className={Style.sectionsContainer}>
                    <RecycleBinSection getData={this.getData} count={bullion} listName="Bullion coins" />
                    <RecycleBinSection getData={this.getData} count={exclusive} listName="Exclusive coins" />
                    <RecycleBinSection getData={this.getData} count={commemorative} listName="Commemorative coins" />
                </div>
            </div>
        );
    }
}


const putStateToProps = (state) => {
    return {
        commemorative: state.recycleBin.commemorative,
        bullion: state.recycleBin.bullion,
        exclusive: state.recycleBin.exclusive,
    }
}

const putPropsToState = {
    setCountRecycleBinType
}

export default connect(putStateToProps, putPropsToState)(RecycleBin);