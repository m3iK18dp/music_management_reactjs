package com.dev.music_manager_backend.controllers;

import com.dev.music_manager_backend.DTO.AuthenticationRequest;
import com.dev.music_manager_backend.models.ResponseObject;
import com.dev.music_manager_backend.models.User;
import com.dev.music_manager_backend.services.IAuthenticationService;
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
@CrossOrigin("http://localhost:3000")
public class AuthController {

    @Autowired
    private final IAuthenticationService authenticationService;

    @PostMapping("/authenticate")
    public ResponseObject<List<Object>> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Create success",
                    authenticationService.createAuthenticationToken(authenticationRequest)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Create failed --- " + exception.getMessage(),
                    new ArrayList<>()
            );
        }
    }

    @PostMapping("/get_roles")
    public ResponseObject<List<String>> getRolesByToken(@RequestBody String token) {
        try {
            return new ResponseObject<>("ok", "Get roles by Token Success", authenticationService.getRoleByToken(token.replace("=", "")));
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Get roles by Token Failed --- " + exception.getMessage(),
                    new ArrayList<>()
            );
        }
    }

    @PostMapping("")
    public ResponseObject<User> registration(@RequestBody User user) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Register Success",
                    authenticationService.saveRegistration(user)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Register Failed --- " + exception.getMessage(),
                    new User()
            );
        }

    }


}
