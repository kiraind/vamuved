import {
  Entity,
  Property,
  ManyToOne
} from '@mikro-orm/core'

import BaseEntity from './BaseEntity'
import Receiver from './Receiver'

@Entity()
export default class Channel extends BaseEntity {
  @Property()
  title: string

  @ManyToOne()
  receiver: Receiver

  constructor (title: string, receiver: Receiver) {
    super()

    this.title = title
    this.receiver = receiver
  }
}
