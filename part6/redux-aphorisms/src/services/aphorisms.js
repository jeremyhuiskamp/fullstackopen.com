import axios from 'axios';

const baseUrl = 'http://localhost:3001/aphorisms';

const getAll = async () =>
    (await axios.get(baseUrl)).data;

const create = async aphorism =>
    (await axios.post(baseUrl, aphorism)).data;

export default {
    getAll,
    create,
};