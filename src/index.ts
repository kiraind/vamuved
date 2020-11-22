import express from 'express'
import { MikroORM } from '@mikro-orm/core'

import entities from './entities/index'
import Channel from './entities/Channel'

(async () => {
  const orm = await MikroORM.init({
    entities,
    type: 'mongo',
    clientUrl: process.env.MONGO_URL
  })

  // const channel = new Channel('hello world')
  // orm.em.persist(channel)

  // await orm.em.flush()

  // console.log(
  //   channel.id
  // )

  const app = express()
  const port = parseInt(process.env.PORT ?? '3000')

  app.get('/', (req, res) => {
    res.send('Nothing here')
  })

  app.listen(port, () => {
    console.log(`VamUved listening at http://localhost:${port}`)
  })
})()
