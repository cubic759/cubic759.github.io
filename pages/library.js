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
  { title: '2020-10-02' },
]
let audio = new Audio()
let playingIndex = -1
let shouldUpdate = false
let control = undefined
let stopped = false
let ratio = undefined
let cycling = 0

window.onload = function () {
  //start()
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
      i.innerHTML(value)
    }
  } else {
    document.getElementById(selectName).innerHTML(value)
  }
}

function getFixed(value) {
  //取两位小数
  return Math.floor(value * 100) / 100
}

function getAudioLength() {
  //计算进度条的长度
  let audio = this.data.audio
  return parseInt((audio.currentTime / audio.duration) * 100).toString() + '%'
}
function getFileName(title) {
  //合并成文件名
  return cachePath + '/' + title + '.mp3'
}
function getData(i) {
  //下载音乐文件
  return new Promise((resolve) => {
    this.setData({
      downloadTask: wx.downloadFile({
        url: 'https://cubic759.github.io/waves/' + i.title + '.mp3',
        filePath: this.getFileName(i.title),
        success(res) {
          resolve(res)
        },
      }),
    })
  })
}
function setcycling() {
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
  let playingIndex = this.data.playingIndex
  if (playingIndex != -1) {
    let a = this.data.workList
    a[playingIndex].currentLength = value
    this.setData({
      workList: a,
    })
  }
}
function setTapLength() {
  //设置调进度条的长度
  let a = this.data.workList
  a[this.data.playingIndex].tapLength = value
  this.setData({
    workList: a,
  })
}
function setIsPlaying(isPlaying) {
  //设置按钮图片
  let playingIndex = this.data.playingIndex
  if (playingIndex != -1) {
    let data = this.data.workList
    data[playingIndex].isPlaying = isPlaying
    this.setData({
      workList: data,
    })
  }
}
function startPlay(index) {
  let audio = this.data.audio
  setCurrentLength('0%')
  setIsPlaying(0)
  audio.stop()
  audio.destroy()
  audio = wx.createInnerAudioContext({
    useWebAudioImplement: true,
  })
  this.setData({
    playingIndex: index,
    audio: audio,
  })
  audio.onTimeUpdate(() => {
    if (this.data.shouldUpdate) {
      this.setCurrentLength(this.getAudioLength())
    }
  })
  audio.autoplay = true
  audio.src = this.getFileName(this.data.workList[index].title)
  audio.onEnded(() => {
    let cycling = this.data.cycling
    let playingIndex = this.data.playingIndex
    if (cycling == 0) {
      this.setData({
        stopped: true,
      })
      this.setCurrentLength('0%')
      this.setIsPlaying(0)
    } else if (cycling == 1) {
      let number = this.data.workList.length
      if (playingIndex < number - 1) {
        this.playWaveFile(playingIndex + 1)
      } else {
        this.startPlay(0)
      }
    } else {
      this.startPlay(playingIndex)
    }
  })
  this.setData({
    shouldUpdate: true,
  })
  this.setIsPlaying(1)
  audio.onCanplay(() => {
    audio.play()
    this.setData({
      stopped: false,
    })
  })
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

  for (let i of document.getElementsByClassName('work')) {
    i.innerHTML = `<div
    class="textContainer"
    bindtouchmove="onTouchMove"
    bindtouchend="onTouchEnd"
    bindtouchstart="onTouchStart"
  >
    <div class="workBlockTitle">{{work.title}}</div>
    <div class="workBottomLine" style="width:{{work.currentLength}}"></div>
    <div class="workWholeLine" style="width:{{work.tapLength}}"></div>
  </div>
  <div
    class="controlContainer"
    bindtap="onClick"
  >
    <div class="control">
      <cover-image
        class="controlImage"
        wx:if="{{work.isPlaying==-1}}"
        src="{{loadingImagePath}}"
      ></cover-image>
      <image
        class="controlImage"
        wx:if="{{work.isPlaying==0}}"
        src="../images/play.svg"
      ></image>
      <image
        class="controlImage"
        wx:if="{{work.isPlaying==1}}"
        src="../../images/pause.svg"
      ></image>
    </div>
  </div>`
  }
}
function downloadFile(path) {
  return new Promise((resolve) => {
    let fileNames = []
    $.ajax({
      url: path,
      success(data) {
        $(data)
          .find('td > a')
          .each(function () {
            if (openFile($(this).attr('href'))) {
              fileNames.push($(this).attr('href'))
            }
          })
        console.log(fileNames)
        resolve(fileNames)
      },
    })
  })
}
async function playWaveFile(index) {
  //检查文件后startPlay()
  let data = this.data.workList
  data[index].isPlaying = -1
  workList = data
  startPlay(index)
}
async function start() {
  setWorkInfo()
  control = document.getElementsByClassName('work').item(0)
}

