import axios from "axios"

axios.defaults.baseURL = "http://127.0.0.1:8000/api";
// tymczasowy, to jest token zalogowanego ziomka
axios.defaults.headers.common[
    "Authorization"
] = `Token e31909e316ed96c159b39668941662bdc9d31786`;

export default axios