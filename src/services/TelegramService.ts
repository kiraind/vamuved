import TelegramBot from 'node-telegram-bot-api'
import DeliveryService from '../types/DeliveryService'

import DeliveryManager from './DeliveryManager'
import ChatbotState from '../types/ChatbotState'

export default class TelegramService extends DeliveryManager {
  bot: TelegramBot
  state: Record<number, ChatbotState> = {}

  constructor (telegramToken: string) {
    super()

    this.bot = new TelegramBot(telegramToken, { polling: true })
  }

  start () {
    this.bot.on('text', async msg => {
      const chatId = msg.chat.id
      const { text } = msg

      if (text === '/start') {
        await this.createReceiverHandler!(DeliveryService.TELEGRAM, chatId.toString())

        this.bot.sendMessage(chatId, 'Чтобы создать канал получения уведомлений, используйте команду /newchannel.')
      } else if (text === '/newchannel') {
        this.state[chatId] = ChatbotState.AWAITING_NEW_CHANNEL_TITLE

        this.bot.sendMessage(chatId, 'Отправьте название для обозначения нового канала.')
      } else if (text !== undefined) {
        if (this.state[chatId] === ChatbotState.AWAITING_NEW_CHANNEL_TITLE) {
          const channel = await this.createChannelHandler!(text, DeliveryService.TELEGRAM, chatId.toString())

          this.state[chatId] = ChatbotState.IDLE
          await this.bot.sendMessage(chatId, `ID нового канала «${channel.title}»:`)
          this.bot.sendMessage(chatId, channel.id)
        } else {
          this.bot.sendMessage(chatId, 'Неизвестная команда. Если есть какие-то вопросы, то @kiraind.')
        }
      } else {
        this.bot.sendMessage(chatId, 'Пишите текстом, пожалуйста.')
      }
    })
  }
}
