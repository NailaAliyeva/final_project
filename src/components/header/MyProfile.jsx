import React from 'react';
import { Component } from 'react';
import Style from './header.module.scss'
import UnauthorizedProfile from './UnauthorizedProfile';
import AuthorizedProfile from './AuthorizedProfile';

export class RegisterComp extends Component {
    render() {
        const login = localStorage.getItem('login');
        let checkAuthorize = false;
        if(login && login !== '') {
            checkAuthorize = true;
        }
        return (
            <div className={Style.registerPopup}>
                {checkAuthorize ? <AuthorizedProfile /> : <UnauthorizedProfile {...this.props}/> }
                
                {/* <div>Setting</div> */}
            </div>
        );
    }
} 