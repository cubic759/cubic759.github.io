let workList = [
  { title: '空曲目1', isPlaying: 0 },
  { title: '空曲目2', isPlaying: 0 },
]
let imageNames = ["noCycle", "noListCycle", "listCycle", "singleCycle"]
let files = []
$.getJSON("../index.json", function (data) {
  files = data
});
let audio = new Audio()
let playingIndex = -1
let shouldUpdate = false
let ratio = undefined
let control = undefined
let cycling = 0
let theme = 0
let tapped = true
let timeStamp = 0
let touching = false
let isMobile = false
let clickedIndex = -1

window.onload = function () {
  checkOS()
  setWorkInfo()
}

function checkOS () {
  if (navigator.userAgentData != undefined) {
    isMobile = navigator.userAgentData.mobile
  } else {
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
}

function setAttr (isClass, selectName, attrName, value) {
  if (isClass) {
    for (let i of document.getElementsByClassName(selectName)) {
      i.setAttribute(attrName, value)
    }
  } else {
    document.getElementById(selectName).setAttribute(attrName, value)
  }
}

function setText (isClass, selectName, value) {
  if (isClass) {
    for (let i of document.getElementsByClassName(selectName)) {
      i.innerHTML = value
    }
  } else {
    document.getElementById(selectName).innerHTML = value
  }
}

function getFixed (value) {
  //取两位小数
  return Math.floor(value * 100) / 100
}

function getAudioLength () {
  //计算进度条的长度
  return parseInt((audio.currentTime / audio.duration) * 100).toString() + '%'
}
function getFileName (title) {
  //合并成文件名
  return 'https://cubic759.github.io/waves/' + title + '.mp3'
}
function setCycling () {
  if (cycling < 3) {
    cycling += 1
  } else {
    cycling = 0
  }
  let themeName = ""
  if (theme) {
    themeName = "_dark"
  }
  setAttr(true, 'cycleImage', 'src', '../images/' + imageNames[cycling] + themeName + '.svg')
  if (cycling == 0) {
    setText(true, 'cycleText', '单次播放')
  } else if (cycling == 1) {
    setText(true, 'cycleText', '单列播放')
  } else if (cycling == 2) {
    setText(true, 'cycleText', '列表循环')
  } else {
    setText(true, 'cycleText', '单曲循环')
  }
}

function setTheme () {
  if (theme < 1) {
    theme += 1
  } else {
    theme = 0
  }
  if (theme == 0) {
    setAttr(true, 'themeImage', 'src', '../images/light.svg')
    setText(true, 'themeText', '白')
    changeTheme(0)
  } else {
    setAttr(true, 'themeImage', 'src', '../images/dark.svg')
    setText(true, 'themeText', '黑')
    changeTheme(1)
  }
}

function changeTheme (value) {
  if (value) {
    $('#navigationBar').css("color", "white")
    $('#navigationBar').css("background", "rgb(37 37 37)")
    $('body').css("background-color", "rgb(33 33 33)")
    $('.content1Container').css("background-color", "#1d1d1d")
    $('.content2Container').css("background-color", "#1d1d1d")
    $('.cycleText').css("color", "white")
    $('.themeText').css("color", "white")
    $('.title').css("color", "white")
    $('.work').css("background-color", "#1d1d1d")
    $('.workBlockTitle').css("color", "white")
    $('.workWholeLine').css("background", "rgb(69 124 145)")
    $('.workBottomLine').css("background", "rgb(26 97 124)")
    $('.control').css("border-left", "1px solid #fefefe17")
    setAttr(true, 'cycleImage', 'src', '../images/' + imageNames[cycling] + "_dark" + '.svg')
    $('.controlImage').attr('src', '../images/play' + "_dark" + '.svg')
    if (playingIndex != -1 && workList[playingIndex].isPlaying == 1) {
      $('.controlImage').eq(playingIndex).attr('src', '../images/pause' + "_dark" + '.svg')
    }
  } else {
    $('#navigationBar').css("color", "black")
    $('#navigationBar').css("background", "#f8f8f8")
    $('body').css("background-color", "rgb(245, 245, 245)")
    $('.content1Container').css("background-color", "#f0f0f0")
    $('.content2Container').css("background-color", "#f0f0f0")
    $('.cycleText').css("color", "black")
    $('.themeText').css("color", "black")
    $('.title').css("color", "black")
    $('.work').css("background-color", "#f0f0f0")
    $('.workBlockTitle').css("color", "black")
    $('.workWholeLine').css("background", "#bfedff")
    $('.workBottomLine').css("background", "#45b9e5")
    $('.control').css("border-left", "1px solid #00000017")
    setAttr(true, 'cycleImage', 'src', '../images/' + imageNames[cycling] + '.svg')
    $('.controlImage').attr('src', '../images/play.svg')
    if (playingIndex != -1 && workList[playingIndex].isPlaying == 1) {
      $('.controlImage').eq(playingIndex).attr('src', '../images/pause.svg')
    }
  }
}

function showCurrentLength (value) {
  if (playingIndex != -1) {
    if (value) {
      document
        .getElementsByClassName('workBottomLine')
      [playingIndex].removeAttribute('hidden')
    } else {
      document
        .getElementsByClassName('workBottomLine')
      [playingIndex].setAttribute('hidden', 'true')
    }
  }
}
function showTapLength (value) {
  if (playingIndex != -1) {
    if (value) {
      document
        .getElementsByClassName('workWholeLine')
      [playingIndex].removeAttribute('hidden')
    } else {
      document
        .getElementsByClassName('workWholeLine')
      [playingIndex].setAttribute('hidden', 'true')
    }

  }
}
function setCurrentLength (value) {
  //设置进度条的长度
  if (playingIndex != -1) {
    workList[playingIndex].currentLength = value
    $('.workBottomLine').eq(playingIndex).css("width", value)
  }
}
function setTapLength (value) {
  //设置调进度条的长度
  if (playingIndex != -1) {
    workList[playingIndex].tapLength = value
    $('.workWholeLine').eq(playingIndex).css("width", value)
  }
}

function startPlay (index) {
  showCurrentLength(false)
  showTapLength(false)
  if (playingIndex != -1) {
    workList[playingIndex].isPlaying = 0
    let themeName = ""
    if (theme) {
      themeName = "_dark"
    }
    document
      .getElementsByClassName('controlImage')
    [playingIndex].setAttribute('src', '../images/play' + themeName + '.svg')
  }
  audio.pause()
  audio = new Audio()
  audio.autoplay = true
  audio.preload = 'auto'
  playingIndex = index
  audio.addEventListener('timeupdate', function () {
    if (shouldUpdate) {
      setCurrentLength(getAudioLength())
    }
  })
  audio.src = getFileName(files[playingIndex].title)
  audio.addEventListener('ended', function () {
    let themeName = ""
    if (theme) {
      themeName = "_dark"
    }
    if (cycling == 0) {
      stopped = true
      showCurrentLength(false)
      showTapLength(false)
      if (playingIndex != -1) {
        workList[playingIndex].isPlaying = 0
        setAttr(true, 'controlImage', 'src', '../images/play' + themeName + '.svg')
      }
      playingIndex = -1;
    } else if (cycling == 1) {
      if (playingIndex < files.length - 1) {
        startPlay(playingIndex + 1)
      } else {
        stopped = true
        showCurrentLength(false)
        showTapLength(false)
        if (playingIndex != -1) {
          workList[playingIndex].isPlaying = 0
          setAttr(true, 'controlImage', 'src', '../images/play' + themeName + '.svg')
        }
        playingIndex = -1;
      }
    } else if (cycling == 2) {
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
    let themeName = ""
    if (theme) {
      themeName = "_dark"
    }
    document
      .getElementsByClassName('controlImage')
    [playingIndex].setAttribute('src', '../images/pause' + themeName + '.svg')
  }
  audio.addEventListener('canplay', function () {
    audio.play()
  })
  stopped = false
  showCurrentLength(true)
}

function bindEvent (dom, eventName, listener) {
  if (dom.attachEvent) {
    dom.attachEvent('on' + eventName, listener)
  } else {
    dom.addEventListener(eventName, listener)
  }
}

function setWorkInfo () {
  //显示作品
  let all = Array.from(files)
  for (let info of all) {
    info['isPlaying'] = 0
    info['showCurrentLength'] = true
    info['showTapLength'] = true
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
          onMouseMove(e)
        }
      })
      bindEvent(i, 'mouseleave', function (e) {
        if (!audio.ended && !audio.paused) {
          e['data'] = i.lastChild.getAttribute('data')
          onMouseLeave(e)
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

function onClick (e) {
  //点击控件播放/暂停
  let index = Number(e.getAttribute('data'))
  if (playingIndex == index) {
    let themeName = ""
    if (theme) {
      themeName = "_dark"
    }
    if (audio.ended) {
      playingIndex = index;
      console.log('end')
      audio.pause()
      shouldUpdate = true
      audio.play()
      stopped = false
      workList[playingIndex].isPlaying = 1
      document
        .getElementsByClassName('controlImage')
      [playingIndex].setAttribute('src', '../images/pause' + themeName + '.svg')

    } else if (audio.paused) {
      console.log('paused')
      shouldUpdate = true
      audio.play()
      stopped = false
      workList[playingIndex].isPlaying = 1
      document
        .getElementsByClassName('controlImage')
      [playingIndex].setAttribute('src', '../images/pause' + themeName + '.svg')
    } else {
      audio.pause()
      showCurrentLength(true)
      showTapLength(false)
      shouldUpdate = false
      workList[playingIndex].isPlaying = 0
      document
        .getElementsByClassName('controlImage')
      [playingIndex].setAttribute('src', '../images/play' + themeName + '.svg')
    }
  } else {
    startPlay(index)
  }
}
function onMouseLeave (e) {
  let index = Number(e.data)
  if (index == playingIndex) {
    showCurrentLength(true)
    showTapLength(false)
  }
}
function onMouseMove (e) {
  //滑动调整进度
  if (e && !audio.paused && !audio.ended) {
    let index = Number(e.data)
    if (index == playingIndex) {
      if (touching && shouldUpdate) {
        shouldUpdate = false
      }
      let position
      let total
      position = e.clientX - control.offsetLeft
      total = control.offsetWidth - 60
      if (position <= total && position >= 0) {
        ratio = position / total
        showTapLength(true)
        setTapLength(getFixed(ratio * 100).toString() + '%')
        showCurrentLength(false)
      } else {
        showTapLength(false)
        showCurrentLength(true)
      }
    }
  }
}
function onTouchMove (e) {
  //滑动调整进度
  if (e && !audio.paused && !audio.ended && touching) {
    let index = Number(e.data)
    if (index == playingIndex) {
      if (shouldUpdate) {
        shouldUpdate = false
      }
      showCurrentLength(false)
      let position
      let total
      position = e.changedTouches[0].clientX - control.offsetLeft
      total = control.offsetWidth - 60
      if (position <= total && position >= 0) {
        ratio = position / total
        showTapLength(true)
        setTapLength(getFixed(ratio * 100).toString() + '%')
      }
    }
  }
}
function onTouchStart (e) {
  clickedIndex = e.data
  touching = true
  if (!audio.paused && !audio.ended) {
    timeStamp = e.timeStamp
  }
}
function setProgress (ratio) {
  if (ratio) {
    audio.pause()
    audio.currentTime = audio.duration * getFixed(ratio)
    showTapLength(false)
    showCurrentLength(true)
    setCurrentLength(getFixed(ratio * 100).toString() + '%')
    shouldUpdate = true
    audio.addEventListener('canplay', function () {
      audio.play()
      stopped = false
    })
  }
}
function onTouchEnd (e) {
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
function onTouchCancel () {
  //恢复原状
  showTapLength(false)
  if (!audio.paused && !audio.ended && !shouldUpdate) {
    shouldUpdate = true
  }
}
