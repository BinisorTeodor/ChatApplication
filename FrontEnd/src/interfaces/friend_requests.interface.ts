import { Status } from "../enums/status";
import { user } from "./user.interface";

export interface friend_request {
    id: number,
    sender: user,
    receiver: user,
    status: Status
}