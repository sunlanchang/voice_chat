// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    send_btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');
//     play = document.getElementById('plsy');


// Emit events
send_btn.addEventListener('click', function () {
    if (!recordedBlobs == true) {
        //如果没有语音消息
        ;
    } else {
        message.value = '请点击play按钮听取消息';
    }
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        recordedBlobs: recordedBlobs
    });
    // console.log('blob', recordedBlobs);
    message.value = '';
    recordedBlobs = '';
});

//键盘按下触发typeing事件
message.addEventListener('keypress', function () {
    socket.emit('typing', handle.value);
})

// 服务器发送chat会触发本地的chat事件
socket.on('chat', function (data) {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    console.log(data.recordedBlobs);
});

socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
