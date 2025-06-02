package com.example.springprivatechats.messages;

import com.example.springprivatechats.groups.GroupRepository;
import com.example.springprivatechats.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.sql.Timestamp;
import java.util.Objects;

@Controller
@RequiredArgsConstructor
public class MessagesWebSocketController {

    private final MessagesService messagesService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    @MessageMapping("/chat")
    public void chat(@Payload Messages message) {


        if(!message.getContent().equals("(DELETEMESSAGE@)")) {
            Messages msg =this.messagesService.save(message);
        }

        messagingTemplate.convertAndSendToUser(
                String.valueOf(message.getReceiver().getId()),
                "/queue/messages",
                MessageNotification.builder()
                        .senderId(message.getSender().getId())
                        .receiverId(message.getReceiver().getId())
                        .content(message.getContent())
                        .timestamp(new Timestamp(message.getTimestamp().getTime()))
                        .build()
        );
    }

    @MessageMapping("/group")
    public void groupChat(@Payload MessageNotification message) {
        System.out.println(message);
        Messages newMessage = new Messages();

        newMessage.setSender(userRepository.findById(message.getSenderId()));
        newMessage.setGroup(groupRepository.findGroupById(message.getReceiverId()));
        newMessage.setContent(message.getContent());
        newMessage.setTimestamp(new Timestamp(message.getTimestamp().getTime()));

        if(!message.getContent().equals("(DELETEMESSAGE@)")) {
            Messages msg =this.messagesService.save(newMessage);
        }


        messagingTemplate.convertAndSend(
                "/users/group/" + newMessage.getGroup().getId(),
                MessageNotification.builder()
                        .senderName(newMessage.getSender().getFullName())
                        .senderId(newMessage.getSender().getId())
                        .receiverId(newMessage.getGroup().getId())
                        .content(newMessage.getContent())
                        .timestamp(new Timestamp(newMessage.getTimestamp().getTime()))
                        .build()
        );
    }

}
