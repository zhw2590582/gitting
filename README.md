# table-export-zip

> 打包下载分割的表格，分批次获取 json 数据并转换成 csv,最终打包成一个压缩包，建议根据业务进行二次封装

## Install

```
$ npm i -S table-export-zip
```

## Usage

```js
import TableExportZip from 'table-export-zip';

// 实例化
let app = new TableExportZip({
	zipFileName: 'fileName',
	processCallback: () => {
		console.log('下载开始');
	},
	doneCallback: () => {
		console.log('下载结束');
	},
	addFiles: (zip, done, { CSVToJSON, JSONtoCSV }) => {
		// zip：jszip的实例
		// done：结束的回调
		// CSVToJSON：csv转json的工具
		// JSONtoCSV：json转csv的工具

		// 测试接口
		let apiUrl = 'https://jsonplaceholder.typicode.com/posts?userId=';

		// 准备待请求的Promise列表
		let prArr = [];
		for (let index = 0; index < 10; index++) {
			prArr.push(fetch(apiUrl + index).then(data => data.json()));
		}

		// 开始并行请求
		Promise.all(prArr).then(result => {
			result.forEach((content, index) => {
				// json 转 csv，第一个参数为数据，第二参数为表头字段
				const csvData = JSONtoCSV(content, ['userId', 'id', 'title', 'body']);
				// 添加 csv 文件，可定义文件名
				zip.file(`fileName${index + 1}.csv`, csvData);
			});
		}).then(done);
	}
});

// 触发下载
app.download();
```

## Related

- [jszip](https://github.com/Stuk/jszip) - Create, read and edit .zip files with Javascript
- [FileSaver.js](https://github.com/eligrey/FileSaver.js) - An HTML5 saveAs() FileSaver implementation

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
