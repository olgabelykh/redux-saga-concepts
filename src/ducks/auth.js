import {
    put,
    takeEvery,
    all
} from 'redux-saga/effects'

import { appName } from '../config'
import api from '../services/api'

export const moduleName = 'auth'
const prefix = `${appName}/${moduleName}`

export const SIGN_UP_REQUEST = `${prefix}/SIGN_UP_REQUEST`
export const SIGN_UP_PENDING = `${prefix}/SIGN_UP_PENDING`
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`
export const SIGN_UP_FAIL = `${prefix}/SIGN_UP_FAIL`

export const SIGN_IN_REQUEST = `${prefix}/SIGN_IN_REQUEST`
export const SIGN_IN_PENDING = `${prefix}/SIGN_IN_PENDING`
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`
export const SIGN_IN_FAIL = `${prefix}/SIGN_IN_FAIL`


// reducer

const initialState = {}

const reducer = (state = initialState, action) => {
    const { type, payload } = action

    switch (type) {
        case SIGN_UP_PENDING:
        case SIGN_IN_PENDING:
            return { isPending: true }
        case SIGN_UP_SUCCESS:
        case SIGN_IN_SUCCESS:
            return { email: payload.email }
        case SIGN_UP_FAIL:
        case SIGN_IN_FAIL:
            return { error: payload.error }
        default:
            return state
    }
}

export default reducer


// action creators

export const signUpRequest = (email, password) => ({
    type: SIGN_UP_REQUEST,
    payload: {
        email,
        password
    }
})

export const signUpPending = _ => ({ type: SIGN_UP_PENDING })

export const signUpSuccess = email => ({
    type: SIGN_UP_SUCCESS,
    payload: { email }
})

export const signUpFail = error => ({
    type: SIGN_UP_FAIL,
    payload: { error }
})

export const signUp = (email, password) => signUpRequest(email, password)

export const signInRequest = (email, password) => ({
    type: SIGN_IN_REQUEST,
    payload: {
        email,
        password
    }
})

export const signInPending = _ => ({ type: SIGN_IN_PENDING })

export const signInSuccess = email => ({
    type: SIGN_IN_SUCCESS,
    payload: { email }
})

export const signInFail = error => ({
    type: SIGN_IN_FAIL,
    payload: { error }
})

export const signIn = (email, password) => signInRequest(email, password)

// sagas

export function* signUpSaga(action) {
    const { payload: { email, password } } = action

    yield put(signUpPending())

    try {
        const { user } = yield api.signUp(email, password)
        yield put(signUpSuccess(user.email))
    } catch (error) {
        yield put(signUpFail(error))
    }
}

export function* signInSaga(action) {
    const { payload: { email, password } } = action

    yield put(signInPending())

    try {
        const { user } = yield api.signIn(email, password)
        yield put(signInSuccess(user.email))
    } catch (error) {
        yield put(signInFail(error))
    }
}

export function* saga () {
    yield all([
        takeEvery(SIGN_UP_REQUEST, signUpSaga),
        takeEvery(SIGN_IN_REQUEST, signInSaga)
    ])
}

