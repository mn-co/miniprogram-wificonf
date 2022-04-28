### 协议适配层代码(推荐使用方式)

* 支持AirKiss配网
* 支持Esptouch芯片SmartConfig配网
* 配网只支持2.4G频段的无线网络，并且路由器需要开启转发广播分组的功能(一般家用路由器都默认开启)
* 协议适配层代码如下所示，注释部分为AirKiss配网
* 配网主逻辑只需要调用适配层代码的`startConfigNetwork`，具体使用的协议在协议适配层来选择实现
* 协议适配层代码返回`promise`是配网任务的Promise，`destory`为中止任务的方法

协议适配层代码

```javascript
// const AirKissTask = require("./wificonf/airkiss/AirKissTask").AirKissTask;
const EsptouchTask = require("./wificonf/smartconfig/EsptouchTask").EsptouchTask;

// function startConfigNetwork(ssid, bssid, pwd){
//     const task = new AirKissTask(ssid, pwd);

//     /**
//      * 原则上airkiss配网成功后需要向设备通过udp发送token信息，
//      * 设备使用该token向服务器进行注册，并回包确认
//      * 客户端通过轮询查询是否注册成功
//      * 
//      * 当前设备并不需要传送token信息，只要配网成功后就可以使用，无需以下调用
//      *
//      * createUDPSocket().send({
//      *      address: res.address,
//      *     port: 8266,
//      *     message: JSON.stringify({"cmdType":0,"token":"Q3R5MjAyMDQxNUN0eTIwMjA0MTU="})
//      * })
//      */
//
//     return {
//         promise: task.startAirKiss(),
//         destory: ()=>{ task.destroy() }
//     };
// }

function startConfigNetwork(ssid, bssid, pwd){
    let task = new EsptouchTask(ssid, bssid, pwd);

    return {
        promise: task.start().then(res=>{
            // android 返回空res，按超时处理
            if(!res||!res.length){
                return Promise.reject({
                    code: "PROTOCOL_TIMEOUT"
                });
            }
            return {
                mac: res[0].bssid.substr(2, 12),
                address: res[0].inetAddress
            }
        }),
        destory: ()=>{ task.interrupt() }
    };
}
```

协议适配层promise返回值

```javascript
// promise resolve 返回配网成功信息
{
    "mac": "xxxxx"                  // 设备的mac地址
    "address": "192.168.xx.xx"      // 设备本地网络ip地址
}

// promise reject 返回配网错误信息

// 配网超时
{
   "code": "PROTOCOL_TIMEOUT"
}

/**
 * 微信接口错误
 * 
 * 格外注意，ios系统或部分安卓系统在系统设置中关闭了微信应用本地网络的权限(此时无法在本地网络发送数据广播)
 * 将会返回errNum = 65的错误，需要特殊处理，提示用户在设置中打开本地网络
 */
{
    "code": "UDP_ERROR/SEND_ERROR/...",     // 错误代码
    "errNum": 65                            // 错误码，依赖微信自身接口实现
    "errMsg": "错误描述"                     // 错误描述
    "error": Error("")                      // 额外的错误情况，Error对象或字符串 
}

// 其它错误
Error("")       // Error对象
```

推荐逻辑处理

* 注意：在小程序页面销毁时或任何需要中止配网的场景，一定要调用`task.destory`,否则配网端口会被占用没有释放，再次配网会失败

```javascript
var task = startConfigNetwork(ssid, bssid, pwd)

task.promise.then(res=>{
    /**
     * 原则上类库会自动销毁连接资源，
     * 此处只做饱合式调用，防止因其它异常引起资源没有被销毁
     */
    task.destory();

    // 以下做配网成功处理
    // res.mac: 设备mac地址
    // res.address: 设备本地ip地址
}).catch(err=>{
    // 同上
    task.destory();

    if(!err){
        // 未知错误，原则上不会进入该分支，可以做弹窗提示
        return
    }

    if(err&&err.code==="PROTOCOL_TIMEOUT"){
        // 配网超时，进入超时处理逻辑
        return
    }

    if(err instanceof Error){
        // 其它错误，做弹窗提示
        return
    }

    if(err&&err.errNum&&err.errNum===65){
        // ios本地网络权限未打开，引导用户打开相关权限
        return;
    }

    // 其它微信接口错误描述和错误码
    var errorMsg = err.errMsg || (err.error instanceof Error ? err.error.message : err.error) || "";
    var code = err.code;
    // 可以做弹窗提示
});
```