import { makeEvent } from './make-event'

export const listenOn = makeEvent({ type: 'on' })
export const listenOnce = makeEvent({ type: 'once' })

export const events = { listenOn, listenOnce }
