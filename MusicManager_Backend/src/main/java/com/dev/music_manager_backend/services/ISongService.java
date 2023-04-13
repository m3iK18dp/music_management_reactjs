package com.dev.music_manager_backend.services;

import com.dev.music_manager_backend.DTO.SongRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface ISongService {

    Page<SongRequestDto> findSongsWithPaginationAndSort(Long id, String title, String genre, String musician, String ownerEmail, Long playlistId, int page, int limit, String field, String typeSort, HttpServletRequest request);

    SongRequestDto insertSong(SongRequestDto song, MultipartFile file, HttpServletRequest request);

    SongRequestDto updateSong(Long id, SongRequestDto song, MultipartFile file, HttpServletRequest request);

    SongRequestDto deleteSong(Long id, HttpServletRequest request);

    Boolean deleteAllSongs();
}
