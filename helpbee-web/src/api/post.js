import axios from 'axios';
const baseURL = 'http://localhost:3000';


export const setBlockOffer = async(id, blocked) => {
    try {
        const res = await axios.post(`${baseURL}/api/offers/setBlockOffer`,
            {
                id: id,
                blocked: blocked
            },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}

export const setReviewedOffer = async(id) => {
    try {
        const res = await axios.post(`${baseURL}/api/offers/setReviewedOffer`,
            {
                id: id,
            },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}

export const setPermissions = async(id, type, blocked) => {
    try {
        const res = await axios.post(`${baseURL}/api/users/setPermissions`,
            {
                uid: id,
                userType: type,
                blocked: blocked
            },
            {
                'Content-Type': 'application/json;charset=utf-8'
            })
        return { status: res.status }
    }
    catch (e) {
        console.log(e);
        return { status: 500 }
    }
}