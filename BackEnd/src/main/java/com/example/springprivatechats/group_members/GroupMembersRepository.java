package com.example.springprivatechats.group_members;

import com.example.springprivatechats.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMembersRepository extends JpaRepository<Group_Members, GroupMembersId> {

    List<Group_Members> findByUserId(Integer userId);
    List<Group_Members> findByGroupId(Integer groupId);
}
