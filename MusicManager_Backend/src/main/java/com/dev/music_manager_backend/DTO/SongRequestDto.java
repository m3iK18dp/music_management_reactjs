package com.dev.music_manager_backend.DTO;

import com.dev.music_manager_backend.models.Song;
import lombok.Data;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Getter

@Data
public class SongRequestDto {
    private Long id;
    private String title;
    private String musician;
    private String genre;
    private LocalDateTime lastUpdate;
    private String url;
    private String ownerEmail;

    public SongRequestDto() {

    }

    public SongRequestDto(Song song) {
        this.id = song.getId();
        this.title = song.getTitle();
        this.musician = song.getMusician();
        this.genre = song.getGenre();
        this.lastUpdate = song.getLastUpdate();
        this.url = song.getUrl();
        this.ownerEmail = song.getOwner().getEmail();
    }

    public static Page<SongRequestDto> fromSongs(Page<Song> songs, Pageable pageable) {
        return new PageImpl<>(
                songs.getContent()
                        .stream()
                        .map(SongRequestDto::new)
                        .collect(Collectors.toList()
                        ),
                pageable,
                songs.getTotalElements()
        );
    }

//    public static Song parseSongs(SongRequestDto song) {
//        return Song.builder()
//                .id(song.getId())
//                .title(song.getTitle())
//                .genre(song.getGenre())
//                .lastUpdate(song.getLastUpdate())
//                .musician(song.getMusician())
//                .url(song.getUrl())
//                .owner(userRepository.findByEmail(song.getO))
//                .build();
//    }

}
