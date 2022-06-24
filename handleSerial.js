export default class HandleSerial {
  constructor (usbProductId, usbVendorId) {
    if (!usbProductId || !usbVendorId) return;
    this.usbProductId = usbProductId;
    this.usbVendorId = usbVendorId;
    this.support = false;

    // 打开后的serilPort
    this.port = '';


    this.checkSupport()
  }
  test () {
    console.log(this.usbProductId, this.usbVendorId)
    console.log(this.support, 'ssss')
  }
  checkSupport () {
    if ('serial' in navigator) {
      this.support = true
    } else {
      this.support = true
    }
  }
  listenOnConnectDevice (cb) {
    navigator.serial.addEventListener('connect', () => {
      if (cb) {
        cb()
      }
    })
  }
  listenOnDisconnectDevice (cb) {
    navigator.serial.addEventListener('disconnect', (event) => {
      const {usbProductId, usbVendorId} = event.target.getInfo();
      if (Number(usbProductId) === Number(this.usbProductId) && Number(usbVendorId) ===  Number(this.usbVendorId)) {
        this.port = ''
        if (cb) {
          cb()
        }
      }
    })
  }
  async connectSerial (openData) {
    console.log(navigator, 'navigator.serial')
    const hadAccessPortList = await navigator.serial.getPorts();
    this._getPortByList(hadAccessPortList)
    if (!this.port) {
      const filters = [{
        usbProductId: this.usbProductId,
        usbVendorId: this.usbVendorId
      }]
      this.port = await navigator.serial.requestPort({
        filters
      })
    }
    if (this.port) {
      // openData = {baudRate: 4} ,传参参考https://developer.mozilla.org/en-US/docs/Web/API/SerialPort/open 
      await this.port.open(openData)
    }
    return this.port
  }
  _getPortByList (portList) {
    for (let i = 0; i < portList.length; i++) {
      const eachPort = portList[i].getInfo()
      if (Number(eachPort.usbProductId) === Number(this.usbProductId) && Number(eachPort.usbVendorId) ===  Number(this.usbVendorId)) {
        this.port = portList[i];
        break;
      }
    }
    return
  }
  async writeData (data) {
    if (!this.port) return;

    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
    const writer = textEncoder.writable.getWriter()

    await writer.write(data);
    writer.close();
    await writableStreamClosed;
    await writer.releaseLock();
  }
  async readData () {
    if (!this.port) return;

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    const {value} =  await reader.read();
    reader.cancel();
    await readableStreamClosed.catch(() => {})
    await reader.releaseLock();
    return value;
  }
}
