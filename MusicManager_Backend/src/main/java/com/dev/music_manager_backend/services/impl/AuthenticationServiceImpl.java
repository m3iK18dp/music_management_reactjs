package com.dev.music_manager_backend.services.impl;

import com.dev.music_manager_backend.DTO.AuthenticationRequest;
import com.dev.music_manager_backend.models.Token;
import com.dev.music_manager_backend.models.TokenType;
import com.dev.music_manager_backend.models.User;
import com.dev.music_manager_backend.repositories.TokenRepository;
import com.dev.music_manager_backend.services.IAuthenticationService;
import com.dev.music_manager_backend.services.IUserService;
import com.dev.music_manager_backend.services.authenticationService.CustomUserDetailsService;
import com.dev.music_manager_backend.util.JwtTokenUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthenticationServiceImpl implements IAuthenticationService {
    @Autowired
    private final IUserService userService;
    @Autowired
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final TokenRepository tokenRepository;

    private Token saveUserToken(String username) {
        log.info("Saving token for user {}", username);
        final UserDetails userDetails =
                new CustomUserDetailsService(userService).loadUserByUsername(username);
        return tokenRepository.save(
                Token.builder()
                        .user(userService.findUserByEmail(username).orElse(null))
                        .token(JwtTokenUtil.generateJwtToken(userDetails))
                        .tokenType(TokenType.BEARER)
                        .revoked(false)
                        .build()
        );
    }

    @Override
    public List<Object> createAuthenticationToken(AuthenticationRequest authenticationRequest) throws Exception {
        log.info("Creating authentication token for user {}", authenticationRequest);

        String username = authenticationRequest.getUsername();
        String password = authenticationRequest.getPassword();
        if (!userService.findUserByEmail(username).map(User::isStatus).orElse(false)) {
            throw new BadCredentialsException("User is disabled");
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            username,
                            password
                    )
            );
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
        userService.revokeAllUserTokens(username);
        String token = saveUserToken(username).getToken();
        return Arrays.asList(token, getRoleByToken(token));
    }


    @Override
    public User saveRegistration(User user) {
        log.info("Saving registration for user {}", user);
        return userService.saveUser(user);
    }

    @Override
    public List<String> getRoleByToken(String token) {
        return tokenRepository.findRoleByToken(token);
    }


}
