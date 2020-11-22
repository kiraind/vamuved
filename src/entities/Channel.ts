import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey
} from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'

@Entity()
export default class Channel {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  title: string;

  constructor (title: string) {
    this.title = title
  }
}
