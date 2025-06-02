export interface GroupMessage {
    id?: number,
    senderName?: string,
    senderId: number,
    receiverId: number,
    content: string
    timestamp: number,
}