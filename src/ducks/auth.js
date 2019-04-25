import {
    put,
    race,
    fork,
    call,
    take,
    cancel,
    cancelled
} from 'redux-saga/effects'

import { appName } from '../config'
import api from '../services/api'

export const moduleName = 'auth'
const prefix = `${appName}/${moduleName}`

export const SIGN_UP_REQUEST = `${prefix}/SIGN_UP_REQUEST`
export const SIGN_UP_PENDING = `${prefix}/SIGN_UP_PENDING`
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`
export const SIGN_UP_FAIL = `${prefix}/SIGN_UP_FAIL`
export const SIGN_UP_CANCEL = `${prefix}/SIGN_UP_CANCEL`

export const SIGN_IN_REQUEST = `${prefix}/SIGN_IN_REQUEST`
export const SIGN_IN_PENDING = `${prefix}/SIGN_IN_PENDING`
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`
export const SIGN_IN_FAIL = `${prefix}/SIGN_IN_FAIL`
export const SIGN_IN_CANCEL = `${prefix}/SIGN_IN_CANCEL`

export const SIGN_OUT_REQUEST = `${prefix}/SIGN_OUT_REQUEST`
export const SIGN_OUT_PENDING = `${prefix}/SIGN_OUT_PENDING`
export const SIGN_OUT_SUCCESS = `${prefix}/SIGN_OUT_SUCCESS`
export const SIGN_OUT_FAIL = `${prefix}/SIGN_OUT_FAIL`

export const CANCEL_AUTH_REQUEST = `${prefix}/CANCEL_AUTH_REQUEST`
// reducer

const initialState = {}

const reducer = (state = initialState, action) => {
    const { type, payload } = action

    switch (type) {
        case SIGN_UP_PENDING:
        case SIGN_IN_PENDING:
        case SIGN_OUT_PENDING:
            return { isPending: true }
        case SIGN_UP_SUCCESS:
        case SIGN_IN_SUCCESS:
            return { email: payload.email }
        case SIGN_UP_CANCEL:
        case SIGN_IN_CANCEL:
        case SIGN_OUT_SUCCESS:
        case SIGN_OUT_FAIL:
            return { ...initialState }
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

export const signUpCancel = _ => ({ type: SIGN_UP_CANCEL })

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

export const signInCancel = _ => ({ type: SIGN_IN_CANCEL })

export const signIn = (email, password) => signInRequest(email, password)

export const signOutRequest = _ => ({ type: SIGN_OUT_REQUEST })

export const signOutPending = _ => ({ type: SIGN_OUT_PENDING })

export const signOutSuccess = _ => ({ type: SIGN_OUT_SUCCESS })

export const signOutFail = error => ({
    type: SIGN_OUT_FAIL,
    payload: { error }
})

export const signOut = _ => signOutRequest()

export const cancelAuthRequest = _ => ({type: CANCEL_AUTH_REQUEST})
export const cancelAuth = _ => cancelAuthRequest()

// sagas

export function* signUpSaga(action) {
    const { payload: { email, password } } = action

    yield put(signUpPending())

    try {
        const { user } = yield api.signUp(email, password)
        yield put(signUpSuccess(user.email))
    } catch (error) {
        yield put(signUpFail(error))
    } finally {
        if (yield cancelled()) {
            yield put(signUpCancel())
        }
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
    } finally {
        if (yield cancelled()) {
            yield put(signInCancel())
        }
    }
}

export function* signOutSaga() {
    yield put(signOutPending())

    try {
        yield api.signOut()
        yield put(signOutSuccess())
    } catch (error) {
        yield console.log('SIGN OUT ERROR', error)
        yield put(signOutFail(error))
    }
}

export function* saga () {
    let task

    while (true) {
        const [signUpAction, signInAction] = yield race([
            take(SIGN_UP_REQUEST),
            take(SIGN_IN_REQUEST) 
        ])

        if (signUpAction) {
            task = yield fork(signUpSaga, signUpAction)
        }

        if (signInAction) {
            task = yield fork(signInSaga, signInAction)
        }

        const { type } = yield take([
            SIGN_UP_FAIL,
            SIGN_IN_FAIL,
            SIGN_OUT_REQUEST,
            CANCEL_AUTH_REQUEST
        ]) 

        if (type === SIGN_UP_FAIL || type === SIGN_IN_FAIL) {
            continue
        }

        if (type === CANCEL_AUTH_REQUEST) {
            yield cancel(task)
            continue
        }

        if (type === SIGN_OUT_REQUEST) {
            yield call(signOutSaga)
        }
        //yield* signOutSaga()
    }
}

