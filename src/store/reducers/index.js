import {combineReducers} from 'redux';
import app from './app';

const createReducer = (asyncReducers) =>
    combineReducers({
        app,
        ...asyncReducers
    });

export default createReducer;
