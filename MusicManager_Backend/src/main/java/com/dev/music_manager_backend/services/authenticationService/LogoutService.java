package com.dev.music_manager_backend.services.authenticationService;

import com.dev.music_manager_backend.repositories.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Transactional
public class LogoutService implements LogoutHandler {
    @Autowired
    private final TokenRepository tokenRepository;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return;
        }
        String jwtToken = authorizationHeader.substring(7);
        var storedToken = tokenRepository.findByToken(jwtToken)
                .orElse(null);
        if (storedToken != null) {
            storedToken.setRevoked(true);
            tokenRepository.save(storedToken);
        }
    }
}
