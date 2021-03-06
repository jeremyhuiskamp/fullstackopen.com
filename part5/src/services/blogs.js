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

const remove = async (id, user) =>
    await axios.delete(baseURL + '/' + id, {
        headers: {
            authorization: `bearer ${user.token}`,
        },
    });

const like = async (id, likes, user) =>
    await axios.patch(baseURL + '/' + id, {
        likes
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
    remove,
    like,
    ifBadRequest,
};
export default exports;