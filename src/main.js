import './styles.css'

import './styles.css'

const player = document.getElementById('player')
const playBtn = document.getElementById('playBtn')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const shuffleBtn = document.getElementById('shuffleBtn')
const loopBtn = document.getElementById('loopBtn')
const speedBtn = document.getElementById('speedBtn')
const progressBar = document.getElementById('progressBar')
const currentTimeEl = document.getElementById('currentTime')
const durationEl = document.getElementById('duration')
const volumeBar = document.getElementById('volumeBar')
const volumeLabel = document.getElementById('volumeLabel')
const trackTitle = document.getElementById('trackTitle')
const trackArtist = document.getElementById('trackArtist')
const coverImg = document.getElementById('coverImg')
const diskTitle = document.getElementById('diskTitle')
const diskArtist = document.getElementById('diskArtist')
const disk = document.getElementById('disk')
const diskWrap = document.getElementById('diskWrap')
const playlist = document.getElementById('playlist')
const ambientBg = document.getElementById('ambientBg')

let tracks = []
let current = 0
let isPlaying = false
let isLooping = false
let is2x = false

async function loadTracks() {
  const musicjson = await fetch('/music.json') //served from Public
  tracks = await musicjson.json()

  // coverImg.onload = () => {
  //   const color = getDominantColor(coverImg)
  //   // ambientBg.style.background = `radial-gradient(ellipse at center, ${color}99 0%, transparent 0%)`
  //   // document.body.style.background = color + '22'
  //   document.body.style.background = color
  // }


  renderPlaylist()
  loadTrack(0)
  return tracks
}

async function init() {
  const tracks = await loadTracks()
  console.log("recieving tracks confirmed ✅:", tracks)
}
init()


function loadTrack(index) {
  current = index
  const t = tracks[current]
  player.src = t.file
  player.volume = volumeBar.value
  trackTitle.textContent = t.title
  trackArtist.textContent = t.artist
  coverImg.src = t.cover
  diskTitle.textContent = t.title
  diskArtist.textContent = t.artist
  ambientBg.style.background = `radial-gradient(ellipse at center, ${t.color}55 0%, transparent 70%)`
  renderPlaylist()
}

function renderPlaylist() {
  playlist.innerHTML = ''
  tracks.forEach((t, i) => {
    const item = document.createElement('div')
    item.className = 'playlist-item' + (i === current ? ' active' : '')
    item.innerHTML = `
      <span class="p-num">${i === current && isPlaying ? '▶' : i + 1}</span>
      <div class="p-info">
        <span class="p-title">${t.title}</span>
        <span class="p-artist">${t.artist}</span>
      </div>
    `
    item.onclick = () => { loadTrack(i); play() }
    playlist.appendChild(item)
  })
}

function play() {
  player.play()
  isPlaying = true
  playBtn.innerHTML = '&#9646;&#9646;'
  disk.classList.add('spinning')
  renderPlaylist()
}

function pause() {
  player.pause()
  isPlaying = false
  playBtn.innerHTML = '&#9654;'
  disk.classList.remove('spinning')
  renderPlaylist()
}

playBtn.onclick = () => isPlaying ? pause() : play()
diskWrap.onclick = () => isPlaying ? pause() : play()
prevBtn.onclick = () => { loadTrack((current - 1 + tracks.length) % tracks.length); if (isPlaying) play() }
nextBtn.onclick = () => { loadTrack((current + 1) % tracks.length); if (isPlaying) play() }
shuffleBtn.onclick = () => { loadTrack(Math.floor(Math.random() * tracks.length)); if (isPlaying) play() }

loopBtn.onclick = () => {
  isLooping = !isLooping
  player.loop = isLooping
  loopBtn.classList.toggle('active', isLooping)
}

speedBtn.onclick = () => {
  is2x = !is2x
  player.playbackRate = is2x ? 2 : 1
  disk.style.animationDuration = is2x ? '1.5s' : '3s'
  speedBtn.classList.toggle('active', is2x)
}

volumeBar.oninput = () => {
  player.volume = volumeBar.value
  volumeLabel.textContent = Math.round(volumeBar.value * 100) + '%'
}

player.ontimeupdate = () => {
  if (!player.duration) return
  progressBar.max = Math.floor(player.duration)
  progressBar.value = Math.floor(player.currentTime)
  currentTimeEl.textContent = formatTime(player.currentTime)
  durationEl.textContent = formatTime(player.duration)
}

progressBar.oninput = () => {
  player.currentTime = progressBar.value
}

player.onended = () => {
  if (!isLooping) {
    loadTrack((current + 1) % tracks.length)
    play()
  }
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}


// color sampling
function getDominantColor(imgEl) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 50
  canvas.height = 50
  ctx.drawImage(imgEl, 0, 0, 50, 50)
  const data = ctx.getImageData(0, 0, 50, 50).data
  let r = 0, g = 0, b = 0, count = 0
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
    count++
  }
  r = Math.round(r / count)
  g = Math.round(g / count)
  b = Math.round(b / count)
  return `rgb(${r}, ${g}, ${b})`
}




// lastly
loadTracks()










// const app = document.getElementById('app')

// async function LoadTracks() {
//   const musicjson = await fetch('/music.json') //served from Public
//   const tracks = await musicjson.json()
//   return tracks
// }

