let workList = [
  { title: '空曲目1', isPlaying: 0 },
  { title: '空曲目2', isPlaying: 0 },
]
let files = [
  { title: '2022-11-23' },
  { title: '2022-05-04' },
  { title: '2022-04-01' },
  { title: '2022-03-06' },
  { title: '2022-03-01' },
  { title: '2022-02-26' },
  { title: '2022-02-25' },
]
let audio = new Audio()
let playingIndex = -1
let shouldUpdate = false
let ratio = undefined
let control = undefined
let cycling = 0
let tapped = true
let timeStamp = 0
let touching = false
let isMobile = false
let clickedIndex = -1

window.onload = function () {
  checkOS()
  setWorkInfo()
}

function checkOS() {
  isMobile = navigator.userAgentData.mobile
}

function setAttr(isClass, selectName, attrName, value) {
  if (isClass) {
    for (let i of document.getElementsByClassName(selectName)) {
      i.setAttribute(attrName, value)
    }
  } else {
    document.getElementById(selectName).setAttribute(attrName, value)
  }
}

function setText(isClass, selectName, value) {
  if (isClass) {
    for (let i of document.getElementsByClassName(selectName)) {
      i.innerHTML = value
    }
  } else {
    document.getElementById(selectName).innerHTML = value
  }
}

function getFixed(value) {
  //取两位小数
  return Math.floor(value * 100) / 100
}

function getAudioLength() {
  //计算进度条的长度
  return parseInt((audio.currentTime / audio.duration) * 100).toString() + '%'
}
function getFileName(title) {
  //合并成文件名
  return 'https://cubic759.github.io/waves/' + title + '.mp3'
}
function setCycling() {
  if (cycling < 2) {
    cycling += 1
  } else {
    cycling = 0
  }
  if (cycling == 0) {
    setAttr(true, 'cycleImage', 'src', '../images/noCycle.svg')
    setText(true, 'cycleText', '单次播放')
  } else if (cycling == 1) {
    setAttr(true, 'cycleImage', 'src', '../images/listCycle.svg')
    setText(true, 'cycleText', '列表循环')
  } else {
    setAttr(true, 'cycleImage', 'src', '../images/singleCycle.svg')
    setText(true, 'cycleText', '单曲循环')
  }
}
function setCurrentLength(value) {
  //设置进度条的长度
  if (playingIndex != -1) {
    workList[playingIndex].currentLength = value
    document
      .getElementsByClassName('workBottomLine')
      [playingIndex].setAttribute('style', 'width:' + value)
  }
}
function setTapLength(value) {
  //设置调进度条的长度
  if (playingIndex != -1) {
    workList[playingIndex].tapLength = value
    document
      .getElementsByClassName('workWholeLine')
      [playingIndex].setAttribute('style', 'width:' + value)
  }
}

function startPlay(index) {
  setCurrentLength('0%')
  if (playingIndex != -1) {
    workList[playingIndex].isPlaying = 0
    document
      .getElementsByClassName('controlImage')
      [playingIndex].setAttribute('src', '../images/play.svg')
  }
  audio.pause()
  audio = new Audio()
  audio.preload = 'auto'
  playingIndex = index
  audio.addEventListener('timeupdate', function () {
    if (shouldUpdate) {
      setCurrentLength(getAudioLength())
    }
  })
  audio.src = getFileName(files[playingIndex].title)
  audio.addEventListener('ended', function () {
    if (cycling == 0) {
      stopped = true
      setCurrentLength('0%')
      if (playingIndex != -1) {
        workList[playingIndex].isPlaying = 0
        setAttr(true, 'controlImage', 'src', '../images/play.svg')
      }
    } else if (cycling == 1) {
      if (playingIndex < files.length - 1) {
        startPlay(playingIndex + 1)
      } else {
        startPlay(0)
      }
    } else {
      startPlay(playingIndex)
    }
  })
  shouldUpdate = true
  if (playingIndex != -1) {
    workList[playingIndex].isPlaying = 1
    document
      .getElementsByClassName('controlImage')
      [playingIndex].setAttribute('src', '../images/pause.svg')
  }
  audio.addEventListener('canplay', function () {
    audio.play()
  })
  stopped = false
}

function bindEvent(dom, eventName, listener) {
  if (dom.attachEvent) {
    dom.attachEvent('on' + eventName, listener)
  } else {
    dom.addEventListener(eventName, listener)
  }
}

