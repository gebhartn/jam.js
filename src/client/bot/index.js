export function buildMakeClient({ prefix }) {
  return function makeClient({ client, queue, actions } = {}) {
    return Object.freeze({
      listen,
      initialize,
    })

    function listen({ events }) {
      events.listenOnce(readyAction())
      events.listenOnce(disconnectAction())
      events.listenOnce(reconnectingAction())
      events.listenOn(messageAction())
    }

    function initialize({ token }) {
      client.login(token)
    }

    function messageAction() {
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

    function readyAction() {
      return Object.freeze({
        client,
        event: 'ready',
        callback: () => console.log('Ready!'),
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
}
