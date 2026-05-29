"use client"

import { useEffect, useRef } from "react"

const START_EVENTS = ["pointerdown", "touchstart", "mousedown", "wheel", "scroll", "keydown"]
const FADE_DURATION_MS = 1200
const FADE_STEP_MS = 50

export default function AudioPlayer() {
  const audioRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const hasMutedPlaybackRef = useRef(false)
  const hasAudiblePlaybackRef = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    let retryTimer = null

    const clearFadeTimer = () => {
      if (fadeTimerRef.current) {
        window.clearInterval(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }

    const removeListeners = () => {
      START_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserGesture)
      })
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("load", handleWindowLoad)

      if (retryTimer !== null) {
        window.clearTimeout(retryTimer)
        retryTimer = null
      }
    }

    const fadeInAudio = () => {
      clearFadeTimer()

      const steps = Math.max(1, Math.floor(FADE_DURATION_MS / FADE_STEP_MS))
      let currentStep = 0

      audio.volume = 0

      fadeTimerRef.current = window.setInterval(() => {
        currentStep += 1
        audio.volume = Math.min(1, currentStep / steps)

        if (audio.volume >= 1) {
          clearFadeTimer()
        }
      }, FADE_STEP_MS)
    }

    const startMutedPlayback = async () => {
      if (hasMutedPlaybackRef.current || hasAudiblePlaybackRef.current) return

      try {
        audio.muted = true
        audio.volume = 0
        await audio.play()
        hasMutedPlaybackRef.current = true
      } catch (error) {
        if (error?.name !== "NotAllowedError") {
          console.log("Muted autoplay error:", error)
        }
      }
    }

    const attemptAudibleAutoplay = async () => {
      if (hasAudiblePlaybackRef.current || !audio.paused) return

      try {
        audio.muted = false
        audio.volume = 1
        await audio.play()
        hasAudiblePlaybackRef.current = true
        removeListeners()
      } catch (error) {
        if (error?.name !== "NotAllowedError") {
          console.log("Audio playback error:", error)
        }
      }
    }

    const unlockAudio = async () => {
      if (hasAudiblePlaybackRef.current) return

      if (audio.paused) {
        try {
          audio.muted = false
          audio.volume = 0
          await audio.play()
          hasAudiblePlaybackRef.current = true
          fadeInAudio()
          removeListeners()
          return
        } catch (error) {
          if (error?.name !== "NotAllowedError") {
            console.log("Audio playback error:", error)
          }
        }
      }

      if (!audio.paused) {
        audio.muted = false
        hasAudiblePlaybackRef.current = true
        fadeInAudio()
        removeListeners()
      }
    }

    const handleUserGesture = () => {
      void unlockAudio()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void attemptAudibleAutoplay()
        if (!hasAudiblePlaybackRef.current && audio.paused) {
          void unlockAudio()
        }
      }
    }

    const handleWindowLoad = () => {
      void attemptAudibleAutoplay()
      if (!hasAudiblePlaybackRef.current && audio.paused) {
        void startMutedPlayback()
      }
    }

    START_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleUserGesture, { passive: true })
    })
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("load", handleWindowLoad)

    retryTimer = window.setTimeout(() => {
      void attemptAudibleAutoplay()
      if (!hasAudiblePlaybackRef.current && audio.paused) {
        void startMutedPlayback()
      }
    }, 1500)

    void attemptAudibleAutoplay()
    if (!hasAudiblePlaybackRef.current) {
      void startMutedPlayback()
    }

    return () => {
      clearFadeTimer()
      removeListeners()
    }
  }, [])

  return (
    <audio
      ref={audioRef}
      src="/audio/bg.mp3"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  )
}
