const initialState = {
    auth: null,
    uid: '',
    userType: 'normal'
};
//eslint-disable-next-line
export default (state = initialState, action) => {
    switch (action.type) {
        case 'USER_AUTH':
            return {
                ...state,
                auth: action.auth,
            };
        case 'USER_UID':
            return {
                ...state,
                uid: action.uid,
            };

        case 'USER_TYPE':
            return {
                ...state,
                userType: action.userType,
            };
        default:
            return state;
    }
};