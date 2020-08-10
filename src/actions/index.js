import ytdl from 'ytdl-core'

export async function execute(message, serverQueue, queue) {
  const args = message.content.split(' ')

  const voiceChannel = message.member.voice.channel
  if (!voiceChannel) return message.channel.send('you need to be in vc')
  const permissions = voiceChannel.permissionsFor(message.client.user)
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('set my permission 4head')
  }

  const songInfo = await ytdl.getInfo(args[1])
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  }

  if (!serverQueue) {
    const makeQueue = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    }

    queue.set(message.guild.id, makeQueue)

    makeQueue.songs.push(song)

    let connection

    try {
      connection = await voiceChannel.join()
      makeQueue.connection = connection
      play(message.guild, makeQueue.songs[0], queue)
    } catch (err) {
      console.log(err)
      queue.delete(message.guild.id)
      return message.channel.send(err)
    }
  } else {
    serverQueue.songs.push(song)
    return message.channel.send(
      `${song.title} added to the queue at position ${serverQueue.songs.length}`,
    )
  }
}

export function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send('join vc 4head')

  if (!serverQueue) return message.channel.send("it can't be done")

  serverQueue.connection.dispatcher.end()
}

export function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send('join vc 4head')
  serverQueue.songs = []
  serverQueue.connection.dispatcher.end()
}

function play(guild, song, queue) {
  const serverQueue = queue.get(guild.id)
  if (!song) {
    serverQueue.voiceChannel.leave()
    queue.delete(guild.id)
    return
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on('finish', () => {
      serverQueue.songs.shift()
      play(guild, serverQueue.songs[0], queue)
    })
    .on('error', error => console.error(error))
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
  serverQueue.textChannel.send(`now jamming: **${song.title}**`)
}
