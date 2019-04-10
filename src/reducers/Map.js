import { SELECT_SCHOOL_BY_GEOMETRY } from '../actions/types'
const geometry = null

export default function reducer(state = {
  geometry
}, action) {
  switch (action.type) {
    case SELECT_SCHOOL_BY_GEOMETRY:
      return {
        ...state,
        geometry: action.payload
      };

    default:
      break
  }

  return state;
}