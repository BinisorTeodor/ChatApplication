import { notification } from "./notification.interface";
import { user } from "./user.interface";

export interface friendNotification {
    friend: user,
    notification: notification
}