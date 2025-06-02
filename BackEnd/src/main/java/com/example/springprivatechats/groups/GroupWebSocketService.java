package com.example.springprivatechats.groups;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendGroupStatus(@Payload String message) {
        log.info(message);
        messagingTemplate.convertAndSend("/users/groupsStatus", message);
    }

}
