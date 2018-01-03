<template>
  <div id="container">
    <div id="iframe-box" v-html="content"></div>
    <div class="page__footer">
      <x-button text="下一步" @click.native="onNextHandler"></x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import { mapState } from 'vuex'
import { JsonToUrlParam, reg } from '@/utils'

let PREV_ROUTER_NAME = '' // 上个页面的路由name

export default {
  name: 'CarInsurance__Select',
  components: { XButton },
  data() {
    return {
      content: '',
      script: ''
    }
  },
  computed: {
    ...mapState({
      openid: state => state.openid
    })
  },
  created() {
    // 从Api模块下load一个html 过来
    this.$store.commit('updateLoading', true)
    this.$http.post(this.$route.query.baseURL, this.$route.params)
      .then(res => {
        this.$store.commit('updateLoading', false)
        res = res.data
        if (typeof res === 'string') {
          this.content = res
        } else
          this.toastFail(res.code)
      })
    window.vueRouter = this.$router
    window.vueRoute = this.$route
  },
  updated() {
    // load过来的html的js默认不会执行, 处理一下让它执行
    let iframe = this.$el.querySelector('#iframe-box')
    let script = Array.apply(null, iframe.querySelectorAll('script'))
    let jQueryScript = script.filter(item => /jQuery/i.test(item.src))[0]
    let tempArr = []

    iframe.querySelector('.foot_button').removeAttribute('onclick')
    iframe.querySelector('.foot_button').innerText = ''
    iframe.querySelector('.foot_button').style.backgroundColor = 'transparent'

    const _this = this
    function jQueryLoad(callback) {
      script = script.filter(item => !/jQuery/i.test(item.src))
      _this.$http.get(jQueryScript.src)
        .then(res => {
          let element = document.createElement('script')
          element.setAttribute('type', 'text/javascript')
          element.setAttribute('src', jQueryScript.src)
          element.onload = () => callback()
          iframe.appendChild(element)
          iframe.removeChild(jQueryScript)
        })
        .catch(err => {throw err})
    }

    jQueryLoad(() => {
      script.forEach((el, index) => {
        let element = document.createElement('script')
        element.setAttribute('type', 'text/javascript')
        if (el.src) {
          if (el.src.match('packaged-assets/Insurance')) {
            this.$http.get(el.src).then(res => {
              tempArr.push(res.data)
              if (tempArr.length > 1) {
                  Promise.resolve().then(res => {
                    return this.script = tempArr.reverse().join('\n')
                  }).then(res => {
                    eval(res)
                  }).catch((err) => {
                    alert(err)
                  })
              }
            }).catch(err => {throw err})
          }
          element.src = el.src
        } else {
          element.innerHTML = el.innerText
        }

        iframe.appendChild(element)
        iframe.removeChild(el)
      })
    })

    let link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.href = '/Public/static/viewJs/api/js/layer/need/layer.css'
    iframe.appendChild(link)
  },
  beforeRouteEnter(to, from, next) {
    PREV_ROUTER_NAME = from.name
    next()
  },
  methods: {
    submit() {
      let requestURL =
        PREV_ROUTER_NAME === 'CarInsurance'
          ? '/index.php/Xiaochengxu/CarInsurance/saveOrder'
          : '/index.php/Xiaochengxu/CarInsurance/updateOldInsurance'

      this.$store.commit('updateLoading', true)
      this.$http.post(requestURL, window.JSON1)
        .then(res => {
          res = res.data
          this.$store.commit('updateLoading', false)

          if (res.code == 0) {
            this.$router.push({
              name: 'CarInsurance__Result',
              params: this.$route.params
            })
          } else {
            this.toastFail(res.msg)
          }
        })
    },
    onNextHandler() {
      window.submitFm()
      window.JSON1.openId = this.openid || this.$route.params.openid

      if (PREV_ROUTER_NAME === 'CarInsurance') {
        this.$vux.confirm.prompt('', {
          title: '请填写您的联系方式',
          // theme: 'android',
          closeOnConfirm: false,
          inputAttrs: {
            type: 'tel',
            maxLength: 11
          },
          onConfirm: tel => {
            if (reg('tel', tel)) {
              window.JSON1.tel = tel
              this.submit()
              this.$vux.confirm.hide()
            } else
              this.toastFail('请输入正确的手机号', 13)
          }
        })
      } else {
        window.JSON1.order_sn = this.$route.params.order_sn
        this.submit()
      }
    }
  }
}
</script>

<style lang="less" scoped>
#container,
#iframe-box {
  width: 100%;
  height: 100%;
}

#iframe-box {
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.page__footer {
  position: absolute;
  top: 100%;
  margin-top: -55px;
}
</style>

