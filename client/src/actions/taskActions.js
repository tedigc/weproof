import axios from 'axios';

export function submitTask(task) {
  return dispatch => {
    return axios.post('/api/tasks', task);
  };
};

export function fetchSingleTask(id) {
  return dispatch => {
    return axios.get('/api/tasks/' + id);
  };
};

export function fetchAvailableTasks(filter) {
  return dispatch => {
    return axios.get('/api/tasks/available/' + filter);
  };
};

export function fetchTasks() {
  return dispatch => {
    return axios.get('/api/tasks');
  };
};

export function fetchVerifyTask(id) {
  return dispatch => {
    return axios.get('/api/tasks/' + id + '/verify');
  };
};

export function fetchFixTask(id) {
  return dispatch => {
    return axios.get('/api/tasks/' + id + '/fix');
  };
};