import { APIData } from "../types"
import TOKEN from '../secret'

const apiUrl = "http://127.0.0.1:8000/api"
const site = '/sites/'

const headers = {
    Authorization: TOKEN,
    "Content-Type": "application/json",
}

const sendData = async (data: APIData) => {
    // console.log(data);
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    };
    fetch(apiUrl + site, requestOptions).then((res) => {
        if (!res.ok) {
            console.log("Error: ", res.status)
        }
        return res.json()
    }).then((data:any) => {
        console.log("data saved in database")
    }).catch(e => {
        console.log(e)
    })
}

export {
    sendData
}