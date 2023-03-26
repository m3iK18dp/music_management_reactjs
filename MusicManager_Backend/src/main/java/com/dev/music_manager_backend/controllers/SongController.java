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
import java.util.LinkedHashMap;

@RestController
@RequestMapping(path = "/api/songs")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
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
        LinkedHashMap<String, Object> filter = new LinkedHashMap<String, Object>();
        filter.put("id", id);
        filter.put("title", title);
        filter.put("genre", genre);
        filter.put("musician", musician);
        filter.put("page", page);
        filter.put("limit", limit);
        filter.put("field", field);
        filter.put("typeSort", typeSort);
        Page<Song> songs = new PageImpl<>(new ArrayList<>());
        try {
            songs = songService.findSongsWithPaginationAndSort(id, title, genre, musician, page, limit, field, typeSort);
            if (songs.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found songs with " + filter,
                        songs
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get songs success with " + filter,
                        songs
                );
            }
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get songs with " + filter + "======" + e.getMessage(),
                    songs
            );
        }
    }

//    ResponseObject<Page<Song>> getAllSongs(int page, int limit, String field, String typeSort) {
//        Page<Song> songs = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
//        try {
//            songs = songService.findAllSongs(page, limit, field, typeSort);
//            if (songs.isEmpty()) {
//                return new ResponseObject<>(
//                        "failed",
//                        "Not found songs",
//                        songs
//                );
//            } else {
//                return new ResponseObject<>(
//                        "ok",
//                        "Get all songs with " + Arrays.toString(new Object[]{page, limit, field}) + " success",
//                        songs
//                );
//            }
//        } catch (Exception e) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Cannot get all songs with " + Arrays.toString(new Object[]{page, limit, field}) + " " + e.getMessage(),
//                    songs
//            );
//        }
//    }
//
//    ResponseObject<Page<Song>> getSongById(Long id) {
//        try {
//            return songService.findSongById(id).map(song ->
//                    new ResponseObject<>(
//                            "ok",
//                            "Query song successfully",
//                            (Page<Song>) new PageImpl<>(List.of(song), PageRequest.of(0, 10), 1)
//                    )
//            ).orElseGet(() ->
//                    new ResponseObject<>(
//                            "failed",
//                            "Not found song with id = " + id,
//                            new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 1)
//                    )
//            );
//        } catch (Exception e) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Cannot get song with id = " + id + "\n" + e.getMessage(),
//                    new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 1)
//            );
//        }
//
//    }
//
//    ResponseObject<Page<Song>> getSongByTitle(String title, int page, int limit, String field, String typeSort) {
//        Page<Song> songs = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
//        try {
//            songs = songService.findSongByTitle(title, page, limit, field, typeSort);
//            if (songs.isEmpty()) {
//                return new ResponseObject<>(
//                        "failed",
//                        "Not found song with title = " + title,
//                        songs
//                );
//            } else {
//                return new ResponseObject<>(
//                        "ok",
//                        "Get songs by title with " + Arrays.toString(new Object[]{title, page, limit, field}) + " successfully",
//                        songs
//                );
//            }
//        } catch (Exception e) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Cannot get songs by title with " + Arrays.toString(new Object[]{title, page, limit, field}) + " " + e.getMessage(),
//                    songs
//            );
//        }
//    }
//
//    ResponseObject<Page<Song>> getSongByMusician(String musician, int page, int limit, String field, String typeSort) {
//        Page<Song> songs = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
//        try {
//            songs = songService.findSongByMusician(musician, page, limit, field, typeSort);
//            if (songs.isEmpty()) {
//                return new ResponseObject<>(
//                        "failed",
//                        "Not found song with musician = " + musician,
//                        songs
//                );
//            } else {
//                return new ResponseObject<>(
//                        "ok",
//                        "Get songs by musician with " + Arrays.toString(new Object[]{musician, page, limit, field}) + " successfully",
//                        songs
//                );
//            }
//        } catch (Exception e) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Cannot get songs by musician with " + Arrays.toString(new Object[]{musician, page, limit, field}) + " " + e.getMessage(),
//                    songs
//            );
//        }
//    }
//
//    ResponseObject<Page<Song>> getSongByGenre(String genre, int page, int limit, String field, String typeSort) {
//        Page<Song> songs = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
//        try {
//            songs = songService.findSongByGenre(genre, page, limit, field, typeSort);
//            if (songs.isEmpty()) {
//                return new ResponseObject<>(
//                        "failed",
//                        "Not found song with genre = " + genre,
//                        songs
//                );
//            } else {
//                return new ResponseObject<>(
//                        "ok",
//                        "Get songs by genre with " + Arrays.toString(new Object[]{genre, page, limit, field}) + " successfully",
//                        songs
//                );
//            }
//        } catch (Exception e) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Cannot get songs by genre with " + Arrays.toString(new Object[]{genre, page, limit, field}) + " " + e.getMessage(),
//                    songs
//            );
//        }
//    }

    @PostMapping("")
    ResponseObject<Song> insertSong(
            @RequestParam("song") String data,
            @RequestParam("file") MultipartFile file
    ) {

        try {
            Song song = MyObjectMapper.readValue(data, Song.class);
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

    @PutMapping("/withoutf/{id}")
    ResponseObject<Song> updateSongWithoutFile(
            @PathVariable Long id,
            @RequestParam("song") String data
    ) {
        try {
            Song song = MyObjectMapper.readValue(data, Song.class);
            return new ResponseObject<>(
                    "ok",
                    "Update Song successfully",
                    songService.updateSong(id, song, null)
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