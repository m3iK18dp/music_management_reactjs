package com.dev.music_manager_backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "playlists")
public class PlayList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(nullable = false, length = 50)
    private String name;

    @ManyToOne()
    @JoinColumn(name = "OWNER_ID", referencedColumnName = "id")
    @JsonIgnoreProperties("playlists")
    private User owner;
    @ManyToMany()
    @JoinTable(
            name = "playlists_songs",
            joinColumns = {@JoinColumn(name = "PLAYLIST_ID", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "SONG_ID", referencedColumnName = "id")})
//    @JsonManagedReference
    private List<Song> songs = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlayList playList = (PlayList) o;
        return name.equals(playList.name) && Objects.equals(owner, playList.owner);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, owner);
    }
}
