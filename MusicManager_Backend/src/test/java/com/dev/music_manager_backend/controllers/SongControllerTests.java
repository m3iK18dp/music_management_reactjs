//package com.dev.music_manager_backend.controllers;
//
//import com.dev.music_manager_backend.models.Song;
//import com.dev.music_manager_backend.repositories.SongRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
//import org.springframework.test.annotation.Rollback;
//
//import java.util.List;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//
//@DataJpaTest
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//@Rollback(false)
//public class SongControllerTests {
//    @Autowired
//    private TestEntityManager entityManager;
//
//    @Autowired
//    private SongRepository repo;
//
//    @Test
//    public void testCreateSong() {
//        Song song = new Song();
//        song.setTitle("1 Phút");
//        song.setUrl("1 Phút Andiez");
//
//        Song savedSong = repo.save(song);
//
//        Song existSong = entityManager.find(Song.class, savedSong.getId());
//
//        assertThat(song.getId()).isEqualTo(existSong.getId());
//
//    }
//
//    @Test
//    public void testFindByTitle() {
//        String title = "1 Phút";
//        List<Song> songs = repo.findByUrl(title);
//
//        assertThat(songs.get(0).getTitle()).isEqualTo(title);
//    }
//}
