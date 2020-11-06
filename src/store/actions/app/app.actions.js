export const SET_USER_NAME = '[APP] SET_USER_NAME';

export function setUserName(data)
{
    return {
        type: SET_USER_NAME,
        data
    }
}