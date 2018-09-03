import { request } from "./utils";

// 获取token
export function getToken(url) {
    return request('get', url);
}

// 获取用户信息
export function getUserInfo(token) {
    return request('get', `https://api.github.com/user?access_token=${token}`);
}

// 获取所有issue
export function getAllIssue(name, repos) {
    return request('get', `https://api.github.com/repos/${name}/${repos}/issues/`);
}

// 获取某条issues
export function getIssue(name, repos, issue) {
    return request('get', `https://api.github.com/repos/${name}/${repos}/issues/${issue}`);
}

// 获取某条issues下的评论
export function getComments(name, repos, issue, comments) {
    return request('get', `https://api.github.com/repos/${name}/${repos}/issues/${issue}/${comments}`);
}

// 创建一条issues
export function creatIssues(name, repos, issue) {
    return request('post', `https://api.github.com/repos/${name}/${repos}/issues`, issue);
}

// 某条issues下创建一条评论
export function creatComments(issue, comment) {
    return request('post', `https://api.github.com/repos/${name}/${repos}/issues/${issue}/comments`, comment);
}

// 解析markdown
export function mdToHtml(markdown) {
    return request('post', `https://developer.github.com/v3/markdown/`, markdown);
}