package com.dev.music_manager_backend.services;

import com.dev.music_manager_backend.DTO.PlayListRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service

public interface IPlaylistService {

    Page<PlayListRequestDto> findPlayListsWithPaginationAndSort(Long id, String name, String ownerEmail, int page, int limit, String field, String typeSort, HttpServletRequest request);

    PlayListRequestDto insertPlayList(PlayListRequestDto playList, HttpServletRequest request);

    PlayListRequestDto updatePlaylist(Long id, PlayListRequestDto playList, HttpServletRequest request);

    PlayListRequestDto deletePlayList(Long id, HttpServletRequest request);

    PlayListRequestDto addSongToPlayList(Long playlistId, Long songId, HttpServletRequest request);

    PlayListRequestDto deleteSongInPlayList(Long playlistId, Long songId, HttpServletRequest request);
}
