import axios from 'axios';

const baseURL = 'http://localhost:3001/api/login';

const login = async (username, password) =>
    (await axios.post(baseURL, {
        username, password,
    })).data;

const exports = {
    login,
};
export default exports;
