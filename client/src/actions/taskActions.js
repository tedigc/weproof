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
}

export function fetchAvailableTasks() {
  return dispatch => {
    return axios.get('/api/tasks/available');
  };
};

export function fetchTasks() {
  return dispatch => {
    return axios.get('/api/tasks');
  };
}
