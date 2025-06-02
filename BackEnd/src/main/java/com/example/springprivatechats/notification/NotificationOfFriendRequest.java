package com.example.springprivatechats.notification;


import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationOfFriendRequest {
    private String message;
}
