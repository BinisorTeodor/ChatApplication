import { user } from "./user.interface";

export interface notification {
    id?: number,
    user: user,
    receiver: user,
    has_new_messages?: number
}