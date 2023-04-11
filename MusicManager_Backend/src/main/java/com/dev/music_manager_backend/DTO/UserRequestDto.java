package com.dev.music_manager_backend.DTO;

import com.dev.music_manager_backend.models.Role;
import com.dev.music_manager_backend.models.Song;
import com.dev.music_manager_backend.models.User;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class UserRequestDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private boolean status = true;
    private LocalDateTime lastUpdate;
    private List<Long> roleIds;
    private List<Long> songIds;

    public UserRequestDto() {
    }

    public UserRequestDto(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.status = user.isStatus();
        this.lastUpdate = user.getLastUpdate();
        this.roleIds = user.getRoles().stream().map(Role::getId).collect(Collectors.toList());
        this.songIds = user.getSongs().stream().map(Song::getId).collect(Collectors.toList());
    }

    public static Page<UserRequestDto> fromUsers(Page<User> users, Pageable pageable) {
        return new PageImpl<>(
                users.getContent()
                        .stream()
                        .map(UserRequestDto::new)
                        .collect(Collectors.toList()
                        ),
                pageable,
                users.getTotalElements()
        );
    }
}
