package com.example.springprivatechats.group_members;


import com.example.springprivatechats.groups.Group;
import com.example.springprivatechats.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString
@Table(name = "group_members")
public class Group_Members {

    @EmbeddedId
    private GroupMembersId id;

    @ManyToOne
    @MapsId("groupId")
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name="joined_at")
    private Timestamp joinedAt;

}
