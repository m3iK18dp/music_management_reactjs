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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

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
                        .revoked(0)
                        .build()
        );
    }

    @Override
    public List<Object> createAuthenticationToken(AuthenticationRequest authenticationRequest) {
        log.info("Creating authentication token for user {}", authenticationRequest);
        String username = authenticationRequest.getUsername();
        String password = authenticationRequest.getPassword();
        if (!userService.findUserByEmail(username).map(User::isStatus).orElseThrow(() -> new BadCredentialsException("No account found matching username."))) {
            throw new BadCredentialsException("User is disabled.");
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            username,
                            password
                    )
            );
        } catch (BadCredentialsException exception) {
            throw new RuntimeException("Your password is incorrect. Please re-enter your password.");
        }
//        userService.revokeAllUserTokens(username);
        String token = saveUserToken(username).getToken();
        return Arrays.asList(token,
                tokenRepository.findRoleByToken(token)
        );
    }


    @Override
    public List<Object> saveRegistration(User user) {
        log.info("Saving registration for user {}", user);
        String password = user.getPassword();
        userService.registerUser(user);
        return createAuthenticationToken(
                new AuthenticationRequest(user.getEmail(), password)
        );
    }

    @Override
    public List<Object> getAccountInformationByToken(String token) {
        System.out.print(token);
        log.info("Get Account Information");
        //List: revoked, isExpired, username, listRoles
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil(tokenRepository);
        return tokenRepository.findByToken(token)
                .map(tokenRepo -> Arrays.asList(
                                tokenRepo.getRevoked(),
                                jwtTokenUtil.isTokenExpired(tokenRepo.getToken()),
                                jwtTokenUtil.extractUserName(tokenRepo.getToken()),
                                tokenRepository.findRoleByToken(tokenRepo.getToken())
                        )
                ).orElseThrow(() -> new RuntimeException("Your token is invalid, please login again to continue."));
    }

    @Override
    public Boolean logoutAllInOtherDevices(String password, HttpServletRequest request) {
        User userFromAuth = userService.extractUser(request);
        System.out.println(userFromAuth.getPassword());
        System.out.println(password);
        System.out.println(new BCryptPasswordEncoder().matches(password, userFromAuth.getPassword()));
        if (!new BCryptPasswordEncoder().matches(password, userFromAuth.getPassword()))
            throw new RuntimeException("Password Incorrect");
        List<Token> lstTokens = tokenRepository.findAllTokenByUserEmail(userFromAuth.getEmail());
        lstTokens.forEach(
                token -> {
                    if (!Objects.equals(token.getToken(), request.getHeader("Authorization").substring(7)))
                        token.setRevoked(-1);
                }
        );
        tokenRepository.saveAll(lstTokens);
        return Boolean.TRUE;
    }
}
