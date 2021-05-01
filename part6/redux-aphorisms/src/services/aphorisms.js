import axios from 'axios';

const baseUrl = 'http://localhost:3001/aphorisms';

const getAll = async () =>
    (await axios.get(baseUrl)).data;

const create = async aphorism =>
    (await axios.post(baseUrl, aphorism)).data;

const vote = async aphorism =>
    (await axios.patch(`${baseUrl}/${aphorism.id}`, {
        // Hmm, is this the place for the vote calculation logic?
        votes: aphorism.votes + 1,
    })).data;

export default {
    getAll,
    create,
    vote,
};