import axios from 'axios';
const baseURL = 'http://localhost:3000';

export const getUserType = async(uid) =>{
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/users/getUserType`, {
            params: {
                uid: uid
            }
        })
            .then(res => {
                resolve({ status: res.status, data: res.data })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}


export const getReportedOffers = async() =>{
    return new Promise((resolve, reject) =>  {
        axios.get(`${baseURL}/api/offers/getReportedOffers`, {
            params: {}
        })
            .then(res => {
                resolve({ status: res.status, data: res.data })
            })
            .catch((err) => {
                console.log(err);
                reject({ status: 500, user: null });
            })
    })
}