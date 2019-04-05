import createStore from 'unistore';

export const store = createStore({
  issue: {
    id: 0
  },
  comments: [],
});

export const actions = store => ({
  increment(state) {
    return {
      issue: {
          id: state.issue.id + 1
      }
    }
  },
})
