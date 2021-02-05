import axios from 'axios';

const baseURL = 'http://localhost:3001/api/blogs';

const getAll = async () =>
    (await axios.get(baseURL)).data;

const create = async (title, author, url, user) =>
    await axios.post(baseURL, {
        title, author, url,
    }, {
        headers: {
            authorization: `bearer ${user.token}`,
        },
    });

const exports = {
    getAll, create,
};
export default exports;