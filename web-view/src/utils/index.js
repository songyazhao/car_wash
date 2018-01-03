import { md5 } from 'vux'
const __APPID__ = 'wx0d3e79673b79201f' //AppID
const __APPSECRET__ = 'e64cbc85e00dd944343896868c30471f' //密钥
const __KEY__ = 'c8428d0773fc7a656b7cfcfb0cb4ac62' //sign验证密钥

/**
 * 指定数字前置补0
 * @param {Number} num 要进行补0的数字
 * @param {Number} n   包括补充的0在内的总位数
 */
function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}

/**
 * JSON格式转URL参数格式
 * @param {String} baseUrl   基于此URL拼接(可选)
 * @param {Object} obj       需要转的JSON对象
 */
function JsonToUrlParam(baseUrl, obj) {
  if (typeof baseUrl === 'object') (obj = baseUrl, baseUrl = '')
  else baseUrl += '?'

  for (let k in obj) {
    baseUrl += k + '=' + obj[k] + "&"
  }
  return baseUrl.substr(0, baseUrl.length - 1);
}

/**
 * JSON对象按照ASCII码排序的函数
 * @param {Object} obj   需要排序的JSON对象
 */
function objKeySort(obj) {
  let newkey = Object.keys(obj).sort();
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  let newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
    if (obj[newkey[i]])
      newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;//返回排好序的新对象
}

/**
 * 签名验证
 * @param {Object} params
 */
function getSign(params) {
  let str = JsonToUrlParam(objKeySort(params)) + '&key=' + __KEY__;

  let sign_temp = md5(str).toUpperCase(), sign = [];
  for (let i = 0; i < sign_temp.length; i++) {
    if (i % 2 === 0)
      sign.push(sign_temp.substr(i, 2))
  }
  sign.forEach((v, i) => sign[i] += randomString(1))
  return sign.join('');
}

/**
 * 生成随机校验串
 * @param {Int} len
 */
function randomString(len = 32) {
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/**
 * 正则验证
 * @param {Object} name
 * @param {Object} value
 */
function reg(name, value) {
  switch (name) {
    case 'name': return value.match(/^[\u4e00-\u9fa5_a-zA-Z]{0,10}$/g)
    case 'tel': return value.match(/^(1[0-9])\d{9}$/g)
    case 'email': return value.match(new RegExp('^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}', 'g'))
    case 'price': return value.match(/(^(\d{0,5})\.\d{0,2}$)|(^\d{0,5}$)/g)
    case 'km': return value.match(/(^(\d{0,3})\.\d{0,2}$)|(^\d{0,3}$)/g) && value <= 100
    case 'license_number': return value.match(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/)
  }
}

function isEmptyObject(obj) {
  for (var key in obj) {
    return false
  };
  return true
}

/**
 * 字符串指定位置进行脱敏
 * @param {String} str         要进行处理的字符串
 * @param {String} replaceStr  替换成该字符串
 * @param {Array}  pos         起始位置[start, end]
 */
function replacePos(str, replaceStr, pos) {
  if (str === '') return str
  return str.substr(0, pos[0] - 1) + replaceStr + str.substr(pos[1])
}

/**
 * animation动画
 */
const animate = {
  slide(height = 0) {
    let style = document.querySelector('#animate')
    if (!style) {
      style = document.createElement('style')
      style.id = 'animate'
    }
    style.innerHTML = `
      @-webkit-keyframes slideDown {
        from { height: 0 }
        to { height: ${height}px }
      }
      @keyframes slideDown {
        from { height: 0 }
        to { height: ${height}px }
      }
      .slideDown {
        -webkit-animation: slideDown .35s cubic-bezier(.22,.61,.36,1);
        animation: slideDown .35s cubic-bezier(.22,.61,.36,1);
      }

      @-webkit-keyframes slideUp {
        from { height: ${height}px }
        to { height: 0 }
      }
      @keyframes slideUp {
        from { height: ${height}px }
        to { height: 0 }
      }
      .slideUp {
        -webkit-animation: slideUp .35s linear;
        animation: slideUp .35s linear;
      }
    `
    document.body.appendChild(style)
  }
}

/**
 * 微信支付
 * @param {Object} params
 * @param {Function} call:回调函数
 */
function callWxPay(params, call, Vue) {
  function onBridgeReady() {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', params,
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          call && call()
        } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
          Vue.$vux.toast.show({
            text: '取消支付',
            type: 'cancel',
            position: 'middle',
            // width: '9em'
          })
        } else { // 返回错误
          console.warn(res.err_desc)
          Vue.$vux.toast.show({
            text: res.err_desc,
            type: 'text',
            position: 'middle',
            // width: '9em'
          })
        }
      }
    );
  }
  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
}

/**
 * 银行家法则的四舍五入
 * @param {Number} number
 * @param {Number} length 小数点后保留的位数
 */
function toFixed(number, length) {
  number = parseFloat(number)
  let carry = 0 //存放进位标志
  let num, multiple //num为原浮点数放大multiple倍后的数，multiple为10的length次方
  let str = number + '' //将调用该方法的数字转为字符串
  let dot = str.indexOf(".") //找到小数点的位置
  if (str.substr(dot + length + 1, 1) >= 5) carry = 1 //找到要进行舍入的数的位置，手动判断是否大于等于5，满足条件进位标志置为1
  multiple = Math.pow(10, length) //设置浮点数要扩大的倍数
  num = Math.floor(number * multiple) + carry //去掉舍入位后的所有数，然后加上我们的手动进位数
  let result = num / multiple + '' //将进位后的整数再缩小为原浮点数
  /*
  * 处理进位后无小数
  */
  dot = result.indexOf(".")
  if (dot < 0) {
    result += '.'
    dot = result.indexOf(".")
  }
  /*
  * 处理多次进位
  */
  let len = result.length - (dot + 1)
  if (len < length) {
    for (let i = 0; i < length - len; i++) {
      result += 0
    }
  }
  return result
}

export {
  PrefixInteger,
  JsonToUrlParam,
  objKeySort,
  getSign,
  reg,
  isEmptyObject,
  replacePos,
  animate,
  callWxPay,
  toFixed
}
