package com.dev.music_manager_backend.services;

import com.dev.music_manager_backend.models.Role;
import com.dev.music_manager_backend.models.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IUserService {

    Optional<User> findUserByEmail(String email);

    User saveUser(User user);

    User updateUser(Long id, User user, HttpServletRequest request);

    User updateEmailToUser(Long id, String email, HttpServletRequest request);

    User updatePasswordToUser(Long id, String oldPassword, String password, String confirmPassword, HttpServletRequest request);

    Page<Role> findRolesWithPaginationAndSort(Long id, String name, List<Long> roleIds, Long userId, int page, int limit, String field, String typeSort, HttpServletRequest request);

    User changeStatusUser(Long userId, HttpServletRequest request);
    
    Page<User> findUsersWithPaginationAndSort(Long id, String email, String name, List<Long> roleIds, int status, int page, int limit, String field, String typeSort, HttpServletRequest request);

    void roleInitialization();

    void userInitialization();

    ////////////////////////////////Important
    void revokeAllUserTokens(String username);

    User resetUserPassword(Long id, HttpServletRequest request);
}