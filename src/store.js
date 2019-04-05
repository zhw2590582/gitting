import createStore from 'unistore';

export const state = {
  isLogin: false,
  issue: {
    id: 0
  },
  comments: [],
}

export const store = createStore(state);

export const actions = store => ({
  increment(state) {
    return {
      issue: {
          id: state.issue.id + 1
      }
    }
  },
})
