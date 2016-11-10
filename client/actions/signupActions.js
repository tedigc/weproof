import axios from 'axios';

export function userSignupRequest(userData) {
  return dispatch => {
    console.log('hi');
    return axios.post('api/users', userData);
  }
}