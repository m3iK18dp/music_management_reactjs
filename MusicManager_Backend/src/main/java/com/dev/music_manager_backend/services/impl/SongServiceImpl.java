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
import java.util.LinkedHashMap;
import java.util.List;

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
    public Page<Song> findSongsWithPaginationAndSort(Long id, String title, String genre, String musician, int page, int limit, String field, String typeSort) {
        LinkedHashMap<String, Object> filter = new LinkedHashMap<String, Object>();
        filter.put("id", id);
        filter.put("title", title);
        filter.put("genre", genre);
        filter.put("musician", musician);
        filter.put("page", page);
        filter.put("limit", limit);
        filter.put("field", field);
        filter.put("typeSort", typeSort);
        log.info("findSongsWithPaginationAndSort with " + filter);
        return songRepository.findSongsWithPaginationAndSort(id, title, genre, musician, PageRequest.of(page, limit).withSort(Sort.by(typeSort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, field)));
    }

    @Override
    public Song insertSong(Song song, MultipartFile file) {
        log.info("Insert song: {}", song.getId());
        if (songRepository.findByTitle(song.getTitle()).contains(song)) {
            throw new RuntimeException("Upload song failed. With Musician: " + song.getMusician() + " already exists song with title: " + song.getTitle() + ".");
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
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage().contains("failed") ? exception.getMessage() : "Upload song failed.");
        }
    }

    @Override
    public Song updateSong(Long id, Song song, MultipartFile file) {
        log.info("Update song: {}", song.getId());
        List<Song> songs = songRepository.findByTitle(song.getTitle());

        if (songs.stream()
                .filter(songStr -> songStr.equals(song))
                .findFirst().map(songMap -> !songMap.getId().equals(id)).orElse(false))
            throw new RuntimeException("Update Song failed. With Musician: " + song.getMusician() + " already exists song with title: " + song.getTitle() + ".");

        return songRepository.findById(id).map(updateSong -> {
            try {
                return songRepository.save(
                        Song.builder()
                                .id(id)
                                .title(song.getTitle())
                                .genre(song.getGenre())
                                .lastUpdate(LocalDateTime.now())
                                .musician(song.getMusician())
                                .url(file == null ? updateSong.getUrl() : storageService.updateFileToCloundinary(0, updateSong.getUrl(), file))
                                .build()
                );
            } catch (Exception exception) {
                throw new RuntimeException(exception.getMessage().contains("failed") ? exception.getMessage() : "Update song failed.");
            }
        }).orElseThrow(() -> new RuntimeException("Song not found."));
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
                    } catch (Exception exception) {
                        throw new RuntimeException(exception.getMessage().contains("failed") ? exception.getMessage() : "Delete song failed.");
                    }
                }
        ).orElseThrow(() -> new RuntimeException("Song not found."));
    }

    @Override
    public Boolean deleteAllSongs() {
        log.info("Delete all songs");
        try {
            storageService.deleteAllFileFromCloundinary(songRepository.findAll());
            songRepository.deleteAll();
            return Boolean.TRUE;
        } catch (Exception e) {
            throw new RuntimeException("Delete all songs failed. " + (e.getMessage().contains("failed") ? "" : e.getMessage()));
        }
    }
}
