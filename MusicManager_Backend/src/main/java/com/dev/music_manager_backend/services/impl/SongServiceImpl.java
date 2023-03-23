package com.dev.music_manager_backend.services.impl;

import com.dev.music_manager_backend.models.Song;
import com.dev.music_manager_backend.repositories.SongRepository;
import com.dev.music_manager_backend.services.ISongService;
import com.dev.music_manager_backend.services.IStorageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SongServiceImpl implements ISongService {
    @Autowired
    private final SongRepository songRepository;
    @Autowired
    private final IStorageService storageService;

    @Override
    public Page<Song> findAllSongs(int page, int limit, String field) {
        return songRepository.findAll(PageRequest.of(page, limit).withSort(Sort.by(Sort.Direction.ASC, field)));
    }

    @Override
    public Optional<Song> findSongById(Long id) {
        log.info("Get song by id: {}", id);
        return songRepository.findById(id);
    }

    @Override
    public Page<Song> findSongByTitle(String title, int page, int limit, String field) {
        log.info("Get song by title: {}", title);
        return songRepository.findByTitleContaining(title.replace("%20", " "), PageRequest.of(page, limit).withSort(Sort.Direction.ASC, field));
    }

    @Override
    public Page<Song> findSongByMusician(String musician, int page, int limit, String field) {
        log.info("Get song by musician: {}", musician);
        return songRepository.findByMusicianContaining(musician.replace("%20", " "), PageRequest.of(page, limit).withSort(Sort.Direction.ASC, field));
    }

    @Override
    public Page<Song> findSongByGenre(String genre, int page, int limit, String field) {
        log.info("Get song by genre: {}", genre);
        return songRepository.findByGenreContaining(genre.replace("%20", " "), PageRequest.of(page, limit).withSort(Sort.Direction.ASC, field));

    }

    @Override
    public Song insertSong(Song song, MultipartFile file) {
        log.info("Insert song: {}", song.getId());
        if (songRepository.findByTitle(song.getTitle()).contains(song)) {
            throw new RuntimeException("Cannot insert song -> Musician: " + song.getMusician() + " already exists song with title: " + song.getTitle());
        }
        try {
            return songRepository.save(
                    Song.builder()
                            .title(song.getTitle())
                            .genre(song.getGenre())
                            .lastUpdate(LocalDateTime.now())
                            .musician(song.getMusician())
                            .url(storageService.uploadFileToCloundinary(0, file))
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Upload song failed " + e.getMessage());
        }
    }

    @Override
    public Song updateSong(Long id, Song song, MultipartFile file) {
        log.info("Update song: {}", song.getId());
        List<Song> songs = songRepository.findByTitle(song.getTitle());
        if (songs.contains(song)) {
            if (songs.stream()
                    .filter(songStr -> songStr.equals(song))
                    .findFirst().map(songMap -> !songMap.getId().equals(id)).orElse(false))
                throw new RuntimeException("Cannot update Song -> Musician: " + song.getMusician() + " already exists song with title: " + song.getTitle());
        }
        return songRepository.findById(id).map(updateSong -> {
            try {
                if (file == null) {
                    return songRepository.save(Song.builder()
                            .id(id)
                            .title(song.getTitle())
                            .genre(song.getGenre())
                            .lastUpdate(LocalDateTime.now())
                            .musician(song.getMusician())
                            .url(updateSong.getUrl())
                            .build()
                    );
                } else {
                    return songRepository.save(
                            Song.builder()
                                    .id(id)
                                    .title(song.getTitle())
                                    .genre(song.getGenre())
                                    .lastUpdate(LocalDateTime.now())
                                    .musician(song.getMusician())
                                    .url(storageService.updateFileToCloundinary(0, updateSong.getUrl(), file))
                                    .build()
                    );
                }
            } catch (Exception e) {
                throw new RuntimeException("Update song failed " + e.getMessage());
            }
        }).orElseThrow(() -> new RuntimeException("Update song failed"));
    }

    @Override
    public Song deleteSong(Long id) {
        log.info("Delete song: {}", id);
        return songRepository.findById(id).map(
                song -> {
                    try {
                        storageService.deleteFileFromCloundinary(song.getUrl());
                        songRepository.delete(song);
                        return song;
                    } catch (Exception e) {
                        throw new RuntimeException("Delete song failed " + e.getMessage());
                    }
                }
        ).orElseThrow(() -> new RuntimeException("Delete song failed"));
    }

    @Override
    public Boolean deleteAllSongs() {
        log.info("Delete all songs");
        try {
            storageService.deleteAllFileFromCloundinary(songRepository.findAll());
            songRepository.deleteAll();
            return Boolean.TRUE;
        } catch (Exception e) {
            throw new RuntimeException("Delete all songs failed " + e.getMessage());
        }
    }
}
