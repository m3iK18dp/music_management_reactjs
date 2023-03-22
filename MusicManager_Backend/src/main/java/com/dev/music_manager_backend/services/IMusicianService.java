//package com.dev.music_manager_backend.services;
//
//import com.dev.music_manager_backend.models.Musician;
//import org.springframework.data.domain.Page;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.Optional;
//
//@Service
//public interface IMusicianService {
//    Page<Musician> getAll(int page, int limit, String field);
//
//
//    Optional<Musician> getById(Long id);
//
//    Page<Musician> getByName(String name, int page, int limit, String field);
//
//    Musician add(Musician musician, MultipartFile file);
//
//    Musician update(Long id, Musician musician, MultipartFile file);
//
//    Musician deleteById(Long id);
//
//    Boolean deleteAll();
//}
