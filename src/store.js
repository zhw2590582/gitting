import { cleanStorage, setStorage, getStorage, queryStringify } from './utils';

export const state = {
  isLogin: () => !!getStorage('token') && !!getStorage('userInfo'),
  userInfo: {},
  issue: {},
  comments: [],
  error: '',
  input: ''
};

export const actions = store => ({
  throwError(state, condition, msg) {
    return {
      error: !condition ? '' : msg
    };
  },

  setUserInfo(state, info) {
    return {
      userInfo: info
    };
  },

  setIssue(state, issue) {
    return {
      issue: issue
    };
  },

  setComments(state, comments = []) {
    const retult = [...state.comments];
    comments.forEach(comment => {
      if (!retult.find(item => item.id === comment.id)) {
        retult.push(comment);
      }
    });
    return {
      comments: retult
    };
  },

  setInput(state, input) {
    return {
      input: input
    };
  },

  logout(state, e) {
    e && e.preventDefault();
    cleanStorage();
    window.location.reload();
  },

  login(state, options, e) {
    e && e.preventDefault();
    if (state.input.trim()) {
      setStorage('input', state.input);
    }
    setStorage('redirect_uri', window.location.href);
    window.location.href = `http://github.com/login/oauth/authorize?${queryStringify(
      {
        state: 'Gitting',
        client_id: options.clientID,
        redirect_uri: window.location.href,
        scope: 'public_repo'
      }
    )}`;
  }
});
