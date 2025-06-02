package com.example.springprivatechats.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    User findByFullNameAndPassword(String fullName, String password);
    User findByFullName(String username);
    User findByEmail(String email);
    User findByEmailAndPassword(String email, String password);
    User findById(Integer id);
}
