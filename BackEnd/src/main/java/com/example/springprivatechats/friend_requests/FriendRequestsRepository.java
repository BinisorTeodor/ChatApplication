package com.example.springprivatechats.friend_requests;

import com.example.springprivatechats.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRequestsRepository extends JpaRepository<FriendRequests, Integer> {

    List<FriendRequests> findBySenderId(int senderId);
    List<FriendRequests> findByReceiverId(int receiverId);
    FriendRequests findBySenderIdAndReceiverId(int senderId, int receiverId);
    List<FriendRequests> findByStatusAndReceiverId(Status status, int receiverId);
    List<FriendRequests> findByStatusAndSenderId(Status status, int senderId);
}
