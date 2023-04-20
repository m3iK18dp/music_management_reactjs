package com.dev.music_manager_backend.controllers;

import com.dev.music_manager_backend.DTO.PlayListRequestDto;
import com.dev.music_manager_backend.models.ResponseObject;
import com.dev.music_manager_backend.services.IPlaylistService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@Controller
@RequestMapping(path = "/api/playlists")
@RequiredArgsConstructor
@CrossOrigin()
public class PlaylistController {
    @Autowired
    private final IPlaylistService playlistService;

    @GetMapping("")
    ResponseObject<Page<PlayListRequestDto>> get(
            @RequestParam(value = "_id", defaultValue = "-1") Long id,
            @RequestParam(value = "_name", defaultValue = "") String name,
            @RequestParam(value = "_owner_email", defaultValue = "") String ownerEmail,
            @RequestParam(value = "_page", defaultValue = "0") int page,
            @RequestParam(value = "_limit", defaultValue = "-1") int limit,
            @RequestParam(value = "_field", defaultValue = "id") String field,
            @RequestParam(value = "_type_sort", defaultValue = "asc") String typeSort,
            HttpServletRequest request
    ) {
        Page<PlayListRequestDto> playLists = new PageImpl<>(new ArrayList<>());
        try {
            if (limit == -1)
                limit = Integer.MAX_VALUE;
            playLists = playlistService.findPlayListsWithPaginationAndSort(id, name, ownerEmail, page, limit, field, typeSort, request);
            if (playLists.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found playlists.",
                        playLists
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get playlists successfully.",
                        playLists
                );
            }
        } catch (Exception e) {
            return new ResponseObject<>(
                    "error",
                    "Cannot get playlists. " + e.getMessage(),
                    playLists
            );
        }
    }

    @PostMapping("")
    ResponseObject<PlayListRequestDto> insertSong(
            @RequestBody PlayListRequestDto playList,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Playlist successfully inserted.",
                    playlistService.insertPlayList(playList, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new PlayListRequestDto()
            );
        }
    }

    @PutMapping("/{id}")
    ResponseObject<PlayListRequestDto> updatePlaylist(
            @PathVariable Long id,
            @RequestBody PlayListRequestDto playlist,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Update Playlist successfully.",
                    playlistService.updatePlaylist(id, playlist, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new PlayListRequestDto()
            );
        }
    }

    @DeleteMapping("/{id}")
    ResponseObject<PlayListRequestDto> deleteSong(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Delete playlist successfully.",
                    playlistService.deletePlayList(id, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new PlayListRequestDto()
            );
        }
    }


    @PostMapping("/add_song_to_playlist/{playlistId}")
    ResponseObject<PlayListRequestDto> addSongToPlaylist(
            @PathVariable Long playlistId,
            @RequestBody Long songId,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Add song to Playlist successfully.",
                    playlistService.addSongToPlayList(playlistId, songId, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new PlayListRequestDto()
            );
        }
    }

    @DeleteMapping("/delete_song_in_playlist/{playlistId}")
    ResponseObject<PlayListRequestDto> deleteSongInPlaylist(
            @PathVariable Long playlistId,
            @RequestBody Long songId,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Delete song in Playlist successfully.",
                    playlistService.deleteSongInPlayList(playlistId, songId, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new PlayListRequestDto()
            );
        }
    }
}
