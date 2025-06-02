package com.example.springprivatechats.notification;

import com.example.springprivatechats.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationOfMessageRepository extends JpaRepository<NotificationOfMessage, Integer> {

    List<NotificationOfMessage> findByUserId(int userId);
    NotificationOfMessage findByReceiverIdAndUserId(int receiverId, int userId);
}
