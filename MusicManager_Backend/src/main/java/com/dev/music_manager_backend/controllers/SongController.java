package com.dev.music_manager_backend.controllers;

import com.dev.music_manager_backend.models.ResponseObject;
import com.dev.music_manager_backend.models.Song;
import com.dev.music_manager_backend.services.ISongService;
import com.dev.music_manager_backend.util.MyObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;

@RestController
@RequestMapping(path = "/api/songs")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class SongController {

    @Autowired
    private final ISongService songService;

    @GetMapping("")
    ResponseObject<?> get(
            @RequestParam(value = "_id", defaultValue = "-1") Long id,
            @RequestParam(value = "_title", defaultValue = "%") String title,
            @RequestParam(value = "_musician", defaultValue = "%") String musician,
            @RequestParam(value = "_genre", defaultValue = "%") String genre,
            @RequestParam(value = "_page", defaultValue = "0") int page,
            @RequestParam(value = "_limit", defaultValue = "10") int limit,
            @RequestParam(value = "_field", defaultValue = "id") String field
    ) {
        if (id != -1) {
            return getSongById(id);
        }
        if (!Objects.equals(title, "%")) {
            return getSongByTitle(title, page, limit, field);
        }
        if (!Objects.equals(musician, "%")) {
            return getSongByMusician(musician, page, limit, field);
        }
        if (!Objects.equals(genre, "%")) {
            return getSongByGenre(genre, page, limit, field);
        }
        return getAllSongs(page, limit, field);
    }

    ResponseObject<Page<Song>> getAllSongs(int page, int limit, String field) {
        Page<Song> songs = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            songs = songService.findAllSongs(page, limit, field);
            if (songs.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found songs",
                        songs
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get all songs with " + Arrays.toString(new Object[]{page, limit, field}) + " success",
                        songs
                );
            }
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get all songs with " + Arrays.toString(new Object[]{page, limit, field}) + " " + e.getMessage(),
                    songs
            );
        }
    }

    ResponseObject<Song> getSongById(Long id) {
        try {
            return songService.findSongById(id).map(song ->
                    new ResponseObject<>(
                            "ok",
                            "Query song successfully",
                            song
                    )
            ).orElseGet(() ->
                    new ResponseObject<>(
                            "failed",
                            "Not found song with id = " + id,
                            new Song()
                    )
            );
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get song with id = " + id + "\n" + e.getMessage(),
                    new Song()
            );
        }

    }

    ResponseObject<Page<Song>> getSongByTitle(String title, int page, int limit, String field) {
        Page<Song> songs = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            songs = songService.findSongByTitle(title, page, limit, field);
            if (songs.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found song with title = " + title,
                        songs
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get songs by title with " + Arrays.toString(new Object[]{title, page, limit, field}) + " successfully",
                        songs
                );
            }
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get songs by title with " + Arrays.toString(new Object[]{title, page, limit, field}) + " " + e.getMessage(),
                    songs
            );
        }
    }

    ResponseObject<Page<Song>> getSongByMusician(String musician, int page, int limit, String field) {
        Page<Song> songs = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            songs = songService.findSongByMusician(musician, page, limit, field);
            if (songs.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found song with musician = " + musician,
                        songs
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get songs by musician with " + Arrays.toString(new Object[]{musician, page, limit, field}) + " successfully",
                        songs
                );
            }
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get songs by musician with " + Arrays.toString(new Object[]{musician, page, limit, field}) + " " + e.getMessage(),
                    songs
            );
        }
    }

    ResponseObject<Page<Song>> getSongByGenre(String genre, int page, int limit, String field) {
        Page<Song> songs = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            songs = songService.findSongByGenre(genre, page, limit, field);
            if (songs.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found song with genre = " + genre,
                        songs
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get songs by genre with " + Arrays.toString(new Object[]{genre, page, limit, field}) + " successfully",
                        songs
                );
            }
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get songs by genre with " + Arrays.toString(new Object[]{genre, page, limit, field}) + " " + e.getMessage(),
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
            System.out.println(song);
            System.out.print(file.getResource());
            return new ResponseObject<>(
                    "ok",
                    "Song successfully inserted",
                    songService.insertSong(song, file)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't insert song\n" + exception.getMessage(),
                    new Song()
            );
        }
    }

    @PutMapping("/{id}")
    ResponseObject<Song> updateSong(
            @PathVariable Long id,
            @RequestParam("song") String data,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Song song = MyObjectMapper.readValue(data, Song.class);
            return new ResponseObject<>(
                    "ok",
                    "Update Song successfully",
                    songService.updateSong(id, song, file)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot update Song\n" + exception.getMessage(),
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
                    "Delete song successfully",
                    songService.deleteSong(id)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot can find song to delete\n" + exception.getMessage(),
                    new Song()
            );
        }
    }

    @DeleteMapping("")
    ResponseObject<Boolean> deleteAllSong() {
        if (songService.deleteAllSongs()) {
            return new ResponseObject<>(
                    "ok",
                    "Delete all song successfully",
                    Boolean.TRUE
            );
        } else {
            return new ResponseObject<>(
                    "failed",
                    "Can't delete all songs",
                    Boolean.TRUE
            );
        }
    }
}