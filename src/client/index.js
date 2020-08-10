import { Client } from 'discord.js'
import { prefix } from '../config'
import { execute, skip, stop } from './actions'
import { buildMakeClient } from './bot'

const makeClient = buildMakeClient({
  prefix,
})

const actions = {
  execute,
  skip,
  stop,
}

export const client = makeClient({
  client: new Client(),
  queue: new Map(),
  actions,
})
