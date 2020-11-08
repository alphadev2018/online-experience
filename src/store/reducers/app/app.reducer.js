import * as Actions from 'store/actions/app/index';

const initialState = {
    user_name: '',
    models: []
};

const routes = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SET_USER_NAME:
        {
            return {
                ... state,
                user_name: action.data
            }
        }
        case Actions.LOAD_MODEL:
        {
            state.models.push(action.model);
            return state;
        }
        default:
        {
            return state;
        }
    }
};

export default routes;
