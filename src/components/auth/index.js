import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    signUp,
    signIn,
    signOut
} from '../../ducks/auth'
import AuthForm from './auth-form'

const Auth = class extends Component {
    render() {
    const { email, error } = this.props

        return(
            <div>
                <h2>Auth</h2>
                <p>{email ? email : 'not authorized'} {this.renderControls()}</p>
                {this.renderForms()}
                {error ? <p>{error.message}</p> : null}
            </div>
        )
    }

    renderControls() {
        const { email, signOut } = this.props

        if (!email) {
            return null
        }

        return (
            <button onClick={signOut}>Sign Out</button>
        )
    }

    renderForms() {
        const { isPending, email, signUp, signIn } = this.props

        if (email) {
            return null
        }

        return (
            <>
                <AuthForm
                    submit={signUp}
                    caption="Sign Up"
                    isPending={isPending} />
                <AuthForm
                    submit={signIn}
                    caption="Sign In"
                    isPending={isPending} />
            </>
        )
    }
}

const mapStateToProps = state => ({
    isPending: state.auth.isPending,
    email: state.auth.email,
    error: state.auth.error
})

const mapDispatchToProps = {
    signUp,
    signIn,
    signOut
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)