# Gitting

> Gitting is a modern comment component based on Github Issue.

[Demo Page](https://blog.zhw-island.com/gitting)

## Install

```
$ npm i -S gitting
```

## Usage
Add a container to you page:
```html
<div id="gitting-container"></div>
```

Then use the Javascript code below to generate the gitting plugin:

```js
import Gitting from 'gitting';

const gitting = new Gitting({
    clientID: 'GitHub Application Client ID',
    clientSecret: 'GitHub Application Client Secret',
    repo: 'GitHub repo',
    owner: 'GitHub repo owner',
    id: location.pathname
});
        
gitting.render('#gitting-container');

```

## Related

- [gitalk](https://github.com/gitalk/gitalk) - Gitalk is a modern comment component based on Github Issue and Preact. 
- [gitment](https://github.com/imsun/gitment) - A comment system based on GitHub Issues. 

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
