import React, { Component } from 'react'
import { connect } from 'react-redux'

import { signUp } from '../../ducks/auth'
import AuthForm from './auth-form'

const Auth = class extends Component {
    render() {
    const { isPending, email, error, signUp } = this.props

        return(
            <div>
                <h2>Auth</h2>
                <p>{email ? email : 'not authorized'}</p>
                <AuthForm
                    submit={signUp}
                    caption="Sign Up"
                    isPending={isPending} />
                <AuthForm
                    submit={(email, password) => console.log('Sign In', email, password)}
                    caption="Sign In"
                    isPending={isPending} />
                {error ? <p>{error.message}</p> : null}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isPending: state.auth.isPending,
    email: state.auth.email,
    error: state.auth.error
})

const mapDispatchToProps = {
    signUp
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)