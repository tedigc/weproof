import axios from 'axios';

export function submitTask(task) {
  return dispatch => {
    return axios.post('/api/tasks', task);
  };
};