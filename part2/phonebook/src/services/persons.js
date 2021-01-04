import axios from 'axios';

const baseURL = '/api/persons';

const getAll = () => axios.get(baseURL)
    .then(rsp => rsp.data);

const create = (name, number) =>
    axios.post(baseURL, {
        name, number
    }).then(rsp => rsp.data);

const delete_ = id =>
    axios.delete(`${baseURL}/${id}`);

const isNotExistingError = e => e.response && e.response.status === 404;

const patch = (id, changes) => axios
    .patch(`${baseURL}/${id}`, changes)
    .then(rsp => rsp.data);

const exports = {
    getAll, create, delete: delete_, patch, isNotExistingError,
};
export default exports;