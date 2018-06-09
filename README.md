# JavaScript实现语音聊天

## 描述

程序在 [iamshaunjp](https://github.com/iamshaunjp/websockets-playlist/tree/lesson-5) 的群聊功能基础上利用webRTC技术，添加了语音群聊功能，在其他人键盘输入时，会出现类似微信的对方正在输入字样。demo：<https://biptedu.cn:4000/>

**使用的nodejs模块**

- `express`：创建一个web服务器
- `https`：创建https连接（局域网或者外网webRTC需要https连接，具体见[tutoril](https://www.html5rocks.com/en/tutorials/webrtc/basics/)）
- `socket.io`：客户端与服务端实时通信

**js文件**

- `chat.js`：实现按钮事件的注册、文本数据的发送等
- `record.js`：实现语音消息的录取、播放、发送等

## 结构图和流程图

![架构图](images/架构.svg)

![流程图](images/流程图.svg)

## 文本通信

**详情见`public/js/chat.js`注释**

**发送数据**

- 进入页面进行与服务器的`socket`连接
- 客户端输入文本数据
- 客户点击`sent`按钮，触发`click`事件，并产生`chat`事件准备想服务器`emit`
- `soket`连接发送给服务器chat事件和客户端产生的数据

**接收数据**

- `socket`接受到服务器发送来的data和服务器发送来的chat事件
- 提取data文本
- js在`index.html`添加文本数据，完成接收数据并显示

## 语音通信

**详情见`public/js/record.js`注释**

- 接受和发送语音数据类似与文本数据的通信
- 利用`webRTC`获取到用户的视频或者音频转换为`blob`格式数据，并发送给服务器数据。
- 接受消息时，数据类型是`blob`格式，对`blob`数据解析，利用html5的audio标签进行播放

## 服务器转发数据

客户端发送给服务器数据，服务器触发`chat`事件，将客户端发送来的数据以广播的形式发送到每一个客户端，完成群聊的功能。

## 创建https证书

在localhost中使用webRTC不需要使用https，但是在局域网或者外网使用webRTC，必须强制使用webRTC，这里采用自己生成证书供测试使用，具体生成方法和设置https方法[参考博客](http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/)：

- 生成自己签名的证书（有效期365天）
```
 openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
```
- 使用https连接的express，例子如下：
```javascript
  var fs = require('fs'),
    https = require('https'),
    express = require('express'),
    app = express();

    https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }, app).listen(55555);

    app.get('/', function (req, res) {
      res.header('Content-type', 'text/html');
      return res.end('<h1>Hello, Secure World!</h1>');
    });
```