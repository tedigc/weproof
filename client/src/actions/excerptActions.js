import axios from 'axios';

export function createExcerpt(excerpt) {
  return dispatch => {
    return axios.post('/api/excerpts', excerpt);
  };
};

export function fetchExcerpts() {
  return dispatch => {
    return axios.get('/api/excerpts');
  };
};

export function fetchSingleExcerpt(id) {
  return dispatch => {
    return axios.get('/api/excerpts/' + id);
  };
};

export function fetchSingleExcerptMin(id) {
  return dispatch => {
    return axios.get('/api/excerpts/' + id + '/min');
  };
};

export function acceptExcerpt(id) {
  return dispatch => {
    return axios.post('/api/excerpts/accept', id);
  };
};