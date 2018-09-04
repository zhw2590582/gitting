import { request } from "./utils";

// 获取token
export function getToken(url) {
    return request('get', url);
}

// 获取用户信息
export function getUserInfo(token) {
    return request('get', `https://api.github.com/user?access_token=${token}`);
}

// 通过标签获取issue
export function getIssueByLabel(name, repos, query) {
    return request('get', `https://api.github.com/repos/${name}/${repos}/issues?${query}`);
}

// 通过id获取issues
export function getIssueById(name, repos, id, query) {
    return request('get', `https://api.github.com/repos/${name}/${repos}/issues/${id}?${query}`);
}

// 获取某条issues下的评论
export function getComments(name, repos, id, query) {
    return request('get', `https://api.github.com/repos/${name}/${repos}/issues/${id}/comments?${query}`, null, {
        Accept: "application/vnd.github.v3.full+json"
    });
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