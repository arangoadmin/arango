import { useState, useEffect, useCallback } from 'react'

// Launch Date: 2027-02-25 00:00:00 UTC (WET/Madeira)
const TARGET_UTC_MS = Date.UTC(2027, 1, 25, 0, 0, 0)

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: '---',
    hours: '--',
    minutes: '--',
    seconds: '--',
    isZero: false
  })

  const [serverOffset, setServerOffset] = useState(0)

  useEffect(() => {
    async function syncTime() {
      try {
        const t0 = performance.now()
        const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
        const t1 = performance.now()
        const serverDate = res.headers.get('date')
        if (serverDate) {
          const serverTime = new Date(serverDate).getTime()
          const latency = (t1 - t0) / 2
          setServerOffset((serverTime + latency) - Date.now())
        }
      } catch {
        // Fallback to local clock
      }
    }
    syncTime()
  }, [])

  const calculateTime = useCallback(() => {
    const now = Date.now() + serverOffset
    const diff = TARGET_UTC_MS - now

    if (diff <= 0) {
      setTimeLeft({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        isZero: true
      })
      return
    }

    const pad = n => String(n).padStart(2, '0')
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeLeft({
      days: String(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      isZero: false
    })
  }, [serverOffset])

  useEffect(() => {
    calculateTime()
    const interval = setInterval(calculateTime, 1000)

    const handleVisibility = () => {
      if (!document.hidden) {
        calculateTime()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [calculateTime])

  return (
    <section className="countdown-panel" aria-label="Contagem decrescente para o lançamento">
      <div className="countdown-caption">
        <span className="caption-lead">Lançamento</span>
        <span className="caption-date">25 de fevereiro de 2027 (25.º Aniversário da Arango)</span>
      </div>

      <div className="countdown-grid">
        <div className="countdown-card">
          <span className="countdown-digit">{timeLeft.days}</span>
          <span className="countdown-label">Dias</span>
        </div>
        <span className="countdown-separator" aria-hidden="true">:</span>
        <div className="countdown-card">
          <span className="countdown-digit">{timeLeft.hours}</span>
          <span className="countdown-label">Horas</span>
        </div>
        <span className="countdown-separator" aria-hidden="true">:</span>
        <div className="countdown-card">
          <span className="countdown-digit">{timeLeft.minutes}</span>
          <span className="countdown-label">Min</span>
        </div>
        <span className="countdown-separator" aria-hidden="true">:</span>
        <div className="countdown-card">
          <span className="countdown-digit accent">{timeLeft.seconds}</span>
          <span className="countdown-label">Seg</span>
        </div>
      </div>
    </section>
  )
}
