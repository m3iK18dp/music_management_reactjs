package com.dev.music_manager_backend.services;

import com.dev.music_manager_backend.models.Role;
import com.dev.music_manager_backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IUserService {

    Page<User> findUsersWithPaginationAndSort(Long id, String email, String name, List<Long> roleIds, int status, int page, int limit, String field, String typeSort);

//    Page<User> findAllUsers(int page, int limit, String field, String typeSort);
//
//    Optional<User> findUserById(Long id);
//
//    Optional<User> findUserByEmail(String email);

//    Page<User> findUsersByRoleId(int roleId, int page, int limit, String field);

//    Page<User> findUsersByRoleIds(List<Long> roleIds, int page, int limit, String field, String typeSort);

    User saveUser(User user);

//    User updateUserByAmin(Long id, User user);

    User updateUser(Long id, User user);

    User updateEmailToUser(Long id, String email);

    User updatePasswordToUser(Long id, String oldPassword, String password, String confirmPassword);

//    User addRoleToUser(Long userId, String roleName);

    User changeStatusUser(Long userId);


//    User deleteUser(Long id);

//    Boolean deleteAllUsersExceptAdmin();

    //    @Override
    //    public User deleteUser(Long id) {
    //        log.info("Deleting user: {}", id);
    //        return userRepository.findById(id).map(user -> {
    //            userRepository.delete(user);
    //            return user;
    //        }).orElseThrow(() -> new RuntimeException("Delete user with id: " + id + " failed"));
    //    }
    //
    //    @Override
    //    public Boolean deleteAllUsersExceptAdmin() {
    //        log.info("Deleting all users except admin");
    //        try {
    //            userRepository.deleteAllUsersExceptAdmin();
    //            return Boolean.TRUE;
    //        } catch (Exception e) {
    //            return Boolean.TRUE;
    //        }
    //    }

    //    @Override
//    public User deleteUser(Long id) {
//        log.info("Deleting user: {}", id);
//        return userRepository.findById(id).map(user -> {
//            userRepository.delete(user);
//            return user;
//        }).orElseThrow(() -> new RuntimeException("Delete user with id: " + id + " failed"));
//    }
//
//    @Override
//    public Boolean deleteAllUsersExceptAdmin() {
//        log.info("Deleting all users except admin");
//        try {
//            userRepository.deleteAllUsersExceptAdmin();
//            return Boolean.TRUE;
//        } catch (Exception e) {
//            return Boolean.TRUE;
//        }
//    }
    Page<Role> findRolesWithPaginationAndSort(Long id, String name, List<Long> roleIds, Long userId, int page, int limit, String field, String typeSort);

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