package com.example.springprivatechats.user;

import com.example.springprivatechats.friend_requests.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class UserRestController {

    private final UserService userService;
    private final FriendRequestService friendRequestService;

    @Autowired
    public UserRestController(UserService userService, FriendRequestService friendRequestService) {
        this.userService = userService;
        this.friendRequestService = friendRequestService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getConnectedUsers() {

        if(userService.getUsers() == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(userService.getUsers());
    }

    @GetMapping("/user/by-username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        if(userService.getUserByUsername(username) == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @GetMapping("/user/by-username/{username}/{password}")
    public ResponseEntity<User> getUserByUsernameAndPassword(@PathVariable String username, @PathVariable String password) {
        if(userService.getUserByUsernameAndPassword(username, password) == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(userService.getUserByUsernameAndPassword(username, password));
    }

    @GetMapping("/user/by-email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        if(userService.getUserByEmail(email) == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @GetMapping("/user/by-email/{email}/{password}")
    public ResponseEntity<User> getUserByEmailAndPassword(@PathVariable String email, @PathVariable String password) {
        if(userService.getUserByEmail(email) == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(userService.getUserByEmailAndPassword(email, password));
    }

    @GetMapping("user/by-id/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable int userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<User>> getFriends(@PathVariable int userId) {
        return ResponseEntity.ok(friendRequestService.getFriends(userId));
    }


    @PatchMapping("/user/{status}")
    public ResponseEntity<User> onlineUser(@RequestBody User user, @PathVariable boolean status) {
        return ResponseEntity.ok(userService.updateOnlineStatus(user, status));
    }



    @PostMapping("/user")
    public ResponseEntity<User> createUser(@RequestBody User user) {

        if(!(getUserByEmail(user.getEmail()).equals(getUserByEmail("")))) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        try {
            //save the user
            this.userService.saveUser(user);
        } catch (Exception e) {

            //in case of save user error throw http error
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadUser(@RequestParam("file") MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        String imageUrl = "/uploads/" + fileName;
        System.out.println("UPLOAD IMAGE URL: " + imageUrl);

        return ResponseEntity.ok(imageUrl);
    }

    @PatchMapping("/update/avatar/{userId}")
    public ResponseEntity<User> updateUserAvatar(@PathVariable int userId, @RequestBody String avatar) {
        return ResponseEntity.ok(userService.updateUserAvatar(userId, avatar));
    }

    @PatchMapping("/update/username/{userId}")
    public ResponseEntity<User> updateUserUsername(@PathVariable int userId, @RequestBody String username) {
        return ResponseEntity.ok(userService.updateUserFullName(userId, username));
    }

    @PatchMapping("/update/email/{userId}")
    public ResponseEntity<User> updateUserEmail(@PathVariable int userId, @RequestBody String email) {
        return ResponseEntity.ok(userService.updateUserEmail(userId, email));
    }
}
