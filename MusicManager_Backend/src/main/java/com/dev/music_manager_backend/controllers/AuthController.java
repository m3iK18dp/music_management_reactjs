package com.dev.music_manager_backend.controllers;

import com.dev.music_manager_backend.DTO.AuthenticationRequest;
import com.dev.music_manager_backend.models.ResponseObject;
import com.dev.music_manager_backend.models.User;
import com.dev.music_manager_backend.services.IAuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@Controller
@RequestMapping(path = "/api/auth")
@RequiredArgsConstructor
@CrossOrigin()
public class AuthController {

    @Autowired
    private final IAuthenticationService authenticationService;

    @PostMapping("/authenticate")
    public ResponseObject<List<Object>> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Create Successfully.",
                    authenticationService.createAuthenticationToken(authenticationRequest)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new ArrayList<>()
            );
        }
    }

    @GetMapping("/account_information")
    public ResponseObject<List<Object>> getAccountInformationByToken(HttpServletRequest request) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Get Account Information success.",
                    authenticationService.getAccountInformationByToken(request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new ArrayList<>()
            );
        }
    }

    @PostMapping("")
    public ResponseObject<User> registration(@RequestBody User user) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Register Successfully.",
                    authenticationService.saveRegistration(user)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "error",
                    exception.getMessage(),
                    new User()
            );
        }
    }


}
