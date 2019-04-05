import createStore from 'unistore';
import { cleanStorage } from "./utils";

export const state = {
  userInfo: {},
  issue: {},
  comments: [],
  error: ''
}

export const store = createStore(state);

export const actions = store => ({
  throwError(state, condition, msg) {
    return {
      error: !condition ? '' : msg
    }
  },

  setUserInfo(state, info) {
    return {
      userInfo: info
    }
  },

  setIssue(state, issue) {
    return {
      issue: issue
    }
  },

  logout(state, e) {
    e.preventDefault();
    cleanStorage();
    window.location.reload();
  }
})
