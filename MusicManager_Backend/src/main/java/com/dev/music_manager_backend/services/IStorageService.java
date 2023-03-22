package com.dev.music_manager_backend.services;

import com.dev.music_manager_backend.models.Song;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface IStorageService {
    boolean isMusicFile(MultipartFile file);

    boolean isImageFile(MultipartFile file);

    boolean checkBindingForFile(int type, MultipartFile file);

    String uploadFileToCloundinary(int type, MultipartFile file);


    String updateFileToCloundinary(int type, String url, MultipartFile file);


    Boolean deleteFileFromCloundinary(String url);

    Boolean deleteAllFileFromCloundinary(List<Song> listSong);
}
