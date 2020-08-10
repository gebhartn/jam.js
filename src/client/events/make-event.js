export function makeEvent({ type }) {
  return function ({ client, event, callback }) {
    return client[`${type}`](event, callback)
  }
}
