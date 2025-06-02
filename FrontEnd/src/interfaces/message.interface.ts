import { Timestamp } from "rxjs"
import { Group } from "./group.interface"
import { user } from "./user.interface"

export interface Message {
    id?: number,
    sender?: user,
    receiver?: user,
    group?: Group,
    timestamp: number,
    fromMe?: boolean,
    content: string
}