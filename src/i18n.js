const i18n = {
  'zh-cn': {
    init: "初始化一个评论",
    counts: "条评论",
    login: "登录",
    logout: "注销",
    leave: "发表评论",
    styling: "支持使用Markdown进行样式设置",
    write: "编写",
    preview: "预览",
    noPreview: "无预览内容",
    submit: "提交",
    reply: "回复",
    loadMore: "加载更多",
    loadEnd: "加载完毕",
    published: "发表于"
  },
  en: {
    init: "Initialize A Issue",
    counts: "comments",
    login: "Login",
    logout: "Logout",
    leave: "Leave a comment",
    styling: "Styling with Markdown is supported",
    write: "Write",
    preview: "Preview",
    noPreview: "Nothing to preview",
    submit: "Submit",
    reply: "Reply",
    loadMore: "Load More",
    loadEnd: "Load completed",
    published: "Published on"
  }
};

export default function(lang) {
  const langObj = i18n[lang] || i18n["zh-cn"];
  return function(key) {
    return langObj[key] || `Unmath key: ${key}`;
  };
}
