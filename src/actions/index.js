import { SELECT_SCHOOL_BY_GEOMETRY } from './types'

export const selectSchool = geometry => ({
  type: SELECT_SCHOOL_BY_GEOMETRY,
  payload: geometry
})