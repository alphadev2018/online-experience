import * as Actions from 'store/actions/app/index';

const initialState = {
    user_name: ''
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
        default:
        {
            return state;
        }
    }
};

export default routes;
