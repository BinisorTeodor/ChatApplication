package com.example.springprivatechats.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationOfFriendRequestService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(int userId,NotificationOfFriendRequest notificationOfFriendRequest) {
        log.info("Sending notification of friend request to user {} with payload {} ",
                userId, notificationOfFriendRequest);
        messagingTemplate.convertAndSendToUser
                (String.valueOf(userId), "/notificationOfFriendRequest", notificationOfFriendRequest);
    }

    public void sendMessageNotification(Integer userId, NotificationOfMessage notificationOfMessage) {

        log.info("Sending notification to user with payload {} ",notificationOfMessage.getHas_new_messages());

        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/notificationOfMessages",
                notificationOfMessage);
    }

}
