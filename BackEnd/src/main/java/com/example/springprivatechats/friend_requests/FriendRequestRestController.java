package com.example.springprivatechats.friend_requests;


import com.example.springprivatechats.notification.NotificationOfMessage;
import com.example.springprivatechats.user.User;
import com.example.springprivatechats.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class FriendRequestRestController {

    private FriendRequestService friendRequestService;

    @Autowired
    public FriendRequestRestController(FriendRequestService friendRequestService) {
        this.friendRequestService = friendRequestService;
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequests>> findAllFriendRequests() {
        return ResponseEntity.ok(friendRequestService.findAllFriendRequests());
    }

    @GetMapping("/requests/by-sender/{senderId}")
    public ResponseEntity<List<FriendRequests>> findBySenderId(@PathVariable int senderId) {
        return ResponseEntity.ok(friendRequestService.getSentRequests(senderId));
    }

    @GetMapping("/requests/by-receiver/{receiverId}")
    public ResponseEntity<List<FriendRequests>> findByReceiverId(@PathVariable int receiverId) {
        return ResponseEntity.ok(friendRequestService.getReceiverRequests(receiverId));
    }

    @GetMapping("/requests/sent/{senderId}")
    public ResponseEntity<List<FriendRequests>> findSentPendingRequests(@PathVariable int senderId) {
        return ResponseEntity.ok(friendRequestService.getSentPendingRequests(Status.PENDING,senderId));
    }

    @GetMapping("/requests/received/{receiverId}")
    public ResponseEntity<List<FriendRequests>> findReceiverPendingRequests(@PathVariable int receiverId) {
        return ResponseEntity.ok(friendRequestService.getReceivedPendingRequests(Status.PENDING,receiverId));
    }

    @GetMapping("/requests/{senderId}/{receiverId}")
    public ResponseEntity<FriendRequests> findBySenderIdAndReceiverId(@PathVariable int senderId, @PathVariable int receiverId) {
        return ResponseEntity.ok(friendRequestService.findBySenderIdAndReceiverId(senderId, receiverId));
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<NotificationOfMessage>> getNotificationOfMessages(@PathVariable int userId) {
        return ResponseEntity.ok(friendRequestService.getNotificationOfMessages(userId));
    }

    @PostMapping("/request")
    public ResponseEntity<FriendRequests> save(@RequestBody FriendRequestsDTO friendRequests) {
        return ResponseEntity.ok(friendRequestService.save(friendRequests));
    }

    @PostMapping("/notification")
    public ResponseEntity<NotificationOfMessage> saveNotification(@RequestBody NotificationOfMessage notificationOfMessage) {
        return ResponseEntity.ok(friendRequestService.saveNotification(notificationOfMessage));
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<FriendRequests> update(@PathVariable int id, @RequestBody UpdateFriendRequestDTO updateFriendRequestDTO) {
        return ResponseEntity.ok(friendRequestService.updateStatus(id,updateFriendRequestDTO.getStatus()));
    }

    @PatchMapping("/update/notification/{id}")
    public ResponseEntity<NotificationOfMessage> updateNotification(@PathVariable int id, @RequestBody NotificationOfMessage notificationOfMessage) {
        return ResponseEntity.ok(friendRequestService.updateNotification(id, notificationOfMessage));
    }
}
