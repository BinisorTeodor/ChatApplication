package com.example.springprivatechats.groups;

import com.example.springprivatechats.user.User;
import org.springframework.stereotype.Component;

@Component
public class GroupCreateDTOMapper {

    public static GroupCreateDTO toDTO(Group group) {
        return GroupCreateDTO.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .created_by(group.getCreated_by().getId())
                .created_at(group.getCreated_at())
                .avatar(group.getAvatar())
                .members(group.getMembers() != null
                        ? group.getMembers().stream()
                        .map(gm -> gm.getUser().getId())
                        .toList()
                        : null)
                .build();
    }
}
