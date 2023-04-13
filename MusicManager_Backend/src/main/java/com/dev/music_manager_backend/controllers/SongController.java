package com.dev.music_manager_backend.controllers;

import com.dev.music_manager_backend.DTO.SongRequestDto;
import com.dev.music_manager_backend.models.ResponseObject;
import com.dev.music_manager_backend.services.ISongService;
import com.dev.music_manager_backend.util.MyObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

@RestController
@RequestMapping(path = "/api/songs")
@RequiredArgsConstructor
@CrossOrigin()
public class SongController {

    @Autowired
    private final ISongService songService;

    @GetMapping("")
    ResponseObject<Page<SongRequestDto>> get(
            @RequestParam(value = "_id", defaultValue = "-1") Long id,
            @RequestParam(value = "_title", defaultValue = "") String title,
            @RequestParam(value = "_genre", defaultValue = "") String genre,
            @RequestParam(value = "_musician", defaultValue = "") String musician,
            @RequestParam(value = "_owner_email", defaultValue = "") String ownerEmail,
            @RequestParam(value = "_playlist_id", defaultValue = "-1") Long playlistId,
            @RequestParam(value = "_page", defaultValue = "0") int page,
            @RequestParam(value = "_limit", defaultValue = "10") int limit,
            @RequestParam(value = "_field", defaultValue = "id") String field,
            @RequestParam(value = "_type_sort", defaultValue = "asc") String typeSort,

            HttpServletRequest request
    ) {
        Page<SongRequestDto> songs = new PageImpl<>(new ArrayList<>());
        try {
            songs = songService.findSongsWithPaginationAndSort(id, title, genre, musician, ownerEmail, playlistId, page, limit, field, typeSort, request);
            if (songs.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found songs.",
                        songs
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get songs successfully.",
                        songs
                );
            }
        } catch (Exception e) {
            return new ResponseObject<>(
                    "error",
                    "Cannot get songs. " + e.getMessage(),
                    songs
            );
        }
    }

    @PostMapping("")
    ResponseObject<SongRequestDto> insertSong(
            @RequestParam("song") String data,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Song successfully inserted.",
                    songService.insertSong(MyObjectMapper.readValue(data, SongRequestDto.class), file, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new SongRequestDto()
            );
        }
    }

    @PutMapping("/withf/{id}")
    ResponseObject<SongRequestDto> updateSongWithFile(
            @PathVariable Long id,
            @RequestParam("song") String data,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Update Song successfully.",
                    songService.updateSong(id, MyObjectMapper.readValue(data, SongRequestDto.class), file, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new SongRequestDto()
            );
        }
    }

    @PutMapping("/withoutf/{id}")
    ResponseObject<SongRequestDto> updateSongWithoutFile(
            @PathVariable Long id,
            @RequestBody SongRequestDto song,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Update Song successfully.",
                    songService.updateSong(id, song, null, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new SongRequestDto()
            );
        }
    }


    @DeleteMapping("/{id}")
    ResponseObject<SongRequestDto> deleteSong(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Delete song successfully.",
                    songService.deleteSong(id, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new SongRequestDto()
            );
        }
    }

    @DeleteMapping("")
    ResponseObject<Boolean> deleteAllSong() {
        try {
            if (songService.deleteAllSongs())
                return new ResponseObject<>(
                        "ok",
                        "Delete all songs successfully.",
                        Boolean.TRUE
                );
            else return new ResponseObject<>(
                    "failed",
                    "Delete all songs failed.",
                    Boolean.FALSE
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    Boolean.FALSE
            );
        }
    }
}