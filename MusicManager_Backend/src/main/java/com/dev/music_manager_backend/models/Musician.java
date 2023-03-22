//package com.dev.music_manager_backend.models;
//
//import com.fasterxml.jackson.annotation.JsonBackReference;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.util.List;
//
//@Data
//@Setter
//@Getter
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Builder
//@Table(name = "musicians")
//public class Musician {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    @Column(nullable = false, length = 100)
//    private String fullName;
//    @Column
//    private String title;
//    @Column(nullable = false)
//    private String url;
//    @ManyToMany(mappedBy = "musicians")
//    @JsonBackReference
//    private List<Song> songs;
//}
