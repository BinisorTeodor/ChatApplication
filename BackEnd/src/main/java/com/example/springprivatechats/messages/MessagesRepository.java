package com.example.springprivatechats.messages;


import com.example.springprivatechats.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessagesRepository extends JpaRepository<Messages, Integer> {

    List<Messages> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestampAsc(int senderId, int receiverId, int receiver, int sender);
    List<Messages> findByGroup_IdOrderByTimestampAsc(int groupId);
    Messages deleteById(int id);
}
