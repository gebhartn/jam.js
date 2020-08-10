export function makeClient({ prefix, client, queue } = {}) {
  return Object.freeze({
    listen,
    initialize,
  })

  function initialize({ events, actions }) {
    const { listenOn } = events

    listenOn(messageHandler({ actions }))
  }

  function listen({ events = {}, token } = {}, callback) {
    const { listenOnce } = events

    listenOnce(readyHandler(callback ? callback({ token }) : null))
    listenOnce(disconnectHandler())
    listenOnce(reconnectHandler())
    client.login(token)
  }

  function messageHandler({ actions }) {
    async function messageCallback(message) {
      if (message.author.bot) return

      if (!message.content.startsWith(prefix)) return

      const serverQueue = queue.get(message.guild.id)

      if (message.content.startsWith(`${prefix}play`))
        return actions.execute(message, serverQueue, queue)

      if (message.content.startsWith(`${prefix}skip`))
        return actions.skip(message, serverQueue, queue)

      if (message.content.startsWith(`${prefix}stop`))
        return actions.stop(message, serverQueue)

      message.channel.send('You need to enter a valid command!')
    }

    return Object.freeze({
      client,
      event: 'message',
      callback: msg => messageCallback(msg),
    })
  }

  function readyHandler(callback) {
    return Object.freeze({
      client,
      event: 'ready',
      callback: callback !== null ? () => callback : () => console.log('Ready'),
    })
  }

  function disconnectHandler() {
    return Object.freeze({
      client,
      event: 'disconnect',
      callback: () => console.log('Disconnected!'),
    })
  }

  function reconnectHandler() {
    return Object.freeze({
      client,
      event: 'reconnecting',
      callback: () => console.log('Retrying connection!'),
    })
  }
}
