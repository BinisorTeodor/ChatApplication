package com.example.springprivatechats.friend_requests;


import com.example.springprivatechats.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "friend_requests")

public class FriendRequests {

    @Id
    @Column(name="id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name="sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name="receiver_id", nullable = false)
    private User receiver;

    @Column(name="status")
    @Enumerated(EnumType.STRING)
    private Status status;

}
