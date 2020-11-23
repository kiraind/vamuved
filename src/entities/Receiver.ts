import {
  Entity,
  Enum,
  Property,
  OneToMany,
  Collection
} from '@mikro-orm/core'

import BaseEntity from './BaseEntity'
import Channel from './Channel'
import DeliveryService from '../types/DeliveryService'

@Entity()
export default class Receiver extends BaseEntity {
  @Enum()
  deliveryService: DeliveryService

  @Property()
  targetId: string

  @OneToMany('Channel', 'receiver')
  channels = new Collection<Channel>(this)

  constructor (deliveryService: DeliveryService, targetId: string) {
    super()

    this.deliveryService = deliveryService
    this.targetId = targetId
  }
}
