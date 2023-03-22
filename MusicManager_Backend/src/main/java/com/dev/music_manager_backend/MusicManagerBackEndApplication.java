package com.dev.music_manager_backend;

import com.dev.music_manager_backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class MusicManagerBackEndApplication implements CommandLineRunner {
    @Autowired
    private final IUserService userService;

    @Override
    public void run(String... args) throws Exception {
        userService.roleInitialization();
        userService.userInitialization();

    }

    public static void main(String[] args) {
        SpringApplication.run(MusicManagerBackEndApplication.class, args);
    }
}
