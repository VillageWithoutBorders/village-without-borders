import { useId, useMemo } from 'react'
import { calmMotion } from '../utils/motion'

// Lanterns lighting each other (Nov 24, Jade): light spreading from one neighbor to the next.
// Drawn from simple shapes. A spark runs along the string and each lantern lights as it arrives.
//   mode "once": the first lantern is already lit (your light) and passes it on, one time.
//   mode "loop": all start dark, light up one by one, rest, and start again (for loading).
// With less motion (VWB's switch or the phone's own setting) they show lit, with nothing moving.
// Always decorative: the words around them say what is happening.

const GAP = 110
const PAD = 50
const H = 112
const LIGHT = '#f3c35a'
const DARK = '#3a4a46'
const STEP = 0.7

export default function Lanterns({ count = 3, mode = 'once', className = '' }) {
  const id = useId().replace(/:/g, '')
  const calm = useMemo(() => calmMotion(), [])
  const W = PAD * 2 + (count - 1) * GAP
  const xs = Array.from({ length: count }, (_, i) => PAD + i * GAP)

  // The string: dips between hanging points, all hanging points at the same height.
  const pts = [8, ...xs, W - 8]
  let line = 'M' + pts[0] + ' 14'
  for (let i = 1; i < pts.length; i++) line += ' Q' + (pts[i - 1] + pts[i]) / 2 + ' 32 ' + pts[i] + ' 14'
  // The spark's path: from the first lantern to the last, on the same string.
  let run = 'M' + xs[0] + ' 14'
  for (let i = 1; i < xs.length; i++) run += ' Q' + (xs[i - 1] + xs[i]) / 2 + ' 32 ' + xs[i] + ' 14'

  const loop = mode === 'loop'
  const start = loop ? 0.3 : 0.25
  const lightAt = (i) => start + i * STEP
  const cycle = start + count * STEP + 1.4
  const frac = (s) => Math.min(0.999, s / cycle).toFixed(3)

  function glassAnim(i, attr, off, on) {
    if (calm) return null
    if (!loop) {
      if (i === 0) return null
      return <animate attributeName={attr} from={off} to={on} begin={lightAt(i) + 's'} dur="0.35s" fill="freeze" />
    }
    const a = frac(lightAt(i))
    const b = frac(lightAt(i) + 0.3)
    return <animate attributeName={attr} dur={cycle + 's'} repeatCount="indefinite"
      values={[off, off, on, on, off].join(';')} keyTimes={['0', a, b, '0.93', '1'].join(';')} />
  }
  const startsLit = (i) => calm || (!loop && i === 0)

  return (
    <svg className={'lanterns ' + className} viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" focusable="false">
      <path id={id + 'run'} d={run} fill="none" stroke="none" />
      <path d={line} fill="none" stroke="#c9b48a" strokeWidth="1.5" />
      {xs.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={62} r={38} fill={LIGHT} opacity={startsLit(i) ? 0.18 : 0}>{glassAnim(i, 'opacity', 0, 0.18)}</circle>
          <line x1={x} y1={14} x2={x} y2={32} stroke="#c9b48a" strokeWidth="1.5" />
          <rect x={x - 12} y={31} width={24} height={7} rx={2} fill="#5a4632" />
          <rect x={x - 18} y={38} width={36} height={48} rx={6} fill="#2E4D46" stroke="#5a4632" strokeWidth="2" />
          <rect x={x - 10} y={45} width={20} height={34} rx={4} fill={startsLit(i) ? LIGHT : DARK}>{glassAnim(i, 'fill', DARK, LIGHT)}</rect>
          <rect x={x - 12} y={86} width={24} height={5} rx={2} fill="#5a4632" />
        </g>
      ))}
      {!calm && count > 1 && (
        loop ? (
          <circle r={4.5} fill="#fff3cf" opacity="0">
            <animateMotion dur={cycle + 's'} repeatCount="indefinite" calcMode="linear"
              keyPoints="0;0;1;1" keyTimes={['0', frac(start), frac(lightAt(count - 1)), '1'].join(';')}>
              <mpath href={'#' + id + 'run'} />
            </animateMotion>
            <animate attributeName="opacity" dur={cycle + 's'} repeatCount="indefinite" values="0;1;1;0;0"
              keyTimes={['0', frac(start), frac(lightAt(count - 1)), frac(lightAt(count - 1) + 0.2), '1'].join(';')} />
          </circle>
        ) : (
          <circle r={4.5} fill="#fff3cf" opacity="0">
            <animateMotion begin={start + 's'} dur={(count - 1) * STEP + 's'} fill="freeze" calcMode="linear">
              <mpath href={'#' + id + 'run'} />
            </animateMotion>
            <animate attributeName="opacity" begin={start + 's'} dur={(count - 1) * STEP + 0.3 + 's'} fill="freeze" values="1;1;0" keyTimes="0;0.9;1" />
          </circle>
        )
      )}
    </svg>
  )
}
