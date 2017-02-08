import axios from 'axios';

export function submitTask(task) {
  return dispatch => {
    return axios.post('/api/tasks', task);
  };
};

export function fetchTasks() {
  return dispatch => {
    return axios.get('/api/tasks');
  };
}


export function fetchAvailableTasks() {
  return dispatch => {
    return axios.get('/api/tasks/available');
  };
};