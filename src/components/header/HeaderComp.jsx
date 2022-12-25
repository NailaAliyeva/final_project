import React from 'react';
import { Component } from 'react';
import Style from './header.module.scss'
import logo from '../../img/header/user.svg'
// import shoppingCart from '../../img/header/shopping-cart.svg'
import deleteIcon from '../../img/delete/delete-icon.svg'
import logoIcon from '../../img/logo-img/logo-icon.png'

import { RegisterComp } from './MyProfile';
import RegistrationContainer from '../registrations/RegistrationContainer';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setCountRecycleBin, showHistori } from '../../store/header/actions'
import History from '../body/history/History';


class HeaderComp extends Component {
    state = {
        myProfilePopup: false,

        showRegisterPopup: false,
        signInOrSignUp: '',
        user: {},
    }

    componentDidMount() {
        const login = localStorage.getItem('login') || null;
        const token = localStorage.getItem('token') || null;
        const admin = localStorage.getItem('admin') || false;

        this.setState({ user: { login, token, admin } });

        console.log([login, token, admin]);
        console.log("First Start");
        if (admin === 'true') {
            this.getRecycleBinCount();
        }
    }

    componentDidUpdate() {
        console.log("componentDidUpdate");
    }

    getRecycleBinCount() {
        fetch('/recycle-bin')
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText)
                }
                return res.json();
            })
            .then(data => {
                this.props.setCountRecycleBin(data.allCount);
            })
            .catch(err => console.log(err))
    }

    authorizationUser = (data) => {
        this.setState({ user: data });
        localStorage.setItem('login', data.login);
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', data.admin);
        window.location.reload(false);
    }

    onClickHandler = (value) => {
        this.setState({
            myProfilePopup: false,
            showRegisterPopup: true,
            signInOrSignUp: value,
        })
    }

    closeRegisterPopup = () => {
        this.setState({ showRegisterPopup: false });
    }

    showPopup = () => {
        this.setState({ myProfilePopup: true });
    }

    hiddenPopup = () => {
        this.setState({ myProfilePopup: false });
    }

    recyleBinHandler = () => {

    }

    render() {
        const adminTools = localStorage.getItem('admin');
        const { myProfilePopup } = this.state;
        return (
            <div className={Style.headerContainer}>
                <div className={Style.maxWidthDiv}>
                    <div className={Style.logoDiv}>
                        <img src={logoIcon} alt="Logo" />
                        <h2><Link to='/'><i>Rare Coins</i></Link></h2>
                    </div>
                    <div className={Style.cartDiv}>
                        <div className={Style.imgCont}>

                            {adminTools === 'true' ? (<><Link to="/recycle-bin"><img src={deleteIcon} onClick={this.recyleBinHandler} alt="Delete logo" /></Link>
                                <div className={Style.countDiv}>
                                    <span>{this.props.count}</span>
                                </div>
                            </>) : (
                                    null
                                    // <>
                                    //     <img src={shoppingCart} alt="Cart logo" />
                                    // </>
                                )}

                        </div>
                    </div>
                    <div className={Style.myProfile} onMouseOver={this.showPopup} onMouseLeave={this.hiddenPopup}>
                        <img src={logo} alt="User logo" />
                        <span>My profile</span>
                        <span>&darr;</span>

                        {myProfilePopup ? <RegisterComp onClickHandler={this.onClickHandler} /> : null}
                    </div>
                    {this.state.showRegisterPopup ? <RegistrationContainer
                        signInOrSignUp={this.state.signInOrSignUp}
                        closeRegisterPopup={this.closeRegisterPopup}
                        authorizationUser={this.authorizationUser} /> : null}
                </div>
                {this.props.showHistory ? (<History />) : null}
            </div>
        );
    }
}

const putStateToProps = (state) => {
    return {
        count: state.header.count,
        showHistory: state.header.showHistory
    };
}

const putPropsToState = {
    setCountRecycleBin,
    showHistori
}

export default connect(putStateToProps, putPropsToState)(HeaderComp);
