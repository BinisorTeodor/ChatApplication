package com.example.springprivatechats.messages;

public class MessageMapper {

    public static MessageNotification toDto(Messages entity) {
        MessageNotification dto = new MessageNotification();

        dto.setId(entity.getId());
        dto.setSenderName(entity.getSender().getFullName());
        dto.setSenderId(entity.getSender() != null ? entity.getSender().getId() : 0);
        if (entity.getGroup() != null) {
            dto.setReceiverId(entity.getGroup().getId());
        }
        dto.setContent(entity.getContent());
        dto.setTimestamp(entity.getTimestamp());
        return dto;
    }
}
