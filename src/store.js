import createStore from "unistore";
import { cleanStorage, setStorage, getStorage, queryStringify } from "./utils";

export const state = {
  isLogin: getStorage("token") && getStorage("userInfo"),
  userInfo: {},
  issue: {},
  comments: [],
  error: "",
  input: "",
  page: 1
};

export const store = createStore(state);

export const actions = store => ({
  throwError(state, condition, msg) {
    return {
      error: !condition ? "" : msg
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

  setComments(state, comments) {
    return {
      comments: [...state.comments, ...comments],
      page: comments.length ? state.page + 1 : state.page
    };
  },

  setInput(state, input) {
    return {
      input: input
    };
  },

  logout(state, e) {
    e.preventDefault();
    cleanStorage();
    window.location.reload();
  },

  login(state, options, e) {
    e.preventDefault();
    setStorage("redirect_uri", window.location.href);
    window.location.href = `http://github.com/login/oauth/authorize?${queryStringify(
      {
        state: "Gitting",
        client_id: options.clientID,
        redirect_uri: window.location.href,
        scope: "public_repo"
      }
    )}`;
  }
});
