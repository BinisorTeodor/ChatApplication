package com.example.springprivatechats.messages;


import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@MessageMapping
@Slf4j
@Builder
@ToString
public class MessageNotification {

    private int id;
    private String senderName;
    private int senderId;
    private int receiverId;
    private String content;
    private Timestamp timestamp;
}
