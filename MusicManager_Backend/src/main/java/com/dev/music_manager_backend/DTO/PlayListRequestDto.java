package com.dev.music_manager_backend.DTO;

import com.dev.music_manager_backend.models.PlayList;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.stream.Collectors;

@Getter
public class PlayListRequestDto {
    private Long id;
    private String name;

//    private String ownerEmail;
//    private List<SongRequestDto> songs;

    public PlayListRequestDto() {

    }

    public PlayListRequestDto(PlayList playList) {
        this.id = playList.getId();
        this.name = playList.getName();
//        this.ownerEmail = playList.getOwner().getEmail();
//        this.songs = playList.getSongs()
//                .stream()
//                .map(SongRequestDto::new)
//                .collect(Collectors.toList()
//                );
    }

    public static Page<PlayListRequestDto> fromPlaylists(Page<PlayList> playLists, Pageable pageable) {
        return new PageImpl<>(
                playLists.getContent()
                        .stream()
                        .map(PlayListRequestDto::new)
                        .collect(Collectors.toList()
                        ),
                pageable,
                playLists.getTotalElements()
        );
    }
}
