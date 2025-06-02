package com.example.springprivatechats.user;


import com.example.springprivatechats.friend_requests.FriendRequests;
import com.example.springprivatechats.group_members.Group_Members;
import com.example.springprivatechats.groups.Group;
import com.example.springprivatechats.messages.Messages;
import com.example.springprivatechats.notification.NotificationOfMessage;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name="users")
@ToString
public class User {

    @Id
    @Column(name="id")
    private Integer id;

    @Column(name="fullname")
    private String fullName;

    @Column(name="email")
    private String email;

    @Column(name="password")
    private String password;

    @Column(name="avatar")
    private String avatar;

    @Column(name="is_online")
    private boolean isOnline;

    @OneToMany(mappedBy = "sender")
    @JsonIgnore
    private List<FriendRequests> sentRequests;

    @OneToMany(mappedBy = "receiver")
    @JsonIgnore
    private List<FriendRequests> friendRequests;

    @OneToMany(mappedBy = "sender")
    @JsonIgnore
    private List<Messages> senderMessages;

    @OneToMany(mappedBy = "receiver")
    @JsonIgnore
    private List<Messages> receiverMessages;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Group_Members> groupMembers;

    @OneToMany(mappedBy = "created_by")
    @JsonIgnore
    private List<Group> groups;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<NotificationOfMessage> notificationOfMessages;

    @OneToMany(mappedBy = "receiver")
    @JsonIgnore
    private List<NotificationOfMessage> sentNotificationOfMessages;
}
