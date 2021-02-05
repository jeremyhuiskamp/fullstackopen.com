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

const ifBadRequest = (e, onBadRequest, otherwise) => {
    if (e.response?.status / 100 === 4) {
        onBadRequest(e.response?.data?.error);
    } else {
        otherwise(e);
    }
};

const exports = {
    getAll,
    create,
    ifBadRequest,
};
export default exports;