package com.example.springprivatechats.friend_requests;

import com.example.springprivatechats.user.User;
import org.springframework.stereotype.Component;

@Component
public class FriendRequestMapper {

    public FriendRequestsDTO toDTO(FriendRequests entity) {
        FriendRequestsDTO dto = new FriendRequestsDTO();
        dto.setSender_id(entity.getSender().getId());
        dto.setReceiver_id(entity.getReceiver().getId());
        return dto;
    }

    public FriendRequests toEntity(FriendRequestsDTO dto, User sender, User receiver) {
        FriendRequests entity = new FriendRequests();
        entity.setSender(sender);
        entity.setReceiver(receiver);
        entity.setId(0);
        entity.setStatus(Status.PENDING);
        return entity;
    }
}
