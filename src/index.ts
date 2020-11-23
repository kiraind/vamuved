import express from 'express'
import DeliveryManager from './services/DeliveryManager'
import { MikroORM } from '@mikro-orm/core'

import entities, { Channel, Receiver } from './entities/index'

import TelegramManager from './services/TelegramManager'

(async () => {
  // Database setup
  const { em } = await MikroORM.init({
    entities,
    type: 'mongo',
    clientUrl: process.env.MONGO_URL
  })

  // Delivery managers creating
  const deliveryManagers: DeliveryManager[] = []

  if (process.env.TELEGRAM_TOKEN !== undefined) {
    deliveryManagers.push(new TelegramManager(process.env.TELEGRAM_TOKEN))
  }

  // Delivery managers tuning

  deliveryManagers.forEach(mg => mg.setCreateReceiverHandler(async (service, targetId) => {
    const existing = await em.findOne(Receiver, { deliveryService: service, targetId })

    if (existing === null) {
      const receiver = new Receiver(service, targetId)
      em.persist(receiver)

      await em.flush()
    }
  }))

  deliveryManagers.forEach(mg => mg.setCreateChannelHandler(async (title, service, targetId) => {
    const receiver = await em.findOne(
      Receiver,
      { deliveryService: service, targetId },
      ['channels']
    )

    if (receiver === null) {
      throw new Error('Reveiver not found')
    }

    if (receiver.channels.count() >= 100) {
      throw new Error('Too many channels')
    }

    const channel = new Channel(title, receiver)
    em.persist(channel)

    receiver.channels.add(channel)

    await em.flush()

    return channel
  }))

  // Delivery managers starting
  deliveryManagers.forEach(mg => mg.start())

  const app = express()
  const port = parseInt(process.env.PORT ?? '3000')

  app.get('/', (req, res) => {
    res.send('Nothing here')
  })

  app.listen(port, () => {
    console.log(`VamUved listening at http://localhost:${port}`)
  })
})()
