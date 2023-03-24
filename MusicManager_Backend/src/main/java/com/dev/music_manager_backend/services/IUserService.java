package com.dev.music_manager_backend.services;

import com.dev.music_manager_backend.models.Role;
import com.dev.music_manager_backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IUserService {
    Page<User> findAllUsers(int page, int limit, String field, String typeSort);

    Optional<User> findUserById(Long id);

    Optional<User> findUserByEmail(String email);

//    Page<User> findUsersByRoleId(int roleId, int page, int limit, String field);

    Page<User> findUsersByRoleIds(List<Integer> roleIds, int page, int limit, String field, String typeSort);

    User saveUser(User user);

//    User updateUserByAmin(Long id, User user);

    User updateUser(Long id, User user);

    User updateEmailToUser(Long id, String email);

    User updatePasswordToUser(Long id, String oldPassword, String password, String confirmPassword);

    User addRoleToUser(Long userId, String roleName);

    User changeStatusUser(Long userId);


//    User deleteUser(Long id);

//    Boolean deleteAllUsersExceptAdmin();

    List<Role> findAllRoles();

    List<Role> findRolesByListRoleId(List<Long> roleIds);

    Role saveRole(Role role);

//    Role updateRole(Long id, Role role);
//
//    Role deleteRole(Long id);
//
//    Boolean deleteAllRolesExceptAdmin();

    void roleInitialization();

    void userInitialization();

    ////////////////////////////////Important
    void revokeAllUserTokens(String username);

    User resetUserPassword(Long id);
}