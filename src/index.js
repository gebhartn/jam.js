import { client } from './client'
import { events } from './client/events'
import { token } from './config'

client.listen({ events })
client.initialize({ token })
