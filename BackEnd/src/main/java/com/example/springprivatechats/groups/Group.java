package com.example.springprivatechats.groups;

import com.example.springprivatechats.group_members.Group_Members;
import com.example.springprivatechats.messages.Messages;
import com.example.springprivatechats.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString
@Table(name = "groupss")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User created_by;

    @Column(name = "created_at")
    private Timestamp created_at;

    @Column(name= "has_new_messages")
    private Boolean has_new_messages;

    @Column(name ="avatar")
    private String avatar;

    @OneToMany(mappedBy = "group")
    @JsonIgnore
    List<Messages> messages;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Group_Members> members;

}
