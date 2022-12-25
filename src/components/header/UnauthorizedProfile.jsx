import React from 'react';
import { Component } from 'react';
import Style from './header.module.scss'

class UnauthorizedProfile extends Component {
    render() {
        return (
            <>
                <div><p>Welcome to the rare coins Site</p></div>
                <hr />
                <div className={Style.registerButtons}>
                    {/* <button className={Style.sgnIn} onClick={() => this.props.onClickHandler('signUp')}>Sign up</button>
                    <button className={Style.sgnOut} onClick={() => this.props.onClickHandler('signIn')}>Sign in</button> */}
                    <button className={Style.sgnOut} onClick={() => this.props.onClickHandler('signIn')}>Admin Panel</button>
                </div>
            </>
        );
    }
}

export default UnauthorizedProfile;