package com.example.springprivatechats.groups;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class GroupCreateDTO {

    private Integer id;
    private String name;
    private String description;
    private Integer created_by;
    private boolean has_new_messages;
    private Timestamp created_at;
    private List<Integer> members;
    private String avatar;
}
