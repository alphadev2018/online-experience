export const SET_USER_NAME = '[APP] SET_USER_NAME';
export const LOAD_MODEL = '[APP] LOAD_MODEL';

export function setUserName(data)
{
    return {
        type: SET_USER_NAME,
        data
    }
}

export function loadModel(model)
{
    return {
        type: LOAD_MODEL,
        model
    }
}