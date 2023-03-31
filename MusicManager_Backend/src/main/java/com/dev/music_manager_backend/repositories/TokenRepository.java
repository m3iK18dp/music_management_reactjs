package com.dev.music_manager_backend.repositories;

import com.dev.music_manager_backend.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    @Query(value = """
                SELECT t.* FROM musicmanager.tokens t INNER JOIN musicmanager.users u ON t.USER_ID = u.ID
                WHERE u.EMAIL = :userEmail AND t.REVOKED = false
            """, nativeQuery = true)
    List<Token> findAllValidTokenByUserEmail(String userEmail);

    @Query(value = """
                SELECT t.* FROM musicmanager.tokens t INNER JOIN musicmanager.users u ON t.USER_ID = u.ID
                WHERE u.EMAIL = :userEmail
            """, nativeQuery = true)
    List<Token> findAllTokenByUserEmail(String userEmail);

//    @Query(value = """
//                SELECT t.* FROM musicmanager.tokens t INNER JOIN musicmanager.users u ON t.USER_ID = u.ID
//                WHERE u.EMAIL = :userId AND t.REVOKED = false
//            """, nativeQuery = true)
//    List<Token> findAllValidTokenByUser(Long userId);

    Optional<Token> findByToken(String token);

    @Query(value = """
            SELECT r.name FROM roles r, users_roles ur, tokens t, users u
            WHERE t.token=:token AND r.id = ur.ROLE_ID AND ur.USER_ID=u.id AND u.id = t.USER_ID
            """, nativeQuery = true)
    List<String> findRoleByToken(String token);
}
