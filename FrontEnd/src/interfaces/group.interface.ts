import { Timestamp } from "rxjs";
import { Friend } from "./friend.interface";
import { user } from "./user.interface";

export interface Group {
    id: number,
    name: string,
    description?: string,
    created_by?: number,
    created_at?: Timestamp<string>,
    members: number[],
    avatar: string,
    hasNewMessages?: boolean
}