<template>
<div class="index-page">
    <div class="container-bg">
      <div class="item-border pos-first">
        <a href="#/sport">运力</a>
      </div>
      <div class="item-border pos-second">
        <a href="https://blog.ll36.cn">Blog</a>
      </div>
      <div class="item-border pos-third">
        <a href="#/Gobang">Game</a>
      </div>
      <div class="earth-wrap">
        <img
          src="https://img.alicdn.com/imgextra/i1/O1CN017gremg1L8NMgGE5Gd_!!6000000001254-2-tps-336-336.png"
          alt="earth"
        />
      </div>
      <div class="footer-wrap">
        <p>
          <a href="https://beian.miit.gov.cn" target="_blank"
            >浙ICP备15017476号</a
          >
        </p>
      </div>
    </div>    </div>
</template>
<script>
export default{
  data () {
    return {

    }
  },
  mounted: function () {
    document.title = '静海觅光'
  }
}
</script>
<style lang="less" scoped>
      .index-page {
        position: relative;
        overflow: hidden;
        background-image: linear-gradient(to bottom,#000, #28353e, #1f213e);
        &:before{
          -webkit-animation: slide 18s linear infinite;
          -moz-animation: slide 18s linear infinite;
          -o-animation: slide 18s linear infinite;
          -ms-animation: slide 18s linear infinite;
          animation: slide 18s linear infinite;
          background-image: url(https://blog.ll36.cn/images/stars.svg);
          background-position: center center;
          -webkit-background-size: 240px;
          -moz-background-size: 240px;
          background-size: 240px;
          width: 400%;
          height: 400%;
          left: -200%;
          top: -200%;
          position: absolute;
          content: '';
        }
      }
      .container-bg {
        position: relative;
        width: 100%;
        max-width: 1440px;
        min-height: 100vh;
        margin: 0 auto;
      }
      .container-bg .earth-wrap {
        position: absolute;
        top: 30%;
        right: -46%;
        width: 90%;
        max-width: 600px;
      }
      .container-bg .earth-wrap img {
        width: 100%;
        animation: rotate 30s 0s infinite linear;
      }
      .item-border {
        position: absolute;
        z-index: 1;
        padding: 12px 30px;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 10px;
        font-size: 16px;
      }
      .item-border a {
        color: #ccc;
        text-decoration: none;
      }
      .pos-first{
        top: 5%;
        right: 10%;
      }
      .pos-second{
        top: 35%;
        left: 10%;
      }
      .pos-third{
        top: 70%;
        left: 10%;
      }
      /* 底部 */
      .footer-wrap {
        position: absolute;
        bottom: 20px;
        width: 100%;
        text-align: center;
      }
      .footer-wrap a {
        color: #4288f5;
      }
      /* 动画 */
      @keyframes rotate {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @-webkit-keyframes rotate /*Safari and Chrome*/ {
        from {
          -webkit-transform: rotate(0);
        }
        to {
          -webkit-transform: rotate(360deg);
        }
      }

@-moz-keyframes slide {
    0% {
        -webkit-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -ms-transform: translate3d(0,0,0);
        -o-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }

    100% {
        -webkit-transform: translate3d(-240px,240px,0);
        -moz-transform: translate3d(-240px,240px,0);
        -ms-transform: translate3d(-240px,240px,0);
        -o-transform: translate3d(-240px,240px,0);
        transform: translate3d(-240px,240px,0)
    }
}

@-webkit-keyframes slide {
    0% {
        -webkit-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -ms-transform: translate3d(0,0,0);
        -o-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }

    100% {
        -webkit-transform: translate3d(-240px,240px,0);
        -moz-transform: translate3d(-240px,240px,0);
        -ms-transform: translate3d(-240px,240px,0);
        -o-transform: translate3d(-240px,240px,0);
        transform: translate3d(-240px,240px,0)
    }
}

@-o-keyframes slide {
    0% {
        -webkit-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -ms-transform: translate3d(0,0,0);
        -o-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }

    100% {
        -webkit-transform: translate3d(-240px,240px,0);
        -moz-transform: translate3d(-240px,240px,0);
        -ms-transform: translate3d(-240px,240px,0);
        -o-transform: translate3d(-240px,240px,0);
        transform: translate3d(-240px,240px,0)
    }
}

@keyframes slide {
    0% {
        -webkit-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -ms-transform: translate3d(0,0,0);
        -o-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }

    100% {
        -webkit-transform: translate3d(-240px,240px,0);
        -moz-transform: translate3d(-240px,240px,0);
        -ms-transform: translate3d(-240px,240px,0);
        -o-transform: translate3d(-240px,240px,0);
        transform: translate3d(-240px,240px,0)
    }
}
    </style>
