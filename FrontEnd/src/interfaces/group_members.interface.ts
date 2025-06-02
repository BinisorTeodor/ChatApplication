import { Timestamp } from "rxjs";
import { user } from "./user.interface";

export interface group_members {
    group_id: number,
    user_id: user,
    joined_at: Timestamp<string>,
}