function onClick(e) {
  //点击控件播放/暂停
  let audio = this.data.audio
  let index = Number(e.currentTarget.dataset.index)
  if (this.data.playingIndex == index) {
    if (this.data.stopped) {
      audio.stop()
      this.setData({
        shouldUpdate: true,
      })
      audio.onCanplay(() => {
        audio.play()
        this.setData({
          stopped: false,
        })
      })
      this.setIsPlaying(1)
    } else if (audio.paused) {
      this.setData({
        shouldUpdate: true,
      })
      audio.play()
      this.setData({
        stopped: false,
      })
      this.setIsPlaying(1)
    } else {
      audio.pause()
      this.setData({
        shouldUpdate: false,
      })
      this.setIsPlaying(0)
    }
  } else {
    this.playWaveFile(index)
  }
}
function onTouchMove(e) {
  //滑动调整进度
  if (!this.data.audio.paused) {
    let index = Number(e.currentTarget.dataset.index)
    if (index == this.data.playingIndex) {
      if (this.data.shouldUpdate) {
        this.setData({
          shouldUpdate: false,
        })
      }
      this.setCurrentLength('0%')
      let position = e.changedTouches[0].pageX - this.data.control.left
      let control = this.data.control
      let total = control.right - control.left - 60
      if (position <= total && position >= 0) {
        let ratio = position / total
        this.setData({
          ratio: ratio,
        })
        this.setTapLength(this.getFixed(ratio * 100).toString() + '%')
      }
    }
  }
}
function onTouchStart(e) {
  this.setData({
    timeStamp: e.timeStamp,
  })
}
function setProgress(ratio) {
  let audio = this.data.audio
  audio.pause()
  audio.seek(audio.duration * this.getFixed(ratio))
  this.setTapLength('0%')
  this.setCurrentLength(this.getFixed(ratio * 100).toString() + '%')
  this.setData({
    shouldUpdate: true,
  })
  audio.onCanplay(() => {
    audio.play()
    this.setData({
      stopped: false,
    })
  })
}
function onPush() {
  console.log('a')
  let audio = new Audio('../waves/' + files[0].title + '.mp3')
  audio.play()
}
function onTouchEnd(e) {
  //手指离开设置进度
  let audio = this.data.audio
  if (!audio.paused) {
    let index = Number(e.currentTarget.dataset.index)
    if (index == this.data.playingIndex) {
      let tapped = e.timeStamp - this.data.timeStamp < 350
      if (tapped) {
        let control = this.data.control
        let position = e.changedTouches[0].pageX - control.left
        let total = control.right - control.left - 60
        if (position <= total) {
          this.setProgress(position / total)
        }
      } else {
        this.setProgress(this.data.ratio)
      }
    }
  }
}
function onTouchCancel() {
  //恢复原状
  this.setTapLength('0%')
  if (!this.data.shouldUpdate) {
    this.setData({
      shouldUpdate: true,
    })
  }
}
function deleteFiles() {
  let strArr = fileManager.readdirSync(cachePath)
  for (let i of strArr) {
    fileManager.unlinkSync(cachePath + '/' + i)
  }
}
function onUnload() {
  //避免多重播放
  let audio = this.data.audio
  audio.stop()
  audio.destroy()
  if (this.data.cleaning) {
    this.deleteFiles()
  }
}
