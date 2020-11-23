import DeliveryManager from './DeliveryManager'

export default class TelegramManager extends DeliveryManager {
  telegramToken: string

  constructor (telegramToken: string) {
    super()

    this.telegramToken = telegramToken
  }

  start () {

  }
}
