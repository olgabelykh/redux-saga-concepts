import React, { Component } from 'react'

import AuthForm from './auth-form'

const Auth = class extends Component {

    render() {
        return(
            <div>
                <h2>Auth</h2>
                <AuthForm
                    submit={(email, password) => console.log('Sign Up', email, password)}
                    caption="Sign Up" />
                <AuthForm
                    submit={(email, password) => console.log('Sign In', email, password)}
                    caption="Sign In" />
            </div>
        )
    }
}

export default Auth