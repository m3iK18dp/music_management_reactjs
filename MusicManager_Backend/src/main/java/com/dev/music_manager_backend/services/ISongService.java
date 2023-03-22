package com.dev.music_manager_backend.services;

import com.dev.music_manager_backend.models.Song;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public interface ISongService {


    Page<Song> findAllSongs(int page, int limit, String field);

    Optional<Song> findSongById(Long id);

    Page<Song> findSongByTitle(String title, int page, int limit, String field);

    Page<Song> findSongByMusician(String musician, int page, int limit, String field);

    Page<Song> findSongByGenre(String genre, int page, int limit, String field);

    Song insertSong(Song song, MultipartFile file);

    Song updateSong(Long id, Song song, MultipartFile file);

    Song deleteSong(Long id);

    Boolean deleteAllSongs();
}
