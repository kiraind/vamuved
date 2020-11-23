import express from 'express'
import DeliveryManager from './services/DeliveryManager'
// import { MikroORM } from '@mikro-orm/core'

// import entities, { Channel, Receiver } from './entities/index'
// import DeliveryService from './types/DeliveryService'

import TelegramManager from './services/TelegramManager'

(async () => {
  const deliveryManagers: DeliveryManager[] = []

  if (process.env.TELEGRAM_TOKEN !== undefined) {
    deliveryManagers.push(new TelegramManager(process.env.TELEGRAM_TOKEN))
  }

  deliveryManagers.forEach(mg => mg.start())

  // const orm = await MikroORM.init({
  //   entities,
  //   type: 'mongo',
  //   clientUrl: process.env.MONGO_URL
  // })

  // const user = new Receiver(DeliveryService.TELEGRAM, '123')
  // orm.em.persist(user)

  // const channel = new Channel('Hello, World', user)
  // orm.em.persist(channel)
  // user.channels.add(channel)

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