function setWorkInfo() {
  //显示作品
  let all = Array.from(files)
  for (let info of all) {
    info['isPlaying'] = 0
    info['currentLength'] = '0%'
    info['tapLength'] = '0%'
  }
  workList = all
  let containers = document.getElementsByClassName('list')
  let i
  for (let j = 0; j < files.length; j++) {
    if (j == 0) {
      i = containers[0]
    } else {
      i = containers[1]
    }
    i.innerHTML +=
      `<div class="work">
      <div
    class="textContainer"
  >
    <div class="workBlockTitle">` +
      files[j].title +
      `</div>
    <div class="workBottomLine" style="width:` +
      workList[j].currentLength +
      `"></div>
    <div class="workWholeLine" style="width:` +
      workList[j].tapLength +
      `"></div>
  </div>
  <div
    class="controlContainer" data="` +
      j +
      `"
    onclick="onClick(this)"
  >
    <div class="control">
      <image
        class="controlImage"
        src="../images/play.svg"
      ></image>
    </div>
  </div></div>`
  }

  let a = document.getElementsByClassName('work')
  control = a[0]
  if (isMobile) {
    console.log('isMobile')
    for (let i of a) {
      bindEvent(i, 'touchmove', function (e) {
        if (!audio.ended && !audio.paused) {
          e['data'] = i.lastChild.getAttribute('data')
          onTouchMove(e)
        }
      })
      bindEvent(i, 'touchend', function (e) {
        if (!audio.ended && !audio.paused) {
          e['data'] = i.lastChild.getAttribute('data')
          onTouchEnd(e)
        }
      })
      bindEvent(i, 'touchstart', function (e) {
        if (!audio.ended && !audio.paused) {
          e['data'] = i.lastChild.getAttribute('data')
          onTouchStart(e)
        }
      })
      bindEvent(i, 'touchcancel', function () {
        if (!audio.ended && !audio.paused) {
          onTouchCancel()
        }
      })
    }
  } else {
    for (let i of a) {
      bindEvent(i, 'mousemove', function (e) {
        if (!audio.ended && !audio.paused) {
          e['data'] = i.lastChild.getAttribute('data')
          onTouchMove(e)
        }
      })
      bindEvent(i, 'mousedown', function (e) {
        if (!audio.ended && !audio.paused) {
          e['data'] = i.lastChild.getAttribute('data')
          onTouchStart(e)
        }
      })
    }
    bindEvent(document, 'mouseup', function (e) {
      if (!audio.ended && !audio.paused) {
        onTouchEnd(e)
      }
    })
  }
}

function onClick(e) {
  //点击控件播放/暂停
  let index = Number(e.getAttribute('data'))
  if (playingIndex == index) {
    if (audio.ended) {
      audio.pause()
      shouldUpdate = true
      audio.play()
      stopped = false
      workList[playingIndex].isPlaying = 1
      document
        .getElementsByClassName('controlImage')
        [playingIndex].setAttribute('src', '../images/pause.svg')
    } else if (audio.paused) {
      shouldUpdate = true
      audio.play()
      stopped = false
      workList[playingIndex].isPlaying = 1
      document
        .getElementsByClassName('controlImage')
        [playingIndex].setAttribute('src', '../images/pause.svg')
    } else {
      audio.pause()
      shouldUpdate = false
      workList[playingIndex].isPlaying = 0
      document
        .getElementsByClassName('controlImage')
        [playingIndex].setAttribute('src', '../images/play.svg')
      setTapLength('0%')
    }
  } else {
    startPlay(index)
  }
}
function onTouchMove(e) {
  //滑动调整进度
  if (e && !audio.paused && !audio.ended && touching) {
    let index = Number(e.data)
    if (index == playingIndex) {
      if (shouldUpdate) {
        shouldUpdate = false
      }
      setCurrentLength('0%')
      let position
      let total
      if (isMobile) {
        position = e.changedTouches[0].clientX - control.offsetLeft
        total = control.offsetWidth - 60
      } else {
        position = e.clientX - control.offsetLeft
        total = control.offsetWidth - 60
      }
      if (position <= total && position >= 0) {
        ratio = position / total
        setTapLength(getFixed(ratio * 100).toString() + '%')
      }
    }
  }
}
function onTouchStart(e) {
  clickedIndex = e.data
  touching = true
  if (!audio.paused && !audio.ended) {
    timeStamp = e.timeStamp
  }
}
function setProgress(ratio) {
  if (ratio) {
    audio.pause()
    audio.currentTime = audio.duration * getFixed(ratio)
    setTapLength('0%')
    setCurrentLength(getFixed(ratio * 100).toString() + '%')
    shouldUpdate = true
    audio.addEventListener('canplay', function () {
      audio.play()
      stopped = false
    })
  }
}
function onTouchEnd(e) {
  //手指离开设置进度
  touching = false

  if (!audio.paused && clickedIndex != -1) {
    let index = Number(clickedIndex)
    if (index == playingIndex) {
      tapped = e.timeStamp - timeStamp < 350
      if (tapped) {
        let position
        let total
        if (isMobile) {
          position = e.changedTouches[0].clientX - control.offsetLeft
          total = control.offsetWidth - 60
        } else {
          position = e.clientX - control.offsetLeft
          total = control.offsetWidth - 60
        }
        if (position <= total) {
          setProgress(position / total)
        }
      } else {
        setProgress(ratio)
      }
    }
    clickedIndex = -1
  }
}
function onTouchCancel() {
  //恢复原状
  setTapLength('0%')
  if (!audio.paused && !audio.ended && !shouldUpdate) {
    shouldUpdate = true
  }
}

