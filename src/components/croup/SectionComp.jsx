import React from 'react';
import { Component } from 'react';
import Style from './group.module.scss';
import {Link} from 'react-router-dom';

export class SectionComp extends Component {
    render() {
        return (
            <div className={Style.selectionContainer}>
                <h2>{this.props.listName}</h2>
                <Link to={this.props.url} onClick={()=> null}>Show all ></Link>
                <div className={Style.imgDiv}>
                    <img src={this.props.imgUrl} alt=""/>
                </div>
            </div>
        );
    }
}