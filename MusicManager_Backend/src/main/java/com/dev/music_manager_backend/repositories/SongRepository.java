package com.dev.music_manager_backend.repositories;

import com.dev.music_manager_backend.models.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    @Query(value = """
              SELECT s.* FROM songs s WHERE
                       (:id = -1 OR s.id = :id) AND
                       LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%')) AND
                       (LOWER(s.genre) LIKE LOWER(CONCAT('%', :genre, '%')) OR s.genre IS NULL) AND
                       (LOWER(s.musician) LIKE LOWER(CONCAT('%', :musician, '%')) OR s.musician IS NULL)
            """, countQuery = """
              SELECT COUNT(s.id) FROM songs s WHERE
                       (:id = -1 OR s.id = :id) AND
                       LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%')) AND
                       (LOWER(s.genre) LIKE LOWER(CONCAT('%', :genre, '%')) OR s.genre IS NULL) AND
                       (LOWER(s.musician) LIKE LOWER(CONCAT('%', :musician, '%')) OR s.musician IS NULL)
            """, nativeQuery = true)
    Page<Song> findSongsWithPaginationAndSort(
            @Param("id") Long id,
            @Param("title") String title,
            @Param("genre") String genre,
            @Param("musician") String musician,
            Pageable pageable
    );

    //    Page<Song> findByTitleContaining(String title, Pageable pageable);
//
//    Page<Song> findByMusicianContaining(String musician, Pageable pageable);
//
//    Page<Song> findByGenreContaining(String musician, Pageable pageable);
//
    List<Song> findByTitle(String title);

//    @Query(value = "SELECT * FROM songs s WHERE s.title LIKE %:title%", nativeQuery = true)
//    Optional<List<Song>> findByTitleContaining(@Param(value = "title") String title);
}
