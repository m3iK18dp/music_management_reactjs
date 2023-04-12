package com.dev.music_manager_backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "songs")
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 30)
    private String musician;
    @Column(length = 30)
    private String genre;
    @Column
    @Builder.Default
    private LocalDateTime lastUpdate = LocalDateTime.now();
    @Column(nullable = false)
    private String url;

    //    @ManyToMany(fetch = FetchType.EAGER)
//    @JoinTable(
//            name = "songs_musicians",
//            joinColumns = {@JoinColumn(name = "SONG_ID", referencedColumnName = "id")},
//            inverseJoinColumns = {@JoinColumn(name = "MUSICIAN_ID", referencedColumnName = "id")})
////    @JsonManagedReference
//    private List<Musician> musicians = new ArrayList<>();

    @ManyToOne()
    @JoinColumn(name = "OWNER_ID", referencedColumnName = "id")
    @JsonIgnoreProperties("songs")
    private User owner;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Song song = (Song) o;
        return title.equals(song.title) && Objects.equals(musician, song.musician);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, musician);
    }
}
