import axios from 'axios';

const baseUrl = 'http://localhost:3001/aphorisms';

const getAll = async () =>
    (await axios.get(baseUrl)).data;

export default {
    getAll,
};