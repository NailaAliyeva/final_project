import React, { Component } from 'react';
import Style from './registration.module.scss';
import { Loading } from './Loading'

export default class SignIn extends Component {
    state = {
        login: '',
        password: '',

        checkLogin: false,
        checkPassword: false,

        alertLogin: false,
        alertPassword: false,

        notFoundAlert: false,

        loading: false,
    }

    checkAllFields = () => {
        let check = true;
        if (!this.state.checkLogin) {
            this.setState({ alertLogin: true });
            check = false;
        } else {
            this.setState({ alertLogin: false });
        }

        if (!this.state.checkPassword) {
            this.setState({ alertPassword: true });
            check = false;
        } else {
            this.setState({ alertPassword: false });
        }

        return check;
    }

    sendSignInForm = (event) => {
        event.preventDefault();
        if (!this.checkAllFields()) {
            return;
        }


        const requestBody = {
            login: this.state.login,
            password: this.state.password,
        };

        this.setState({ loading: true })

        fetch(`/login`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-type': 'application/json' }
        })
            .then(resp => {
                if (resp.status === 404) {
                    this.setState({ notFoundAlert: true })
                    return '';
                } else {
                    return resp.json();
                }
            })
            .then(data => {
                if (data !== '') {
                    const { login, token, admin } = data;
                    this.props.authorizationUser({ login, token, admin });

                }
            })
            .finally(() => this.setState({ loading: false }))
    }


    loginChanceHandler = (event) => {
        let val = event.target.value;
        let check = false;
        if (val.length > 0) {
            check = true;
        }
        this.setState({
            login: val,
            checkLogin: check,
        });
    }

    passwordChanceHandler = (event) => {
        let val = event.target.value;
        let check = false;
        if (val.length > 0) {
            check = true;
        }
        this.setState({
            password: val,
            checkPassword: check,
        });
    }

    render() {
        const { alertLogin, alertPassword, login, password, notFoundAlert } = this.state;
        return (
            <form onSubmit={this.sendSignInForm}>
                <div className={Style.inputDiv}>
                    <input type="text" placeholder="Login"
                        style={alertLogin ? { border: '1px solid red' } : null}
                        onChange={this.loginChanceHandler}
                        value={login} />
                    {alertLogin ? <span>Please enter your login.</span> : null}

                </div>
                <div className={Style.inputDiv}>
                    <input type="password" placeholder="Password"
                        style={alertPassword ? { border: '1px solid red' } : null}
                        onChange={this.passwordChanceHandler}
                        value={password} />
                    {alertPassword ? <span>Please enter your password.</span> : null}

                </div>

                <div>
                    <button>SIGN IN</button>
                </div>

                {!this.state.loading ? null : <Loading />}
                {notFoundAlert ? <p className={Style.incorrectInput}>Your login name or password is incorrect.</p> : null}
            </form>
        );
    }
}