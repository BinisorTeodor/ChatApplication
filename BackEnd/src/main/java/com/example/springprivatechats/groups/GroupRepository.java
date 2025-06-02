package com.example.springprivatechats.groups;

import com.example.springprivatechats.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {

    Group findGroupById(int id);
}
