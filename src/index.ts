import { MikroORM } from '@mikro-orm/core'

import entities, { Channel, Receiver } from './entities/index'

import DeliveryManager from './services/DeliveryManager'
import TelegramService from './services/TelegramService'

import WebService from './services/WebService'

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
    deliveryManagers.push(new TelegramService(process.env.TELEGRAM_TOKEN))
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

  // Web service
  const webService = new WebService()

  webService.setSendNotificationHandler(async (channelId, text) => {
    const channel = await em.findOne(
      Channel,
      { id: channelId },
      ['receiver']
    )

    if (channel === null) {
      throw new Error('Invalid channel')
    }

    deliveryManagers.forEach(mg => mg.sendNotification(channel, text))
  })

  webService.start()
})()
