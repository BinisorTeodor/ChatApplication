package com.example.springprivatechats.messages;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class MessagesRestController {

    private MessagesService messagesService;

    public MessagesRestController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<List<Messages>> getMessage(@PathVariable int senderId, @PathVariable int receiverId) {
        return ResponseEntity.ok(messagesService.getPrivateChat(senderId,receiverId));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Messages>> getMessages() {
        return ResponseEntity.ok(messagesService.getMessages());
    }

    @DeleteMapping("/message/{id}")
    public ResponseEntity<Messages> deleteMessage(@PathVariable int id) {
        return ResponseEntity.ok(messagesService.deleteMessage(id));
    }
}
