import shortid from 'shortid';
import { ADD_FLASH_MESSAGE } from '../actions/types';

export default (state = [], action = {}) => {
  switch(action.type) {
    case ADD_FLASH_MESSAGE:
      return [
        ...state,
        {
          id   : shortid.generate(),
          type : action.payload.type,
          text : action.payload.text
        }
      ]
      break;
    default: return state;
  }
  return state;
}