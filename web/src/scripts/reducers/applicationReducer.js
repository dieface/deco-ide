/**
 *    Copyright (C) 2015 Deco Software Inc.
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import _ from 'lodash'

import {
  SIMULATOR_STATUS,
  PACKAGER_STATUS,
  PACKAGER_OUTPUT,
  GET_AVAILABLE_SIMULATORS,
} from '../actions/applicationActions'

import { ProcessStatus, } from '../constants/ProcessStatus'

const CHAR_LIMIT_OUTPUT = 250000

const initialState = {
  simulatorStatus: ProcessStatus.OFF,
  packagerStatus: ProcessStatus.OFF,
  packagerOutput: '',
  availableSimulators: [],
}

const applicationReducer = (state = initialState, action) => {
  switch(action.type) {
    case SIMULATOR_STATUS:
      return Object.assign({}, state, {
        simulatorStatus: action.status,
      })
    case PACKAGER_STATUS:
      return Object.assign({}, state, {
        packagerStatus: action.status,
      })
    case PACKAGER_OUTPUT:
      let output = state.packagerOutput + action.output
      //allow 10k characters for now
      if (output.length > CHAR_LIMIT_OUTPUT) {
        output = output.slice(action.output.length, output.length)
      }
      return Object.assign({}, state, {
        packagerOutput: output,
      })
    case GET_AVAILABLE_SIMULATORS:
      // Take the highest versioned simulator for each name.
      // Reverse so that the newest simulators are first.
      const availableSimulators = _.chain(action.simulators)
          .orderBy('version', 'desc')
          .unionBy('name')
          .reverse()
          .value()

      return {
        ...state,
        availableSimulators,
      }
    default:
      return state
  }
}

export default applicationReducer
