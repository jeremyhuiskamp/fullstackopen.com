import axios from 'axios';

const baseURL = 'http://localhost:3001/api/blogs';

const getAll = async () =>
    (await axios.get(baseURL)).data;

const exports = {
    getAll,
};
export default exports;