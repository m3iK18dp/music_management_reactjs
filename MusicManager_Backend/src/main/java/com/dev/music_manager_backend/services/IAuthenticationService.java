package com.dev.music_manager_backend.services;

import com.dev.music_manager_backend.DTO.AuthenticationRequest;
import com.dev.music_manager_backend.models.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IAuthenticationService {

    List<Object> createAuthenticationToken(AuthenticationRequest authenticationRequest);

    List<Object> saveRegistration(User user);


    List<Object> getAccountInformationByToken(String token);
}
