import { makeEvent } from './make-event'

const listenOn = makeEvent({ type: 'on' })
const listenOnce = makeEvent({ type: 'once' })

export const events = { listenOn, listenOnce }
