package com.example.springprivatechats.messages;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessagesService {

    private MessagesRepository messagesRepository;

    @Autowired
    public MessagesService(MessagesRepository messagesRepository) {
        this.messagesRepository = messagesRepository;
    }

    public List<Messages> getMessages() {
        return messagesRepository.findAll();
    }

    public Messages save(Messages message) {
        return messagesRepository.save(message);
    }

    public List<Messages> getPrivateChat(int senderId, int receiverId) {
        return messagesRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestampAsc(senderId, receiverId, senderId, receiverId);
    }

    public List<Messages> getGroupChat(int groupId) {
        return messagesRepository.findByGroup_IdOrderByTimestampAsc(groupId);
    }

    public Messages deleteMessage(int id) {

        Optional<Messages> optionalMessage = messagesRepository.findById(id);
        if (optionalMessage.isEmpty()) {
            System.out.println("Message not found with id: " + id);
            return null;
        }
        return messagesRepository.deleteById(id);
    }
}
