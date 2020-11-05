import {combineReducers} from 'redux';
import app from './app.reducer';

const appReducers = combineReducers({
    app,
});

export default appReducers;