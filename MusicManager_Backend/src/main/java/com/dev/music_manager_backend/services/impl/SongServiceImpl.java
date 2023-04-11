package com.dev.music_manager_backend.services.impl;

import com.dev.music_manager_backend.DTO.SongRequestDto;
import com.dev.music_manager_backend.models.Song;
import com.dev.music_manager_backend.models.User;
import com.dev.music_manager_backend.repositories.RoleRepository;
import com.dev.music_manager_backend.repositories.SongRepository;
import com.dev.music_manager_backend.repositories.UserRepository;
import com.dev.music_manager_backend.services.ISongService;
import com.dev.music_manager_backend.services.IStorageService;
import com.dev.music_manager_backend.util.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SongServiceImpl implements ISongService {
    @Autowired
    private final SongRepository songRepository;
    @Autowired
    private final IStorageService storageService;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final RoleRepository roleRepository;

    private User extractUser(HttpServletRequest request) {
        try {
            return userRepository.findByEmail(new JwtTokenUtil().extractUserName(request.getHeader("Authorization").substring(7))).orElse(new User());
        } catch (Exception exception) {
            throw new RuntimeException("Error when querying.");
        }
    }

    @Override
    public Page<SongRequestDto> findSongsWithPaginationAndSort(Long id, String title, String genre, String musician, int page, int limit, String field, String typeSort, Long ownerId) {
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
        Pageable pageable = PageRequest.of(page, limit).withSort(Sort.by(typeSort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, field));
        return SongRequestDto.fromSongs(songRepository.findSongsWithPaginationAndSort(id, title, genre, musician, ownerId, pageable), pageable);
    }

    @Override
    public SongRequestDto insertSong(SongRequestDto song, MultipartFile file, HttpServletRequest request) {
        log.info("Insert song: {}", song.getId());
        if (songRepository.findByTitle(song.getTitle()).contains(song)) {
            throw new RuntimeException("Upload song failed. With Musician: " + song.getMusician() + " already exists song with title: " + song.getTitle() + ".");
        }
        try {
            return new SongRequestDto(songRepository.save(
                    Song.builder()
                            .title(song.getTitle())
                            .genre(song.getGenre())
                            .lastUpdate(LocalDateTime.now())
                            .musician(song.getMusician())
                            .url(storageService.uploadFileToCloundinary(0, file))
                            .owner(extractUser(request))
                            .build()
            ));
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage().contains("failed") ? exception.getMessage() : "Upload song failed.");
        }
    }

    @Override
    public SongRequestDto updateSong(Long id, SongRequestDto song, MultipartFile file, HttpServletRequest request) {
        log.info("Update song: {}", song.getId());
        User userFromAuth = extractUser(request);
        if (userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
                || userFromAuth.getSongs().stream().anyMatch(s -> Objects.equals(s.getId(), id))) {
            List<Song> songs = songRepository.findByTitle(song.getTitle());

            if (songs.stream()
                    .filter(songStr -> songStr.equals(song))
                    .findFirst().map(songMap -> !songMap.getId().equals(id)).orElse(false))
                throw new RuntimeException("Update Song failed. With Musician: " + song.getMusician() + " already exists song with title: " + song.getTitle() + ".");

            return songRepository.findById(id).map(updateSong -> {
                try {
                    return new SongRequestDto(songRepository.save(
                            Song.builder()
                                    .id(id)
                                    .title(song.getTitle())
                                    .genre(song.getGenre())
                                    .lastUpdate(LocalDateTime.now())
                                    .musician(song.getMusician())
                                    .url(file == null ? updateSong.getUrl() : storageService.updateFileToCloundinary(0, updateSong.getUrl(), file))
                                    .owner(updateSong.getOwner())
                                    .build()
                    ));
                } catch (Exception exception) {
                    throw new RuntimeException(exception.getMessage().contains("failed") ? exception.getMessage() : "Update song failed.");
                }
            }).orElseThrow(() -> new RuntimeException("Song not found."));
        } else
            throw new RuntimeException("You not admin, you can only update your songs.");
    }

//    private final SessionFactory sessionFactory;

    @Override
    public SongRequestDto deleteSong(Long id, HttpServletRequest request) {
        User userFromAuth = extractUser(request);

        if (userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
                || userFromAuth.getSongs().stream().anyMatch(s -> Objects.equals(s.getId(), id))) {
            log.info("Delete song: {}", id);
            return
                    songRepository.findById(id).map(
                            song -> {
                                try {
//                                    Session session = sessionFactory.getCurrentSession();
//                                    Song songSession = session.get(Song.class, id);
//                                    session.evict(songSession); // remove the object from Hibernate's cache
//                                    session.delete(songSession);
                                    songRepository.delete(song);
                                    storageService.deleteFileFromCloundinary(song.getUrl());
                                    return new SongRequestDto(song);
                                } catch (Exception exception) {
                                    exception.printStackTrace();
                                    throw new RuntimeException(exception.getMessage().contains("failed") ? exception.getMessage() : "Delete song failed.");
                                }
                            }
                    ).orElseThrow(() -> new RuntimeException("Song not found.")
                    );
        } else
            throw new RuntimeException("You not admin, you can only delete your songs.");
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
