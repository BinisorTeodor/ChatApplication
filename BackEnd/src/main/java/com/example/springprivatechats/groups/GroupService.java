package com.example.springprivatechats.groups;

import com.example.springprivatechats.friend_requests.FriendRequestService;
import com.example.springprivatechats.group_members.GroupMembersId;
import com.example.springprivatechats.group_members.GroupMembersRepository;
import com.example.springprivatechats.group_members.Group_Members;
import com.example.springprivatechats.messages.MessageMapper;
import com.example.springprivatechats.messages.MessageNotification;
import com.example.springprivatechats.messages.Messages;
import com.example.springprivatechats.messages.MessagesService;
import com.example.springprivatechats.notification.NotificationOfFriendRequest;
import com.example.springprivatechats.notification.NotificationOfFriendRequestService;
import com.example.springprivatechats.user.User;
import com.example.springprivatechats.user.UserService;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@NoArgsConstructor
public class GroupService {

    private GroupRepository groupRepository;
    private GroupMembersRepository groupMembersRepository;
    private UserService userService;
    private MessagesService messagesService;
    private GroupWebSocketService groupWebSocketService;
    private FriendRequestService friendRequestService;
    private NotificationOfFriendRequestService notificationOfFriendRequestService;


    @Autowired
    public GroupService(GroupRepository groupRepository,
                        GroupMembersRepository groupMembersRepository,
                        UserService userService,
                        MessagesService messagesService,
                        GroupWebSocketService groupWebSocketService, FriendRequestService friendRequestService, NotificationOfFriendRequestService notificationOfFriendRequestService) {
        this.groupRepository = groupRepository;
        this.groupMembersRepository = groupMembersRepository;
        this.userService = userService;
        this.messagesService = messagesService;
        this.groupWebSocketService = groupWebSocketService;
        this.friendRequestService = friendRequestService;
        this.notificationOfFriendRequestService = notificationOfFriendRequestService;
    }

    public List<Group> getGroups() {
        return groupRepository.findAll();
    }

    public Group getGroupById(Integer groupId) {
        return groupRepository.findById(groupId).orElse(null);
    }


