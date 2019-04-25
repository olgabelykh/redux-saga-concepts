import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

import reducer from './reducer'
import saga from './saga'

const sagaMiddleware = createSagaMiddleware()
const enhancer = applyMiddleware(logger, sagaMiddleware)

const store = createStore(reducer, enhancer)
export default store

sagaMiddleware.run(saga) 

//dev only
window.appStore = store