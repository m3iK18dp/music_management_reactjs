package com.dev.music_manager_backend.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dev.music_manager_backend.models.Song;
import com.dev.music_manager_backend.services.IStorageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MyFileServiceImpl implements IStorageService {
    private static final Cloudinary cloudinary = new Cloudinary("cloudinary://938415445483833:iW3BZzT_WJpIxsdUcANSlu10-vk@dx2nrp7at");

    @Override
    public boolean isMusicFile(MultipartFile file) {
        log.info("Is Music File: {}", file.getOriginalFilename());
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (fileExtension != null)
            return Arrays.asList(new String[]{"MP3", "WAV", "AAC", "OGG", "WMA", "FLAC", "AIFF", "ALAC", "MIDI", "M4A"})
                    .contains(fileExtension.trim().toUpperCase());
        return false;
    }

    @Override
    public boolean isImageFile(MultipartFile file) {
        log.info("Is Image File: {}", file.getOriginalFilename());
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (fileExtension != null)
            return Arrays.asList(new String[]{"png", "jpg", "jpeg", "bmp"}).contains(fileExtension.toLowerCase().trim());
        return false;
    }

    @Override
    public boolean checkBindingForFile(int type, MultipartFile file) {
        log.info("Check Binding for File: {}", file.getOriginalFilename());
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }
        float fileSizeInMegabytes = file.getSize() / 1_000_000.0f;
        if (type == 0) {
            if (!isMusicFile(file)) {
                throw new RuntimeException("Failed. You can only upload music file.");
            }
            if (fileSizeInMegabytes > 20.0f) {
                throw new RuntimeException("Failed. Music file size must be <= 20Mb.");
            }
        }
        if (type == 1) {
            if (!isImageFile(file)) {
                throw new RuntimeException("Failed. You can only upload music/image file.");
            }
            if (fileSizeInMegabytes > 40.0f) {
                throw new RuntimeException("Failed. Image File size must be <= 40Mb.");
            }
        }
        return true;
    }

    //type 0: Audio, 1: Image
    @Override
    public String uploadFileToCloundinary(int type, MultipartFile file) {
        log.info("Upload File To Cloudinary: {}", file.getOriginalFilename());
        checkBindingForFile(type, file);
        try {
            return (String) cloudinary
                    .uploader()
                    .upload(
                            file.getBytes(),
                            ObjectUtils.asMap(
                                    "public_id", UUID.randomUUID().toString(),
                                    "folder", "MusicManager",
                                    "overwrite", true,
                                    "resource_type", "auto"
                            )
                    ).get("secure_url");
        } catch (Exception exception) {
            throw new RuntimeException("Upload file in storage failed.");
        }
    }

    @Override
    public String updateFileToCloundinary(int type, String url, MultipartFile file) {
        log.info("Update File To Cloudinary: {}", file.getOriginalFilename());
        checkBindingForFile(type, file);
        try {

            String[] arrUrl = url.split("/");
            String[] publicId = arrUrl[arrUrl.length - 1].split("\\.");
            return (String) cloudinary
                    .uploader()
                    .upload(
                            file.getBytes(),
                            ObjectUtils.asMap(
                                    "public_id", publicId[0],
                                    "folder", "MusicManager",
                                    "overwrite", true,
                                    "resource_type", "auto"
                            )
                    ).get("secure_url");
        } catch (Exception exception) {
            throw new RuntimeException("Update file in storage failed.");
        }
    }

    @Override
    public Boolean deleteFileFromCloundinary(String url) {
        try {
            String[] arrUrl = url.split("/");
            String[] publicId = arrUrl[arrUrl.length - 1].split("\\.");
            cloudinary
                    .uploader()
                    .destroy(
                            publicId[0],
                            ObjectUtils.asMap()
                    );
            return Boolean.TRUE;
        } catch (IOException exception) {
            throw new RuntimeException("Delete file in storage failed.");
        }
    }

    @Override
    public Boolean deleteAllFileFromCloundinary(List<Song> listSong) {
        try {
            cloudinary
                    .api()
                    .deleteResources(listSong.stream().map(song -> {
                        String[] arrUrl = song.getUrl().split("/");
                        String[] publicId = arrUrl[arrUrl.length - 1].split("\\.");
                        return publicId[0];
                    }).collect(Collectors.toList()), ObjectUtils.emptyMap());
            return Boolean.TRUE;
        } catch (Exception exception) {
            throw new RuntimeException("Delete all files in storage failed.");
        }
    }

//    private String getHash(byte[] bytes, String algorithm) throws Exception {
//        java.security.MessageDigest digest = java.security.MessageDigest.getInstance(algorithm);
//        byte[] hash = digest.digest(bytes);
//        StringBuilder sb = new StringBuilder();
//        for (byte b : hash) {
//            sb.append(String.format("%02x", b));
//        }
//        return sb.toString();
//    }
}