    public List<GroupCreateDTO> findGroupsByUser(Integer userId) {
        List<Group_Members> memberships = groupMembersRepository.findByUserId(userId);
        return memberships.stream()
                .map(Group_Members::getGroup)
                .map(GroupCreateDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Group createGroup(GroupCreateDTO groupCreateDTO) {

        System.out.println(groupCreateDTO.toString());

        Group newGroup = new Group();

        // SETTING UP THE NEW GROUP BASED ON THE DTO
        newGroup.setName(groupCreateDTO.getName());
        newGroup.setDescription(groupCreateDTO.getDescription());

        newGroup = groupRepository.save(newGroup);

        User owner = userService.getUserById(groupCreateDTO.getCreated_by());
        Group_Members ownerAsMember = new Group_Members();
        ownerAsMember.setGroup(newGroup);
        ownerAsMember.setUser(owner);
        ownerAsMember.setJoinedAt(groupCreateDTO.getCreated_at());

        GroupMembersId ownerMembersId = new GroupMembersId();
        ownerMembersId.setGroupId(newGroup.getId());
        ownerMembersId.setUserId(owner.getId());
        ownerAsMember.setId(ownerMembersId);

        groupMembersRepository.saveAndFlush(ownerAsMember);

        List<Group_Members> members = new ArrayList<>();

        for (Integer id : groupCreateDTO.getMembers()) {
            User user = userService.getUserById(id);
            Group_Members groupMembers = new Group_Members();

            // Set the group and user
            groupMembers.setGroup(newGroup);
            groupMembers.setUser(user);
            groupMembers.setJoinedAt(groupCreateDTO.getCreated_at());

            // Set the composite ID manually
            GroupMembersId groupMembersId = new GroupMembersId();
            groupMembersId.setGroupId(newGroup.getId());
            groupMembersId.setUserId(user.getId());
            groupMembers.setId(groupMembersId);

            members.add(groupMembers);

            groupMembersRepository.saveAndFlush(groupMembers);

            notificationOfFriendRequestService.sendNotification(
                    user.getId(),
                    NotificationOfFriendRequest
                            .builder()
                            .message("")
                            .build()
            );
        }

        // Associate the owner and members with the group
        newGroup.setCreated_by(owner);
        newGroup.setMembers(members);

        Group saved = groupRepository.save(newGroup);

        groupWebSocketService.sendGroupStatus("Created a new group");

        // RETURNING THE SAVED GROUP
        return saved;
    }

    public List<MessageNotification> getMessagesByGroupId(Integer groupId) {
        List<Messages> listOfMessages = messagesService.getGroupChat(groupId);

        List<MessageNotification> messageNotifications = new ArrayList<>();

        for (Messages message : listOfMessages) {
            messageNotifications.add(MessageMapper.toDto(message));
        }

        return messageNotifications;
    }

    public List<User> findGroupMembersByGroupId(Integer groupId) {

        //finding the group members from to group
        List<Group_Members> members = groupMembersRepository.findByGroupId(groupId);


        List<User> usersOfGroup = new ArrayList<>();

        for(Group_Members member: members) {

            //converting the members to user type
            usersOfGroup.add(member.getUser());
        }

        //returning the users as User type
        return usersOfGroup;
    }

    public Group updateNameOfGroup(Integer groupId, String newName) {
        Group group = groupRepository.findById(groupId).orElse(null);
        if(group != null) {
            group.setName(newName);
            Group saved =groupRepository.save(group);

            groupWebSocketService.sendGroupStatus("changed name of group");

            return saved;
        }

        return null;
    }

    public Group updateDescriptionOfGroup(Integer groupId, String newDescription) {
        Group group = groupRepository.findById(groupId).orElse(null);
        if(group != null) {
            group.setDescription(newDescription);
            Group saved =groupRepository.save(group);
            groupWebSocketService.sendGroupStatus("changed description of group");
            return saved;
        }
        return null;
    }

    public Group deleteMemberOfGroup(Integer groupId, Integer userId) {
        Group group = groupRepository.findById(groupId).orElse(null);

        if(group != null) {
            System.out.println(group.getMembers().size());

            List<Group_Members> members = group.getMembers();

            GroupMembersId groupMemberId = new GroupMembersId();

            groupMemberId.setGroupId(groupId);
            groupMemberId.setUserId(userId);

            members.removeIf(member -> member.getUser().getId().equals(userId));

            groupMembersRepository.deleteById(groupMemberId);

            group.setMembers(group.getMembers());

            System.out.println(group.getMembers().size());

            Group saved = groupRepository.save(group);

            groupWebSocketService.sendGroupStatus("deleted member of group");

            notificationOfFriendRequestService.sendNotification(
                    userId,
                    NotificationOfFriendRequest
                            .builder()
                            .message("")
                            .build()
            );

            return saved;
        }

        System.out.println("Something went wrong at deleting a member of group: " + groupId);
        return null;

    }

    @Transactional
    public Group addMemberToGroup(Integer groupId, Integer userId) {
        Group group = groupRepository.findById(groupId).orElse(null);

        Optional<Group_Members> newGroupMember = groupMembersRepository.findById(new GroupMembersId(groupId, userId));

        if(newGroupMember.isPresent()) {
            System.out.println("The member is already in the group");
            return null;
        }


        if(group != null) {
            User user = userService.getUserById(userId);

            Group_Members groupMembers = new Group_Members();

            // Set the group and user
            groupMembers.setGroup(group);
            groupMembers.setUser(user);


            // Set the composite ID manually
            GroupMembersId groupMembersId = new GroupMembersId();
            groupMembersId.setGroupId(group.getId());
            groupMembersId.setUserId(user.getId());
            groupMembers.setId(groupMembersId);

            groupMembersRepository.saveAndFlush(groupMembers);


            group.getMembers().add(groupMembers);



            group.setMembers(group.getMembers());

            System.out.println(group.getId() + " " + user.getId());

            groupRepository.save(group);

            groupWebSocketService.sendGroupStatus("added member to group");
            notificationOfFriendRequestService.sendNotification(
                    userId,
                    NotificationOfFriendRequest
                            .builder()
                            .message("")
                            .build()
            );
            return group;
        }
        return null;
    }

    public Group updateGroupAvatar(Integer groupId, String avatar) {
        Group group = groupRepository.findById(groupId).orElse(null);

        if(group != null) {
            group.setAvatar(avatar);
            Group saved =groupRepository.save(group);
            groupWebSocketService.sendGroupStatus("changed avatar of group");
            return saved;
        }

        return null;
    }


    public String deleteGroup(Integer groupId) {
        Group group = groupRepository.findById(groupId).orElse(null);

        if(group != null) {
            groupRepository.deleteById(groupId);

            return "Deleted group";
        }

        groupWebSocketService.sendGroupStatus("deleting a group");

        return "There is no group with this id";
    }
}
