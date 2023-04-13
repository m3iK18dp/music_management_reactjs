package com.dev.music_manager_backend.services.impl;

import com.dev.music_manager_backend.DTO.PlayListRequestDto;
import com.dev.music_manager_backend.models.PlayList;
import com.dev.music_manager_backend.models.Song;
import com.dev.music_manager_backend.models.User;
import com.dev.music_manager_backend.repositories.PlaylistRepository;
import com.dev.music_manager_backend.repositories.SongRepository;
import com.dev.music_manager_backend.repositories.UserRepository;
import com.dev.music_manager_backend.services.IPlaylistService;
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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PlayListServiceImpl implements IPlaylistService {
    @Autowired
    private final PlaylistRepository playlistRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final SongRepository songRepository;

    public User extractUser(HttpServletRequest request) {
        if (request.getHeader("Authorization") != null) {
            if (!request.getHeader("Authorization").startsWith("Bearer "))
                throw new RuntimeException("Token is invalid.");
            JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
            String token = request.getHeader("Authorization").substring(7);
            return userRepository.findByEmail(jwtTokenUtil.extractUserName(token)).map(user -> {
                if (jwtTokenUtil.isTokenExpired(token))
                    throw new RuntimeException("Your token has expired, please re-enter to make a new token.");
                if (!user.isStatus())
                    throw new RuntimeException("The user of the above token has been disabled. Please use another user's token or contact the admin to activate the user.");
                return user;
            }).orElse(new User());
        }
        return new User();
    }

    @Override
    public Page<PlayListRequestDto> findPlayListsWithPaginationAndSort(Long id, String name, String ownerEmail, int page, int limit, String field, String typeSort, HttpServletRequest request) {
        LinkedHashMap<String, Object> filter = new LinkedHashMap<>();
        filter.put("id", id);
        filter.put("name", name);
        filter.put("ownerEmail", ownerEmail);
        log.info("findPlaylists with " + filter);
        User userFromAuth = extractUser(request);
        Pageable pageable = PageRequest.of(page, limit).withSort(Sort.by(typeSort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, field));
        if (Objects.equals(ownerEmail, "") ||
                Objects.equals(userFromAuth.getEmail(), ownerEmail) ||
                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
        ) {
            return PlayListRequestDto.fromPlaylists(
                    playlistRepository.findPlaylistsWithPaginationAndSort(id, name, ownerEmail, pageable),
                    pageable
            );
        } else throw new RuntimeException("You not admin, you can only get playlists with your own email address");
    }

    @Override
    public PlayListRequestDto insertPlayList(PlayListRequestDto playList, HttpServletRequest request) {
        log.info("Insert playlist: {}", playList);
        User user = extractUser(request);

        if (playlistRepository.findAll()
                .stream().anyMatch(
                        (pl) -> Objects.equals(pl.getName(), playList.getName())
                                && Objects.equals(user.getEmail(), pl.getOwner().getEmail())
                )
        ) {
            throw new RuntimeException("Upload playlists failed. You have already exists playlists with name: " + playList.getName() + ".");
        }
        try {
            return new PlayListRequestDto(
                    playlistRepository.save(
                            PlayList.builder()
                                    .name(playList.getName())
                                    .owner(user)
                                    .build()
                    )
            );
        } catch (Exception exception) {
            throw new RuntimeException("Upload Playlist failed.");
        }
    }

    @Override
    public PlayListRequestDto updatePlaylist(Long id, PlayListRequestDto playList, HttpServletRequest request) {
        log.info("Update playlist: {}", playList);
        User userFromAuth = extractUser(request);
        if (userFromAuth.getPlayLists().stream().anyMatch(playList1 -> Objects.equals(playList1.getId(), id)) ||
                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
        ) {
            if (playlistRepository.findAll()
                    .stream().anyMatch(
                            (pl) -> Objects.equals(pl.getName(), playList.getName())
                                    && Objects.equals(userFromAuth.getEmail(), pl.getOwner().getEmail())
                                    && !Objects.equals(pl.getId(), id)
                    )
            ) {
                throw new RuntimeException("Update playlists failed. You have already exists playlists with name: " + playList.getName() + ".");
            }
            try {
                return new PlayListRequestDto(
                        playlistRepository.save(
                                PlayList.builder()
                                        .id(id)
                                        .name(playList.getName())
                                        .owner(userFromAuth)
                                        .build()
                        )
                );
            } catch (Exception exception) {
                throw new RuntimeException("Update Playlist failed.");
            }
        } else throw new RuntimeException("You not admin, you can only update playlists with your own email address.");
    }

    @Override
    public PlayListRequestDto deletePlayList(Long id, HttpServletRequest request) {
        log.info("Delete Playlist");
        User userFromAuth = extractUser(request);
        if (userFromAuth.getPlayLists().stream().anyMatch(playList1 -> Objects.equals(playList1.getId(), id)) ||
                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
        ) {
            return
                    playlistRepository.findById(id).map(
                            playList -> {
                                try {
                                    playlistRepository.deleteById(id);
                                    return new PlayListRequestDto(playList);
                                } catch (Exception exception) {
                                    throw new RuntimeException("Delete playlist failed.");
                                }
                            }
                    ).orElseThrow(() -> new RuntimeException("Playlist not found."));
        } else throw new RuntimeException("You not admin, you can only delete playlists with your own email address.");
    }

    @Override
    public PlayListRequestDto addSongToPlayList(Long playlistId, Long songId, HttpServletRequest request) {
        log.info("Adding song to playlist");
        User userFromAuth = extractUser(request);
        if (userFromAuth.getPlayLists().stream().anyMatch(playList1 -> Objects.equals(playList1.getId(), playlistId)) ||
                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
        ) {
            return
                    playlistRepository.findById(playlistId).map(
                            playList ->
                                    songRepository.findById(songId).map(song -> {
                                        try {
                                            List<Song> newSongs = playList.getSongs();
                                            newSongs.add(song);
                                            playList.setSongs(newSongs);
                                            playlistRepository.save(playList);
                                            return new PlayListRequestDto(playList);
                                        } catch (Exception exception) {
                                            throw new RuntimeException("Add Song to playlist failed.");
                                        }
                                    }).orElseThrow(() -> new RuntimeException("Song not found."))
                    ).orElseThrow(() -> new RuntimeException("Playlist not found."));
        } else throw new RuntimeException("You not admin, you can only add songs to your playlists.");
    }

    @Override
    public PlayListRequestDto deleteSongInPlayList(Long playlistId, Long songId, HttpServletRequest request) {
        log.info("Delete song to playlist");
        User userFromAuth = extractUser(request);
        if (userFromAuth.getPlayLists().stream().anyMatch(playList1 -> Objects.equals(playList1.getId(), playlistId)) ||
                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
        ) {
            return
                    playlistRepository.findById(playlistId).map(
                            playList ->
                                    songRepository.findById(songId).map(song -> {
                                        try {
                                            List<Song> newSongs = playList.getSongs();
                                            newSongs.remove(song);
                                            playList.setSongs(newSongs);
                                            playlistRepository.save(playList);
                                            return new PlayListRequestDto(playList);
                                        } catch (Exception exception) {
                                            throw new RuntimeException("Delete Song in playlist failed.");
                                        }
                                    }).orElseThrow(() -> new RuntimeException("Song not found."))
                    ).orElseThrow(() -> new RuntimeException("Playlist not found."));
        } else throw new RuntimeException("You not admin, you can only delete songs in your playlists.");
    }
}
