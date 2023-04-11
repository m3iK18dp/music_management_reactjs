package com.dev.music_manager_backend.services;

import com.dev.music_manager_backend.DTO.UserRequestDto;
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

    UserRequestDto registerUser(User user);

    UserRequestDto saveUser(UserRequestDto user);

    UserRequestDto updateUser(Long id, UserRequestDto user, HttpServletRequest request);

    UserRequestDto updateEmailToUser(Long id, String email, HttpServletRequest request);

    UserRequestDto updatePasswordToUser(Long id, String oldPassword, String newPassword, HttpServletRequest request);

    UserRequestDto changeStatusUser(Long userId, HttpServletRequest request);

    ////////////////////////////////Important
    void revokeAllUserTokens(String username);

    UserRequestDto resetUserPassword(Long id, HttpServletRequest request);

    Page<Role> findRolesWithPaginationAndSort(Long id, String name, List<Long> roleIds, Long userId, int page, int limit, String field, String typeSort, HttpServletRequest request);

    Page<UserRequestDto> findUsersWithPaginationAndSort(Long id, String email, String name, List<Long> roleIds, int status, int page, int limit, String field, String typeSort, HttpServletRequest request);

    void roleInitialization();

    void userInitialization();


}