;(function (win, lib) {
  var doc = win.document //当前文档对象
  var docEl = doc.documentElement //文档对象根元素的只读属性
  var metaEl = doc.querySelector('meta[name="viewport"]')
  var flexibleEl = doc.querySelector('meta[name="flexible"]')
  var dpr = 0
  var scale = 0
  var tid
  var flexible = lib.flexible || (lib.flexible = {})

  if (metaEl) {
    //当meta中viewport的标签设置了scale时，将根据scale手动设置dpr
    console.warn('将根据已有的meta标签来设置缩放比例')
    var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/)
    if (match) {
      scale = parseFloat(match[1])
      dpr = parseInt(1 / scale)
    }
  } else if (flexibleEl) {
    //当meta中flexible的标签存在时，据此设置dpr
    var content = flexibleEl.getAttribute('content')
    if (content) {
      var initialDpr = content.match(/initial\-dpr=([\d\.]+)/)
      var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/)
      if (initialDpr) {
        dpr = parseFloat(initialDpr[1])
        scale = parseFloat((1 / dpr).toFixed(2))
      }
      if (maximumDpr) {
        dpr = parseFloat(maximumDpr[1])
        scale = parseFloat((1 / dpr).toFixed(2))
      }
    }
  }

  if (!dpr && !scale) {
    //根据js获取到的devicePixelRatio设置dpr及scale，scale是dpr的倒数
    var isAndroid = win.navigator.appVersion.match(/android/gi)
    var isIPhone = win.navigator.appVersion.match(/iphone/gi)
    var devicePixelRatio = win.devicePixelRatio
    if (isIPhone) {
      // iOS下，对于2和3的屏，分别用2和3倍方案
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
        dpr = 3
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
        dpr = 2
      } else {
        dpr = 1
      }
    } else {
      // 其他设备下，仍旧使用1倍的方案
      dpr = 1
    }
    scale = 1 / dpr
  }

  docEl.setAttribute('data-dpr', dpr)
  //文本字号不建议使用rem，flexible适配方案中，文本使用px作为单位，使用[data-dpr]属性来区分不同dpr下的文本字号

  if (!metaEl) {
    //添加meta标签，设置name为viewport，content根据scale设置缩放比(默认、最大、最小缩放比)
    metaEl = doc.createElement('meta')
    metaEl.setAttribute('name', 'viewport')
    metaEl.setAttribute(
      'content',
      'initial-scale=' +
        scale +
        ', maximum-scale=' +
        scale +
        ', minimum-scale=' +
        scale +
        ', user-scalable=no'
    )
    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(metaEl)
    } else {
      var wrap = doc.createElement('div')
      wrap.appendChild(metaEl)
      doc.write(wrap.innerHTML)
    }
  }

  function refreshRem() {
    //更新rem值
    var width = docEl.getBoundingClientRect().width
    if (width / dpr > 540) {
      width = 540 * dpr
    }
    var rem = width / 10 //1rem = viewWidth / 10
    docEl.style.fontSize = rem + 'px'
    flexible.rem = win.rem = rem
  }

  //resize与pageshow延时300ms触发refreshRem(),使用防抖函数，防止事件被高频触发可能引起性能问题
  win.addEventListener(
    'resize',
    function () {
      clearTimeout(tid)
      tid = setTimeout(refreshRem, 300)
    },
    false
  )
  win.addEventListener(
    'pageshow',
    function (e) {
      //当一条会话历史纪录被执行的时候触发事件，包括后退/前进按钮，同时会在onload页面触发后初始化页面时触发
      if (e.persisted) {
        //表示网页是否来自缓存
        clearTimeout(tid)
        tid = setTimeout(refreshRem, 300)
      }
    },
    false
  )

  //在html文档加载和解析完成后设置body元素字体大小
  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 12 * dpr + 'px'
  } else {
    doc.addEventListener(
      'DOMContentLoaded',
      function (e) {
        doc.body.style.fontSize = 12 * dpr + 'px'
      },
      false
    )
  }
  //浏览器有最小字体限制，css在pc上font-size是12px(移动端最小是8px), 也就是css像素是12，其DPR为1，在移动端dpr有可能为2和3，为了保证字体不变小，需要用12*dpr进行换算。

  refreshRem()

  //实现rem与px相互转换
  flexible.dpr = win.dpr = dpr
  flexible.refreshRem = refreshRem
  flexible.rem2px = function (d) {
    var val = parseFloat(d) * this.rem
    if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px'
    }
    return val
  }
  flexible.px2rem = function (d) {
    var val = parseFloat(d) / this.rem
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem'
    }
    return val
  }
})(window, window['lib'] || (window['lib'] = {}))
