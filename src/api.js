import { request } from "./utils";

// 授权

// 获取某条issues
export function getIssues(name, repos, issue) {
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