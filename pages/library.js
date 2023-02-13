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
  var userAgentInfo = navigator.userAgent.toLowerCase()
  var Agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod']
  //var ly = document.referrer
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) >= 0) {
      // && (ly == '' || ly == null)
      isMobile = true
    }
  }
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
  return '../waves/' + title + '.mp3'
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

      let position = e.clientX - control.offsetLeft
      let total = control.offsetWidth - 60
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
function onTouchEnd(e) {
  //手指离开设置进度
  touching = false
  if (!audio.paused && clickedIndex != -1) {
    let index = Number(clickedIndex)
    if (index == playingIndex) {
      tapped = e.timeStamp - timeStamp < 350
      if (tapped) {
        let position = e.clientX - control.offsetLeft
        let total = control.offsetWidth - 60
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
