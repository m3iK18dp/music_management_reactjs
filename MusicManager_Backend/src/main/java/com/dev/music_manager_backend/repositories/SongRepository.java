package com.dev.music_manager_backend.repositories;

import com.dev.music_manager_backend.models.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    Page<Song> findByTitleContaining(String title, Pageable pageable);

    Page<Song> findByMusicianContaining(String musician, Pageable pageable);

    Page<Song> findByGenreContaining(String musician, Pageable pageable);

    List<Song> findByTitle(String title);

//    @Query(value = "SELECT * FROM songs s WHERE s.title LIKE %:title%", nativeQuery = true)
//    Optional<List<Song>> findByTitleContaining(@Param(value = "title") String title);
}
