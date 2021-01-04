import axios from 'axios';

const baseURL = 'http://localhost:3001/persons';

const getAll = () => axios.get(baseURL)
    .then(rsp => rsp.data);

const create = (name, number) =>
    axios.post(baseURL, {
        name, number
    }).then(rsp => rsp.data);

const exports = {
    getAll, create,
};
export default exports;