let workList = [
  { title: '空曲目1', isPlaying: 0 },
  { title: '空曲目2', isPlaying: 0 },
]
let cycleTxt = ["单次播放", "单列播放", "列表循环", "单曲循环"]
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
let selectingIndex = 0

document.addEventListener('keydown', (e) => {
  if (e.key == ' ') {
    e.preventDefault()
    startPlay(selectingIndex)
  }
  else if (e.key == 'ArrowDown') {
    e.preventDefault()
    if (selectingIndex != files.length - 1) {
      selectingIndex++
    } else {
      selectingIndex = 0
    }
    selectWork(selectingIndex)
  } else if (e.key == 'ArrowUp') {
    e.preventDefault()
    if (selectingIndex != 0) {
      selectingIndex--
    } else {
      selectingIndex = files.length - 1
    }
    selectWork(selectingIndex)
  } else if (e.key == 'ArrowLeft') {
    e.preventDefault()
    if (cycling != 0) {
      cycling -= 1
    } else {
      cycling = 3
    }
    $('.cycleImage').attr('hidden', 'true')
    $('.cycleImage').eq(cycling).removeAttr('hidden')
    setText(true, 'cycleText', cycleTxt[cycling])
  } else if (e.key == 'ArrowRight') {
    e.preventDefault()
    setCycling()
  }
});
window.onload = function () {
  checkOS()
  setWorkInfo()
  selectWork(selectingIndex)
  checkTime()
}

function checkTime () {
  var time = new Date()
  let t = time.getHours()
  if (t < 7 || t > 18) {
    theme = 1
    $('.themeImage').attr('hidden', 'true')
    $('.themeImage').eq(theme).removeAttr('hidden')
    setText(true, 'themeText', '黑色')
    changeTheme(1)
  }
}

function selectWork (index) {
  $('.work').css('border', 'none')
  $('.work').eq(index).css('border', '1px solid rgb(26 164 205 / 63%)')
  window.scrollTo(0, 80 * selectingIndex)
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
  return '../waves/' + title + '.mp3'
}
function setCycling () {
  if (cycling < 3) {
    cycling += 1
  } else {
    cycling = 0
  }
  $('.cycleImage').attr('hidden', 'true')
  $('.cycleImage').eq(cycling).removeAttr('hidden')
  setText(true, 'cycleText', cycleTxt[cycling])
}

function setTheme () {
  if (theme < 1) {
    theme += 1
  } else {
    theme = 0
  }
  $('.themeImage').attr('hidden', 'true')
  $('.themeImage').eq(theme).removeAttr('hidden')
  if (theme == 0) {
    setText(true, 'themeText', '白色')
  } else {
    setText(true, 'themeText', '黑色')
  }
  changeTheme(theme)
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
    $('.cycleImage').each(function () {
      str = $(this).attr('src')
      str = str.replace('.svg', "_dark.svg")
      $(this).attr('src', str)
    })
    $('.controlImage').each(function () {
      str = $(this).attr('src')
      str = str.replace('.svg', "_dark.svg")
      $(this).attr('src', str)
    })
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
    $('.cycleImage').each(function () {
      str = $(this).attr('src')
      str = str.replace('_dark.svg', ".svg")
      $(this).attr('src', str)
    })
    $('.controlImage').each(function () {
      str = $(this).attr('src')
      str = str.replace('_dark.svg', ".svg")
      $(this).attr('src', str)
    })
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

function setPlayImage (value) {
  $('.controlImage.play').removeAttr('hidden')
  $('.controlImage.pause').attr('hidden', 'true')
  if (value) {
    $('.controlImage.play').eq(playingIndex).attr('hidden', 'true')
    $('.controlImage.pause').eq(playingIndex).removeAttr('hidden')
  }
}

function startPlay (index) {
  setCurrentLength('0%')
  setTapLength('0%')
  showCurrentLength(false)
  showTapLength(false)
  if (playingIndex != -1) {
    workList[playingIndex].isPlaying = 0
    let themeName = ""
    if (theme) {
      themeName = "_dark"
    }
    setPlayImage(0)
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
      setCurrentLength('0%')
      setTapLength('0%')
      showCurrentLength(false)
      showTapLength(false)
      if (playingIndex != -1) {
        workList[playingIndex].isPlaying = 0
        setPlayImage(0)
      }
      playingIndex = -1;
    } else if (cycling == 1) {
      if (playingIndex < files.length - 1) {
        startPlay(playingIndex + 1)
      } else {
        stopped = true
        setCurrentLength('0%')
        setTapLength('0%')
        showCurrentLength(false)
        showTapLength(false)
        if (playingIndex != -1) {
          workList[playingIndex].isPlaying = 0
          setPlayImage(0)
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
    setPlayImage(1)
  }
  audio.addEventListener('canplay', function () {
    audio.play()
  })
  stopped = false
  showCurrentLength(true)
  selectingIndex = playingIndex
  selectWork(playingIndex)
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
        class="controlImage play"
        src="../images/play.svg"
      />
      <image
        class="controlImage pause"
        src="../images/pause.svg"
        hidden="hidden"
      />
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
    if (audio.ended) {
      playingIndex = index;
      audio.pause()
      shouldUpdate = true
      audio.play()
      stopped = false
      workList[playingIndex].isPlaying = 1
      setPlayImage(1)
    } else if (audio.paused) {
      shouldUpdate = true
      audio.play()
      stopped = false
      workList[playingIndex].isPlaying = 1
      setPlayImage(1)
    } else {
      audio.pause()
      showCurrentLength(true)
      showTapLength(false)
      shouldUpdate = false
      workList[playingIndex].isPlaying = 0
      setPlayImage(0)
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
