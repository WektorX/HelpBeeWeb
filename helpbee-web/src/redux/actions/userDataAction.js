export const userAuth = (auth) => {
    return {
        type: 'USER_AUTH',
        auth: auth,
    };
};

export const userUID = (uid) => {
    return {
        type: 'USER_UID',
        uid: uid,
    };
};

export const userType = (userType) => {
    return {
        type: 'USER_TYPE',
        userType: userType,
    };
};

