//package com.dev.music_manager_backend.services.impl;
//
//import com.dev.music_manager_backend.models.Musician;
//import com.dev.music_manager_backend.repositories.MusicianRepository;
//import com.dev.music_manager_backend.services.IMusicianService;
//import com.dev.music_manager_backend.services.IStorageService;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//@Slf4j
//public class MusicianServiceImpl implements IMusicianService {
//    @Autowired
//    private final MusicianRepository musicianRepository;
//    @Autowired
//    private final IStorageService imageFileStorageService;
//
//    @Override
//    public Page<Musician> getAll(int page, int limit, String field) {
//        return musicianRepository.findAll(PageRequest.of(page, limit).withSort(Sort.by(Sort.Direction.ASC, field)));
//    }
//
//    @Override
//    public Optional<Musician> getById(Long id) {
//        return Optional.empty();
//    }
//
//    @Override
//    public Page<Musician> getByName(String name, int page, int limit, String field) {
//        return null;
//    }
//
//    @Override
//    public Musician add(Musician musician, MultipartFile file) {
//        return Optional.empty();
//    }
//
//    @Override
//    public Musician update(Long id, Musician musician, MultipartFile file) {
//        log.info("Update song: {}", musician.getId());
//        return musicianRepository.findById(id).map(updateSong -> {
//            try {
//                if (file.isEmpty()) {
//                    return musicianRepository.save(
//                            Musician.builder()
//                                    .id(id)
//                                    .fullName(musician.getFullName())
//                                    .title(musician.getTitle())
//                                    .url(updateSong.getUrl())
//                                    .songs(musician.getSongs())
//                                    .build()
//                    );
//                } else {
//                    return musicianRepository.save(
//                            Musician.builder()
//                                    .id(id)
//                                    .fullName(musician.getFullName())
//                                    .title(musician.getTitle())
//                                    .url(imageFileStorageService.uploadFileToCloundinary(1, file))
//                                    .build()
//                    );
//                }
//            } catch (Exception e) {
//                throw new RuntimeException("Update musician failed " + e.getMessage());
//            }
//        }).orElseThrow(() -> new RuntimeException("Update song failed"));
//    }
//
//    @Override
//    public Musician deleteById(Long id) {
//        log.info("Delete musician: {}", id);
//        return musicianRepository.findById(id).map(
//                musician -> {
//                    try {
//                        musicianRepository.delete(musician);
//                        return musician;
//                    } catch (Exception e) {
//                        throw new RuntimeException("Delete musician failed " + e.getMessage());
//                    }
//                }
//        ).orElseThrow(() -> new RuntimeException("Delete musician failed"));
//    }
//
//    @Override
//    public Boolean deleteAll() {
//        try {
//            musicianRepository.deleteAll();
//            return Boolean.TRUE;
//        } catch (Exception e) {
//            throw new RuntimeException("Delete all musicians failed " + e.getMessage());
//        }
//    }
//
//
//}
