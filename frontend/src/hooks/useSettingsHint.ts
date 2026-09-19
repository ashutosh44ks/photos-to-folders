import { useEffect, useRef, useState } from 'react'

const DEFAULT_DURATION_MS = 1900

/**
 * Hook to show a hint for the settings button.
 * @param durationMs - The duration of the hint in milliseconds. Defaults to 1900ms.
 * @returns An object with the active state, the key, and the trigger function.
 */
export function useSettingsHint(durationMs = DEFAULT_DURATION_MS) {
  const [active, setActive] = useState(false)
  const [key, setKey] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    // clear the timeout when the component unmounts
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const trigger = () => {
    if (timer.current) window.clearTimeout(timer.current)
    // update the key prop on target element to trigger a re-render of the hint
    // which will re-trigger the animation
    setKey((k) => k + 1)
    setActive(true)
    // set the timeout to hide the hint after the duration
    timer.current = window.setTimeout(() => setActive(false), durationMs)
  }

  return { active, key, trigger }
}
