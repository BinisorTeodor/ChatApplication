package com.example.springprivatechats.friend_requests;

import com.example.springprivatechats.notification.NotificationOfFriendRequest;
import com.example.springprivatechats.notification.NotificationOfFriendRequestService;
import com.example.springprivatechats.notification.NotificationOfMessage;
import com.example.springprivatechats.notification.NotificationOfMessageRepository;
import com.example.springprivatechats.user.User;
import com.example.springprivatechats.user.UserRepository;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@NoArgsConstructor
public class FriendRequestService {

    private FriendRequestsRepository repository;
    private UserRepository userRepository;
    private FriendRequestMapper mapper;
    private FriendRequestsRepository friendRequestsRepository;
    private NotificationOfFriendRequestService notificationOfFriendRequestService;
    private NotificationOfMessageRepository notificationOfMessageRepository;

    @Autowired
    FriendRequestService(FriendRequestsRepository repository,
                         UserRepository userRepository,
                         FriendRequestMapper mapper,
                         FriendRequestsRepository friendRequestsRepository,
                         NotificationOfFriendRequestService notificationOfFriendRequestService,
                         NotificationOfMessageRepository notificationOfMessageRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.friendRequestsRepository = friendRequestsRepository;
        this.notificationOfFriendRequestService = notificationOfFriendRequestService;
        this.notificationOfMessageRepository = notificationOfMessageRepository;
    }

    public List<FriendRequests> findAllFriendRequests() {
        return repository.findAll();
    }


    public List<FriendRequests> getSentRequests(int senderId) {
        return repository.findBySenderId(senderId);
    }


    public List<FriendRequests> getReceiverRequests(int receiverId) {
        return repository.findByReceiverId(receiverId);
    }

    public FriendRequests save(FriendRequestsDTO friendRequestsDTO) {

        System.out.println(friendRequestsDTO);
        User sender = userRepository.findById(friendRequestsDTO.getSender_id());
        User receiver = userRepository.findById(friendRequestsDTO.getReceiver_id());

        if(sender == null || receiver == null) {
            return null;
        }

        FriendRequests existingRequest = repository.findBySenderIdAndReceiverId(sender.getId(), receiver.getId());
        FriendRequests existingFriendRequest = repository.findBySenderIdAndReceiverId(receiver.getId(), sender.getId());


        if(existingRequest != null && existingRequest.getStatus() == Status.DECLINED) {
            existingRequest.setStatus(Status.PENDING);

            repository.save(existingRequest);

            notificationOfFriendRequestService.sendNotification(
                    existingRequest.getSender().getId(),
                    NotificationOfFriendRequest.builder()
                            .message("Notification of friend request from API SERVICE")
                            .build()
            );
            notificationOfFriendRequestService.sendNotification(
                    existingRequest.getReceiver().getId(),
                    NotificationOfFriendRequest.builder()
                            .message("Notification of friend request from API SERVICE")
                            .build()
            );

            return null;

        }

        if(existingFriendRequest != null && existingFriendRequest.getStatus() == Status.DECLINED) {

            existingFriendRequest.setStatus(Status.PENDING);
            repository.save(existingFriendRequest);
            notificationOfFriendRequestService.sendNotification(
                    existingFriendRequest.getSender().getId(),
                    NotificationOfFriendRequest.builder()
                            .message("Notification of friend request from API SERVICE")
                            .build()
            );
            notificationOfFriendRequestService.sendNotification(
                    existingFriendRequest.getReceiver().getId(),
                    NotificationOfFriendRequest.builder()
                            .message("Notification of friend request from API SERVICE")
                            .build()
            );

        }


        if(existingRequest != null && (existingRequest.getStatus() == Status.PENDING || existingRequest.getStatus() == Status.ACCEPTED) ) {
            return null;
        }

        if(existingFriendRequest != null && (existingFriendRequest.getStatus() == Status.PENDING || existingFriendRequest.getStatus() == Status.ACCEPTED) ) {
            return null;
        }

        //FORCE NOT TO PARTIAL UPDATE AND GIVING THE SENDER AND RECEIVER USING THE MAPPER OBJECT
        FriendRequests friendRequests = mapper.toEntity(friendRequestsDTO,sender,receiver);

        var saved = repository.save(friendRequests);
        notificationOfFriendRequestService.sendNotification(
                friendRequests.getSender().getId(),
                NotificationOfFriendRequest.builder()
                        .message("Notification of friend request from API SERVICE")
                        .build()
        );
        notificationOfFriendRequestService.sendNotification(
                friendRequests.getReceiver().getId(),
                NotificationOfFriendRequest.builder()
                        .message("Notification of friend request from API SERVICE")
                        .build()
        );
        return saved;
    }

