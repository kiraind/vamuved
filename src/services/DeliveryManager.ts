import DeliveryService from '../types/DeliveryService'

export type CreateChannelHandler = (title: string, service: DeliveryService, targetId: string) => boolean
export type RemoveChannelHandler = (id: string, service: DeliveryService, targetId: string) => boolean

export default abstract class DeliveryManager {
  private createChannelHandler?: CreateChannelHandler
  private removeChannelHandler?: RemoveChannelHandler

  setCreateChannelHandler (handler: CreateChannelHandler): void {
    this.createChannelHandler = handler
  }

  setNewChannelHandler (handler: RemoveChannelHandler): void {
    this.removeChannelHandler = handler
  }

  abstract start(): void
}
