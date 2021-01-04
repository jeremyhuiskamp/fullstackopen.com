import axios from 'axios';

const baseURL = 'http://localhost:3001/persons';

const getAll = () => axios.get(baseURL)
    .then(rsp => rsp.data);

const create = (name, number) =>
    axios.post(baseURL, {
        name, number
    }).then(rsp => rsp.data);

const delete_ = id =>
    axios.delete(`${baseURL}/${id}`);

const exports = {
    getAll, create, delete: delete_,
};
export default exports;