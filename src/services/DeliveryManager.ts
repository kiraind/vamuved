import { Channel } from '../entities'
import DeliveryService from '../types/DeliveryService'

export type CreateReceiverHandler = (service: DeliveryService, targetId: string) => Promise<void>
export type CreateChannelHandler = (title: string, service: DeliveryService, targetId: string) => Promise<Channel>
export type RemoveChannelHandler = (id: string, service: DeliveryService, targetId: string) => Promise<void>

export default abstract class DeliveryManager {
  protected createReceiverHandler?: CreateReceiverHandler

  protected createChannelHandler?: CreateChannelHandler
  protected removeChannelHandler?: RemoveChannelHandler

  setCreateReceiverHandler (handler: CreateReceiverHandler): void {
    this.createReceiverHandler = handler
  }

  setCreateChannelHandler (handler: CreateChannelHandler): void {
    this.createChannelHandler = handler
  }

  setNewChannelHandler (handler: RemoveChannelHandler): void {
    this.removeChannelHandler = handler
  }

  abstract start(): void
}
