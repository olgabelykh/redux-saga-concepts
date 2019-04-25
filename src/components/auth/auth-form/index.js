import React, { useState } from 'react'

const AuthForm = props => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const emailChangeHandler = event => setEmail(event.target.value)
    const passwordChangeHandler = event => setPassword(event.target.value)

    const { submit, caption, isPending } = props

    const submitHandler = event => {
        event.preventDefault()
        submit(email, password)
    }

    return (
        <form onSubmit={submitHandler}>
            <input
                type="email"
                name="email"
                placeholder="email"
                value={email}
                onChange={emailChangeHandler} />
            <input
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={passwordChangeHandler}/>
            { isPending ? <span>...</span> : <button type ="submit">{caption}</button>}
        </form>
    )
}

export default AuthForm