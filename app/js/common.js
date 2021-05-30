/**
 * 常用
 * Created by ll36 on 2017/8/16.
 */
import Config from './config';

const Common = {
  //调整rem
  setTime: null,
  body_width: 0,
  reSize: function () {
    let $this = this;
    if (this.setTime) {
      clearTimeout(this.setTime);
      this.setTime = null;
    }
    if (this.body_width == 0) {
      window.onresize = function () {
        $this.reSize();
      };
    }
    this.setTime = setTimeout(function () {
      $this.setTime = null;
      let body_width_change = document.body.clientWidth;
      body_width_change = body_width_change > 512 ? 512 : body_width_change;
      if ($this.body_width != body_width_change) {
        $this.body_width = body_width_change;
        document.body.parentElement.style.fontSize = Math.round(($this.body_width / 320 / 16 * 1000) * 100) / 100 + '%';
      }
    }, 100);
  },
  //检测textEdit
  checkTextEdit: function (list) {
    if (!list || typeof(list) != 'object' | !list.length) {
      return false;
    }
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].hasOwnProperty('errmsg') && list[i].errmsg.length) {
        return false;
      }
    }
    return true;
  },
  //数组排序
  arrSort(arr, name, asc) {
    let list = arr.slice(0);
    for (let i = 0, len = list.length; i < len; i++) {
      for (let j = 0; j < len; j++) {
        let a = name ? list[i][name] : list[i], b = name ? list[j][name] : list[j];
        if (a < b && !asc) {
          let temp = list[j];
          list[j] = list[i];
          list[i] = temp;
        }
      }
    }
    return list;
  },
  //利用localStorage缓存(time:默认永久(单位-分钟))
  setCache: function (key, value, time) {
    let _setCache = function (_key, _value, _time) {
      let curTime = 0;
      if (_time && Number(_time)) {
        curTime = new Date().getTime() + _time * 1000 * 60;
      }
      if (_value) {
        localStorage.setItem(_key, JSON.stringify({data: _value, time: curTime}));
      }
      else {
        localStorage.removeItem(_key);
      }
    };
    if (typeof(key) === 'object') {
      key.map(item => {
        _setCache(item[0], item.length > 1 ? item[1] : null, item.length > 2 ? item[2] : null);
      });
    } else {
      _setCache(key, value, time);
    }
  },
  getCache: function (key) {
    const data = localStorage.getItem(key);
    if (!data) {
      return null;
    }
    const dataObj = JSON.parse(data);
    if (dataObj.hasOwnProperty('time') && dataObj.time != 0 && new Date().getTime() > dataObj.time) {
      this.setCache(key, null);
      return null;
    } else if (dataObj.hasOwnProperty('data')) {
      return JSON.parse(dataObj.data)
    } else {
      return dataObj;
    }
  },
  //绑定事件
  addEvent: function (el, e, f) {//绑定事件
    if (el) {
      const eArray = e.split(' ');

      function _addEvent(_el, _e, _f) {
        if (_el.addEventListener) {
          _el.addEventListener(_e, _f);
        } else if (_el.attachEvent) {
          _el.addEventListener('on' + _e, _f);
        } else {
          _el['on' + _e] = _f;
        }
      }

      for (let i = 0, len = eArray.length; i < len; i++) {
        if (el.length) {
          for (let j = 0, _len = el.length; j < _len; j++) {
            _addEvent(el[j], eArray[i], f);
          }
        }
        else {
          _addEvent(el, eArray[i], f);
        }
      }
    }
  },
  //时间格式化
  dateFtt: function (fmt, date) {
    const o = {
      'M+': date.getMonth() + 1,                 //月份
      'd+': date.getDate(),                    //日
      'h+': date.getHours(),                   //小时
      'm+': date.getMinutes(),                 //分
      's+': date.getSeconds(),                 //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      'S': date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  },
  // 浅拷贝
  simpleClone: function (p) {
    let c = {};
    for (let i in p) {
      if (p.hasOwnProperty(i)) {
        c[i] = p[i];
      }
    }
    return c;
  },
  // 深拷贝
  deepClone: function (p, c) {
    c = c || {};
    for (let i in p) {
      if (typeof p[i] == 'object') {
        c[i] = (p[i].constructor === Array) ? [] : {};
        deepClone(p[i], c[i]);
      } else {
        if (p.hasOwnProperty(i)) {
          c[i] = p[i];
        }
      }
    }
    return c;
  },
  getUrl: function (url) {
    if (!url) {
      return '';
    }
    //if (url.indexOf('http') == 0)
    //    return url;
    let fileUrl = /[mp4|mov]$/.test(url);

    if (url.indexOf('/') == 0) {
      return (fileUrl ? Config.videoUrl : Config.imgUrl) + url;
    } else {
      return (fileUrl ? Config.videoUrl : Config.imgUrl) + '/' + url;
    }
  },
  signIn: function (vue, oauthUId, oauthToken, type, callback) {
    vue.$http.jsonp(Config.apiUrl + Config.urlsEnum.loginIn,
      {
        params: {
          oauthUId: oauthUId,
          oauthToken: oauthToken,
          type: type
        }
      }).then(res => {
      res = res.data;
      callback && callback(res);
    }, function (e) {
      console.log(e);
    });
  },
  signOut: function (vue, callback) {
    let $this = this;
    vue.$http.jsonp(Config.apiUrl + Config.urlsEnum.loginOut,
      {
        params: {
          uid: this.getCache('yunli_uid'),
          token: this.getCache('yunli_token')
        }
      }).then(res => {
      res = res.data;
      if (res.result == 1) {
        $this.setCache([['yunli_uid'], ['yunli_token']]);
      }
      callback && callback(res);
    }, function (e) {
      console.log(e);
    });
  },
  getUser: function (vue, oauthUId, oauthToken, callback) {
    vue.$http.jsonp(Config.apiUrl + Config.urlsEnum.getUser,
      {
        params: {
          oauthUId: oauthUId,
          oauthToken: oauthToken
        }
      }).then(res => {
      res = res.data;
      callback && callback(res);
    }, function (e) {
      console.log(e);
    });
  },
};
export default Common;
