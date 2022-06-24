# HandleSerial

下载代码并且如下引入

`import HandleSerial from './HandleSerial.js'`

对navigator.serial进行一个封装，保证我们可以快速的对接串口设备。

以下是一些常用方法， 具体使用方法参考[Web Serial API读写数据实战
](https://wuhoushu.com/2022/06/23/Web-Serial-API%E8%AF%BB%E5%86%99%E6%95%B0%E6%8D%AE%E5%AE%9E%E6%88%98/)
* 监听串口设备断开 `listenOnDisconnectDevice`

```
function onSerialDisconnect() {
  // 串口设备断开后的业务处理逻辑
}
handleSerial.listenOnDisconnectDevice(onSerialDisconnect)
```

* 监听串口设备连接 `listenOnConnectDevice`
如果没有监听串口设备，监听到串口设备，有可能是之前断开过，所以每次初始化重连是必要的
```
function onSerialConnect() {
  if (handleSerial.port) {
    handleSerial.port = ''
    // 重连
  }
  // 串口设备连接时的业务逻辑
}
handleSerial.listenOnConnectDevice(onSerialConnect)
```

* 连接 `connectSerial`,需要传入`openData`参数,openData的具体参数参考[SerialPort.open()](https://developer.mozilla.org/en-US/docs/Web/API/SerialPort/open )或者翻看[这篇博客](https://wuhoushu.com/2022/05/20/%E9%80%9A%E8%BF%87WebSerialAPI%E8%AF%BB%E5%86%99%E6%95%B0%E6%8D%AE/)
  
基本参数如下：
>  * baudRate :每秒发送数据的速度
> * dataBits: 每帧发送的数据量（7或者8）
> * parity： parity模式，可选值有`none`，`even`，`odd`
> * bufferSize: 读写的buffer数据大小，不能超过16MB
> * flowControl：流控制模式，`none`或者`hardware`。

```

* 写入数据到串口设备 `writeData`
```
const writeData = 1
handleSerial.writeData(writeData)
```

* 读取串口设备的数据  `readData`
  如果我们的函数是在一个`async/awiat`函数中，我们可以这样做
```
const data = await handleSerial.readData()
// 处理逻辑
```
如果不是，也可以这样

```
 handleSerial.readData().then((data) => {
  // 处理逻辑
 })