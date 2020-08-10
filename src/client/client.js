export function makeClient({ prefix, client, queue } = {}) {
  return Object.freeze({
    listen,
    initialize,
  })

  function initialize({ events, actions }) {
    const { listenOn } = events

    listenOn(messageAction({ actions }))
  }

  async function listen({ events = {}, token } = {}, callback) {
    const { listenOnce } = events

    listenOnce(readyAction(await callback({ token })))
    listenOnce(disconnectAction())
    listenOnce(reconnectingAction())
    client.login(token)
  }

  function messageAction({ actions }) {
    async function messageCallback(message) {
      if (message.author.bot) return
      if (!message.content.startsWith(prefix)) return

      const serverQueue = queue.get(message.guild.id)

      if (message.content.startsWith(`${prefix}play`)) {
        actions.execute(message, serverQueue, queue)
        return
      } else if (message.content.startsWith(`${prefix}skip`)) {
        actions.skip(message, serverQueue, queue)
        return
      } else if (message.content.startsWith(`${prefix}stop`)) {
        actions.stop(message, serverQueue)
        return
      } else {
        message.channel.send('You need to enter a valid command!')
      }
    }

    return Object.freeze({
      client,
      event: 'message',
      callback: msg => messageCallback(msg),
    })
  }

  function readyAction(callback) {
    return Object.freeze({
      client,
      event: 'ready',
      callback: callback ? callback : () => console.log(),
    })
  }

  function disconnectAction() {
    return Object.freeze({
      client,
      event: 'disconnect',
      callback: () => console.log('Disconnected!'),
    })
  }

  function reconnectingAction() {
    return Object.freeze({
      client,
      event: 'reconnecting',
      callback: () => console.log('Retrying connection!'),
    })
  }
}
