import { APIData, LimitationData, LimitationRecord } from "../types"
import TOKEN from '../secret'

const apiUrl = "http://127.0.0.1:8000/api"
const sites = '/sites/'
const limited = '/limitations/'


const headers = {
    Authorization: TOKEN,
    "Content-Type": "application/json",
}

const sendData = async (data: APIData) => {
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    };
    fetch(apiUrl + sites, requestOptions).then((res) => {
        if (!res.ok) {
            console.error("Error: ", res.status)
        }
        return res.json()
    }).catch(e => {
        console.error(e)
    })
}

const getLimitedDomains = async ():Promise<LimitationRecord[]> => {
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
    return fetch(apiUrl + limited, requestOptions).then((res) => {
        if (!res.ok) {
            console.error("Error: ", res.status)
        }
        return res.json()
    }).then((data:any[]) => {
        return data.map(((el:any) => {
            return {
                name:el.name,
                data: {
                    count:el.data.count,
                    daily_usage:el.data.daily_usage,
                    time:parseInt(el.data.time)
                }
            }
        })) as LimitationRecord[]
    }).catch(e => {
        console.error(e)
        return []
    })
}


export {
    sendData,
    getLimitedDomains
}