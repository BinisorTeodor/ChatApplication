package com.example.springprivatechats.user;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {


    private UserRepository repository;
    private UserWebSocketController userWebSocketController;
    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository repository, UserWebSocketController userWebSocketController, UserRepository userRepository) {
        this.repository = repository;
        this.userWebSocketController = userWebSocketController;
        this.userRepository = userRepository;
    }


    public void saveUser(User user) {

        //force to NOT PARTIAL UPDATE
        user.setId(0);
        user.setAvatar("assets/images/images.png");
        repository.save(user);
    }

    public User getUserById(int id) {
        return repository.findById(id);
    }

    public List<User> getUsers() {
        return repository.findAll();
    }

    public User getUserByUsername(String username) {
        return repository.findByFullName(username);
    }

    public User getUserByUsernameAndPassword(String username, String password) {
        return repository.findByFullNameAndPassword(username, password);
    }

    public User getUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    public User getUserByEmailAndPassword(String email, String password) {
        return repository.findByEmailAndPassword(email, password);
    }

    public User updateOnlineStatus(User user, Boolean isOnline) {
        User savedUser = userRepository.findById(user.getId());
        savedUser.setOnline(isOnline);
        repository.save(savedUser);
        userWebSocketController.sendUserOnlineStatus(user.getFullName() + " is now online: " + isOnline);

        return user;
    }

    public User updateUserAvatar(int userId, String avatar) {


        User user = getUserById(userId);

        user.setAvatar(avatar);
        repository.save(user);

        userWebSocketController.sendUserOnlineStatus(user.getFullName() + "has updated avatar");

        return user;

    }

    public User updateUserFullName(int userId, String newFullName) {
        User user = getUserById(userId);

        User checkUser = userRepository.findByFullName(newFullName);


        if(checkUser == null && user!= null) {
            user.setFullName(newFullName);

            User saved =repository.save(user);

            userWebSocketController.sendUserOnlineStatus(user.getFullName() + "has updated nickname");

            return saved;
        }

        System.out.println("There is a user with the nickname " + newFullName);
        return null;

    }

    public User updateUserEmail(int userId, String email) {
        User user = getUserById(userId);

        User checkUser = userRepository.findByEmail(email);

        if(checkUser == null && user != null) {
            user.setEmail(email);

            User saved =repository.save(user);

            userWebSocketController.sendUserOnlineStatus(user.getFullName() + "has updated email");

            return saved;
        }

        System.out.println("There is a user with the email " + email);
        return null;
    }


}
