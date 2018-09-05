import { request, queryStringify } from "./utils";

export default function creatApi(option) {
    const issuesApi = `https://api.github.com/repos/${option.owner}/${option.repo}/issues`;

    const baseQuery = {
        client_id: option.clientID,
        client_secret: option.clientSecret
    };

    return {
        // 获取token
        getToken(code) {
            const query = Object.assign({}, baseQuery, {
                code: code,
                redirect_uri: location.href
            })
            return request('get', `${option.proxy}?${queryStringify(query)}`);
        },

        // 获取用户信息
        getUserInfo(token) {
            return request('get', `https://api.github.com/user?access_token=${token}`);
        },

        // 通过标签获取issue
        getIssueByLabel(labels) {
            const query = Object.assign({}, baseQuery, {
                labels: labels
            })
            return request('get', `${issuesApi}?${queryStringify(query)}`);
        },

        // 通过id获取issues
        getIssueById(id) {
            return request('get', `${issuesApi}/${id}?${queryStringify(baseQuery)}`);
        },

        // 获取某条issues下的评论
        getComments(id, page) {
            const query = Object.assign({}, baseQuery, {
                option: option.perPage,
                page: page
            })
            return request('get', `${issuesApi}/${id}/comments?${queryStringify(query)}`, null, {
                Accept: "application/vnd.github.v3.full+json"
            });
        },

        // 创建一条issues
        creatIssues(issue) {
            return request('post', issuesApi, issue);
        },

        // 创建一条评论
        creatComments(id, comment) {
            return request('post', `${issuesApi}/${id}/comments`, comment);
        },

        // 解析markdown
        mdToHtml(markdown) {
            return request('post', `https://developer.github.com/v3/markdown/`, markdown);
        }
    }
}