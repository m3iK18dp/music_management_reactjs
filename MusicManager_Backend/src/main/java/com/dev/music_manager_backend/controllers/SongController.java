package com.dev.music_manager_backend.controllers;

import com.dev.music_manager_backend.models.ResponseObject;
import com.dev.music_manager_backend.models.Song;
import com.dev.music_manager_backend.services.ISongService;
import com.dev.music_manager_backend.util.MyObjectMapper;
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
    ResponseObject<Page<Song>> get(
            @RequestParam(value = "_id", defaultValue = "-1") Long id,
            @RequestParam(value = "_title", defaultValue = "") String title,
            @RequestParam(value = "_genre", defaultValue = "") String genre,
            @RequestParam(value = "_musician", defaultValue = "") String musician,
            @RequestParam(value = "_page", defaultValue = "0") int page,
            @RequestParam(value = "_limit", defaultValue = "10") int limit,
            @RequestParam(value = "_field", defaultValue = "id") String field,
            @RequestParam(value = "_type_sort", defaultValue = "asc") String typeSort
    ) {
        Page<Song> songs = new PageImpl<>(new ArrayList<>());
        try {
            songs = songService.findSongsWithPaginationAndSort(id, title, genre, musician, page, limit, field, typeSort);
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
    ResponseObject<Song> insertSong(
            @RequestParam("song") String data,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Song song = MyObjectMapper.readValue(data, Song.class);
            return new ResponseObject<>(
                    "ok",
                    "Song successfully inserted.",
                    songService.insertSong(song, file)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new Song()
            );
        }
    }

    @PutMapping("/withf/{id}")
    ResponseObject<Song> updateSongWithFile(
            @PathVariable Long id,
            @RequestParam("song") String data,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            System.out.print(file);
            Song song = MyObjectMapper.readValue(data, Song.class);
            return new ResponseObject<>(
                    "ok",
                    "Update Song successfully.",
                    songService.updateSong(id, song, file)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new Song()
            );
        }
    }

    @PutMapping("/withoutf/{id}")
    ResponseObject<Song> updateSongWithoutFile(
            @PathVariable Long id,
            @RequestParam("song") String data
    ) {
        try {
            Song song = MyObjectMapper.readValue(data, Song.class);
            return new ResponseObject<>(
                    "ok",
                    "Update Song successfully.",
                    songService.updateSong(id, song, null)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new Song()
            );
        }
    }


    @DeleteMapping("/{id}")
    ResponseObject<Song> deleteSong(
            @PathVariable Long id
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Delete song successfully.",
                    songService.deleteSong(id)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new Song()
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