import React from 'react';
import { Component } from 'react';
import Style from './group.module.scss';
import SVD from '../../img/list-img/South Vietnamese Dong_1.png'
import isk from '../../img/list-img/ISK_2.png'
import looney from '../../img/list-img/Looney_1.png'
import { SectionComp } from './SectionComp';


export class GroupsComp extends Component {
    render() {
        console.log(this.props);
        return (
            <div className={Style.groupsContainer}>
                <SectionComp url="/list/bullion" listName="Bullion coins" imgUrl={SVD} />
                <SectionComp url="/list/exclusive" listName="Exclusive coins" imgUrl={isk} />
                <SectionComp url="/list/commemorative" listName="Commemorative coins" imgUrl={looney} />
            </div>
        );
    }
}