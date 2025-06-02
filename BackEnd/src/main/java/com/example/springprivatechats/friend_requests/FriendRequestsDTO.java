package com.example.springprivatechats.friend_requests;

import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@ToString
public class FriendRequestsDTO {

    private Integer sender_id;
    private Integer receiver_id;
}
