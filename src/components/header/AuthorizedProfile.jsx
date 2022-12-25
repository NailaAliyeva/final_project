import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { showHistori } from '../../store/header/actions';

class AuthorizedProfile extends Component {
    logoutHandler = () => {
        const token = localStorage.getItem('token');
        fetch(`/token`, {
            method: 'DELETE',
            body: JSON.stringify({ token }),
            headers: { 'Content-type': 'application/json' }
        })
            .finally(() => {
                window.location.reload(false);
                localStorage.clear()
            })
    }

    onClickShowHistory = () => {
        this.props.showHistori(true);
    }

    render() {
        const login = localStorage.getItem('login');
        return (
            <>
                <div>
                    <p>Hello again, <span>{login}</span></p>
                    <Link to='/' onClick={this.logoutHandler} >Logout</Link>
                </div>
                <hr />
                <div>
                    <ul>
                        <li onClick={this.onClickShowHistory}>Watch History</li>
                    </ul>
                </div>
                <hr />
            </>
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

export default connect(putStateToProps, putPropsToState)(AuthorizedProfile);