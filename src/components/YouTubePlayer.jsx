import { useEffect, useRef, useState } from 'react'

let apiState = 'idle'
const waitQueue = []

function loadApi() {
  if (apiState !== 'idle') return
  apiState = 'loading'
  const prev = window.onYouTubeIframeAPIReady
  window.onYouTubeIframeAPIReady = () => {
    apiState = 'ready'
    if (typeof prev === 'function') prev()
    waitQueue.splice(0).forEach(cb => cb())
  }
  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)
}

function whenReady(cb) {
  if (apiState === 'ready' && window.YT?.Player) {
    cb()
  } else {
    waitQueue.push(cb)
    loadApi()
  }
}

export default function YouTubePlayer({ videoId, title }) {
  const containerRef = useRef(null)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (!videoId) return
    setBlocked(false)
    let cancelled = false
    let player = null

    whenReady(() => {
      if (cancelled || !containerRef.current) return
      player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { modestbranding: 1, rel: 0, iv_load_policy: 3 },
        events: {
          onError: (e) => {
            if (e.data === 101 || e.data === 150) setBlocked(true)
          }
        }
      })
    })

    return () => {
      cancelled = true
      if (player) {
        try { player.destroy() } catch (_) {}
      }
    }
  }, [videoId])

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`

  if (blocked) {
    return (
      <div className="yt-blocked">
        <div className="yt-blocked-thumb-wrap">
          <img
            src={thumbUrl}
            alt={title || 'Video thumbnail'}
            className="yt-blocked-thumb"
          />
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="yt-watch-btn-overlay"
          >
            Watch on YouTube
          </a>
        </div>
        {title && <div className="yt-video-caption">{title}</div>}
      </div>
    )
  }

  return (
    <div className="yt-player-wrapper">
      <div className="yt-player-ratio">
        <div ref={containerRef} />
      </div>
      <div className="yt-player-footer">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="yt-watch-link"
        >
          Watch on YouTube ↗
        </a>
      </div>
    </div>
  )
}