    public FriendRequests findBySenderIdAndReceiverId(int senderId, int receiverId) {
        return repository.findBySenderIdAndReceiverId(senderId, receiverId);
    }

    public FriendRequests updateStatus(Integer id, Status status) {
        FriendRequests friendRequests = repository.findById(id).orElse(null);

        if(friendRequests == null) {
            return null;
        }
        friendRequests.setStatus(status);
        var saved = repository.save(friendRequests);
        notificationOfFriendRequestService.sendNotification(
                friendRequests.getSender().getId(),
                NotificationOfFriendRequest.builder()
                        .message("Notification of friend request from API SERVICE")
                        .build()
                );
        notificationOfFriendRequestService.sendNotification(
                friendRequests.getReceiver().getId(),
                NotificationOfFriendRequest.builder()
                        .message("Notification of friend request from API SERVICE")
                        .build()
        );
        return saved;
    }


    public FriendRequests findById(int id) {
        return repository.findById(id).isPresent() ? repository.findById(id).get() : null;
    }

    public List<FriendRequests> getSentPendingRequests(Status status, int senderId) {
        return repository.findByStatusAndSenderId(status, senderId);
    }

    public List<FriendRequests> getReceivedPendingRequests(Status status, int receiverId) {
        return repository.findByStatusAndReceiverId(status, receiverId);
    }

    public List<User> getFriends(int userId) {
        Set<User> friends = new HashSet<>();

        friendRequestsRepository.findByStatusAndSenderId(Status.ACCEPTED, userId)
                .stream()
                .map(FriendRequests::getReceiver)
                .forEach(friends::add);

        friendRequestsRepository.findByStatusAndReceiverId(Status.ACCEPTED, userId)
                .stream()
                .map(FriendRequests::getSender)
                .forEach(friends::add);

        List<User> friends2 = new ArrayList<>(friends);
        friends2.sort(Comparator.comparing(User::getFullName));

        return new ArrayList<>(friends2);
    }

    public List<NotificationOfMessage> getNotificationOfMessages(int senderId) {

        //getting the notifications of all friends
        List<NotificationOfMessage> notifications = notificationOfMessageRepository.findByUserId(senderId);

        //sorting them in the same order of the friends ( by the name of the friend in ASC ORDER)
        notifications.sort(Comparator.comparing(notificationOfMessage -> notificationOfMessage.getReceiver().getFullName()));

        //returning them
        return notifications;
    }

    public NotificationOfMessage saveNotification(NotificationOfMessage notificationOfMessage) {

        Integer receiverId = notificationOfMessage.getReceiver().getId();
        Integer userId = notificationOfMessage.getUser().getId();


        NotificationOfMessage saved = notificationOfMessageRepository.save(notificationOfMessage);

        notificationOfFriendRequestService.sendMessageNotification(userId,notificationOfMessage);

        notificationOfFriendRequestService.sendMessageNotification(receiverId,notificationOfMessage);

        return saved;
    }

    public NotificationOfMessage updateNotification(int id, NotificationOfMessage notificationOfMessage) {
        NotificationOfMessage notification = notificationOfMessageRepository.findById(id).orElse(null);




        System.out.println("Input notificationOfMessage ID: " + notificationOfMessage.getId());

        if(notification == null) {
            System.out.println("NOTIFICATION NOT FOUND");
            return null;
        }
        Integer receiverId = notification.getReceiver().getId();
        Integer userId = notification.getUser().getId();

        if(notificationOfMessage.getHas_new_messages() == -1) {

            notification.setHas_new_messages(0);

            notificationOfMessageRepository.save(notification);

            notificationOfFriendRequestService.sendMessageNotification(userId, notification);

            return notification;

        }
        NotificationOfMessage receiverNotification = notificationOfMessageRepository.findByReceiverIdAndUserId(userId, receiverId);

        if(receiverNotification == null) {
            System.out.println("NOTIFICATION NOT FOUND");
            return null;
        }

        receiverNotification.setHas_new_messages(receiverNotification.getHas_new_messages() + 1);


        notificationOfMessageRepository.save(receiverNotification);

        notificationOfFriendRequestService.sendMessageNotification(receiverId, notification);

        System.out.println("Returning receiverNotification with ID: " + receiverNotification.getId());
        return receiverNotification;

    }

    public void deleteById(int id) {

        if(findById(id) != null) {
             repository.deleteById(id);
        }

    }

}