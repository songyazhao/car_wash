import md5 from '../md5'
import stringRandom from '../string/random.js'
import queryParse from '../query/parse.js'

const __APPID__ = require('@/app_config.js').appId

/**
 * 签名验证
 * @param {Object} params
 * @param {Object} params
 */
const Sign = class {
  constructor(params) {
    this.params = params
  }

  getSign(type = 'default') {
    type.match(/\b(wx|wxpay|wechat|wechatpay)\b/i) && (type = 'wx')
    switch (type.toLowerCase()) {
      case 'wx':
        return this.wxPaySign()
      default:
        return this.defaultSign()
    }
  }

  defaultSign() {
    let str = queryParse(this.keySort(this.params))
    str = `${str}&key=${__APPID__}`

    let sign_temp = md5(str).toUpperCase(), sign = []
    for (let i = 0; i < sign_temp.length; i++) {
      if (i % 2 === 0)
        sign.push(sign_temp.substr(i, 2))
    }
    sign.forEach((v, i) => sign[i] += stringRandom(1))
    return sign.join('')
  }

  wxPaySign() {
    let str = queryParse(this.keySort(this.params))
    str = `${str}&key=${__APPID__}`

    let sign_temp = md5(str).toUpperCase(), sign = []
    for (let i = 0; i < sign_temp.length; i++) {
      if (i % 2 === 0)
        sign.push(sign_temp.substr(i, 2))
    }
    sign.forEach((v, i) => sign[i] += stringRandom(1))
    return sign.join('')
  }

  /**
   * JSON对象按照ASCII码排序的函数
   * @param {Object} obj   需要排序的JSON对象
   */
  keySort(obj) {
    let newkey = Object.keys(obj).sort();
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    let newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
      if (obj[newkey[i]])
        newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj;//返回排好序的新对象
  }
}

export default Sign