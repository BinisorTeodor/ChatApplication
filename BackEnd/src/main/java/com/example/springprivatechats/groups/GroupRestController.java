package com.example.springprivatechats.groups;


import com.example.springprivatechats.group_members.Group_Members;
import com.example.springprivatechats.messages.MessageNotification;
import com.example.springprivatechats.messages.Messages;
import com.example.springprivatechats.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class GroupRestController {

    private GroupService groupService;

    @Autowired
    public GroupRestController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping("/groups")
    public ResponseEntity<List<Group>> getGroups() {
        return ResponseEntity.ok(groupService.getGroups());
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<Group> getGroup(@PathVariable Integer groupId) {
        return ResponseEntity.ok(groupService.getGroupById(groupId));
    }

    @GetMapping("/groups/{userId}")
    public ResponseEntity<List<GroupCreateDTO>> getGroupsByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(groupService.findGroupsByUser(userId));
    }

    @GetMapping("/group/messages/{groupId}")
    public ResponseEntity<List<MessageNotification>> getGroupMessages(@PathVariable int groupId) {
        return ResponseEntity.ok(groupService.getMessagesByGroupId(groupId));
    }

    @GetMapping("/members/{groupId}")
    public ResponseEntity<List<User>> getGroupMembers(@PathVariable int groupId) {
        return ResponseEntity.ok(groupService.findGroupMembersByGroupId(groupId));
    }

    @PostMapping("/group")
    public ResponseEntity<Group> createGroup(@RequestBody GroupCreateDTO groupCreateDTO) {
        return ResponseEntity.ok(groupService.createGroup(groupCreateDTO));
    }

    @PatchMapping("/group/updateName/{groupId}")
    public ResponseEntity<Group> updateGroupName (@PathVariable int groupId, @RequestBody String newName) {
        return ResponseEntity.ok(groupService.updateNameOfGroup(groupId, newName));
    }

    @PatchMapping("/group/updateDescription/{groupId}")
    public ResponseEntity<Group> updateGroupDescription (@PathVariable int groupId, @RequestBody String newDescription) {
        return ResponseEntity.ok(groupService.updateDescriptionOfGroup(groupId, newDescription));
    }

    @PatchMapping("/group/delete/{groupId}")
    public ResponseEntity<Group> deleteGroupMember (@PathVariable int groupId, @RequestBody Integer userId) {
        return ResponseEntity.ok(groupService.deleteMemberOfGroup(groupId, userId));
    }

    @PatchMapping("/group/add/{groupId}")
    public ResponseEntity<Group> addGroupMember (@PathVariable int groupId, @RequestBody Integer userId) {
        return ResponseEntity.ok(groupService.addMemberToGroup(groupId, userId));
    }

    @PostMapping("/upload/group/avatar")
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

    @PatchMapping("/update/group/avatar/{groupId}")
    public ResponseEntity<Group> updateUserAvatar(@PathVariable int groupId, @RequestBody String avatar) {
        return ResponseEntity.ok(groupService.updateGroupAvatar(groupId, avatar));
    }

}
