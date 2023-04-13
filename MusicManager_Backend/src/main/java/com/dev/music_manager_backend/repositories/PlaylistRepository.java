package com.dev.music_manager_backend.repositories;

import com.dev.music_manager_backend.models.PlayList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<PlayList, Long> {
    @Query(value = """
              SELECT pl.* FROM playlists pl WHERE
                       (:id = -1 OR pl.id = :id) AND
                       LOWER(pl.name) LIKE LOWER(CONCAT('%', :name, '%')) AND
                       (:owner_email = '' OR pl.owner_id IN (
                                SELECT u.id FROM playlists pli, users u
                                    WHERE pli.owner_id = u.id
                                    AND u.email = :owner_email
                                )
                       )
            """, countQuery = """
              SELECT COUNT(pl.id) playlists pl WHERE
                        (:id = -1 OR pl.id = :id) AND
                       LOWER(pl.name) LIKE LOWER(CONCAT('%', :name, '%')) AND
                       (:owner_email = '' OR pl.owner_id IN (
                                SELECT u.id FROM playlists pli, users u
                                    WHERE pli.owner_id = u.id
                                    AND u.email = :owner_email
                                )
                       )
            """, nativeQuery = true)
    Page<PlayList> findPlaylistsWithPaginationAndSort(
            @Param("id") Long id,
            @Param("name") String name,
            @Param("owner_email") String ownerEmail,
            Pageable pageable
    );

    @Query(value = """
            SELECT pli.* FROM playlists pli, users u
                                    WHERE pli.owner_id = u.id
                                    AND u.email = :owner_email
            """, nativeQuery = true)
    List<PlayList> findByOwnerEmail(@Param("owner_email") String ownerEmail);

    List<PlayList> findByName(String name);

}
