import React, { Component } from 'react';
import Style from './registration.module.scss';
import { Loading } from './Loading'

export default class SignUp extends Component {
    state = {
        login: '',
        password: '',
        repeatPassword: '',

        checkLogin: false,
        checkPassword: false,
        checkRepeatPassword: false,

        alertLogin: false,
        alertPassword: false,
        alertRepeatPassword: false,

        aletLoginText: '',

        loading: false,
    }

    sendSignUpForm = (event) => {
        this.setState({ loading: true })
        event.preventDefault();
        const requestBody = {
            login: this.state.login,
            password: this.state.password,
            repeatPassword: this.state.repeatPassword
        };
        fetch(`/register`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-type': 'application/json' }
        })
            .then(res => {
                if (res.status === 409) {
                    console.log("Chance login")
                    this.setState({
                        alertLogin: true,
                        aletLoginText: 'This login already exists.'
                    })
                    return '';
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                console.log(data);
                // this.props.onLogin(data.token, data.login);
            })
            .finally(() => this.setState({ loading: false }))
    }

    loginChanceHandler = (event) => {
        let val = event.target.value.split(' ').join('');
        let check = false
        if (val.length > 2) {
            check = true
        }
        this.setState({
            login: val,
            checkLogin: check,
        })
    }

    onBlurName = () => {
        if (!this.state.checkLogin) {
            this.setState({
                alertLogin: true,
                aletLoginText: 'Incorrect format (minimum 3 characters)',
            })
        } else {
            this.setState({ alertLogin: false })
        }
    }

    repeatPasswordChanceHandler = (event) => {
        let val = event.target.value.split(' ').join('');
        let letters = /^[A-Za-z0-9]+$/;

        if (val.length < 20 && (val.match(letters) || val === '')) {
            let check = false;
            if (val === this.state.password) {
                check = true;
            }
            this.setState({
                repeatPassword: val,
                checkRepeatPassword: check
            });
        }
    }

    onBlurPassword = () => {
        if (!this.state.checkPassword) {
            this.setState({ alertPassword: true })
        } else {
            this.setState({ alertPassword: false })
        }
    }

    passwordChanceHandler = (event) => {
        let val = event.target.value.split(' ').join('');
        let letters = /^[A-Za-z0-9]+$/;

        if (val.length < 20 && (val.match(letters) || val === '')) {
            let check = false;
            if (val.length > 5) {
                check = true;
            }
            this.setState({
                password: val,
                checkPassword: check
            });
        }

    }

    onBlurRepeatPassword = () => {
        if (!this.state.checkRepeatPassword) {
            this.setState({ alertRepeatPassword: true })
        } else {
            this.setState({ alertRepeatPassword: false })
        }
    }
    render() {
        const { checkLogin, checkPassword, checkRepeatPassword } = this.state;
        const { alertLogin, alertPassword, alertRepeatPassword, aletLoginText } = this.state;

        let buttonActive = false;

        if (checkLogin && checkPassword && checkRepeatPassword) {
            buttonActive = true;
        }
        return (
            <form onSubmit={this.sendSignUpForm}>
                <div className={Style.inputDiv}>
                    <input type="text" placeholder="Login"
                        style={alertLogin ? { border: '1px solid red' } : null}
                        onChange={this.loginChanceHandler}
                        onBlur={this.onBlurName}
                        value={this.state.login} />
                    {alertLogin ? <span>{aletLoginText}</span> : null}

                </div>
                {/* <div>
                    <input type="email" placeholder="Email"
                        onChange={this.loginChanceHandler}
                        value={this.state.login} />
                </div> */}
                {/* <hr/> */}
                <div className={Style.inputDiv}>
                    <input type="password" placeholder="Password"
                        style={alertPassword ? { border: '1px solid red' } : null}
                        onChange={this.passwordChanceHandler}
                        onBlur={this.onBlurPassword}
                        value={this.state.password} />
                    {alertPassword ? <span>Please use 6-20 characters (A-Z, a-z, 0-9 only)</span> : null}

                </div>
                <div className={Style.inputDiv}>
                    <input type="password" placeholder="Repeat password"
                        style={alertRepeatPassword ? { border: '1px solid red' } : null}
                        onChange={this.repeatPasswordChanceHandler}
                        onBlur={this.onBlurRepeatPassword}
                        value={this.state.repeatPassword} />
                    {alertRepeatPassword ? <span>Passwords do not match</span> : null}

                </div>
                {/* {!this.state.loading ? null : (
                    <div className={Style.loadingDiv}>
                        <img src={loading} alt="Loading gif" />

                    </div>)} */}
                {!this.state.loading ? null : <Loading />}
                <div>
                    <button disabled={!buttonActive}>CREATE MY ACCOUNT</button>
                </div>
            </form>
        );
    }
}