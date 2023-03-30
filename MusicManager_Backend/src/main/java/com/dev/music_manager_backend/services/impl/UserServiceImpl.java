package com.dev.music_manager_backend.services.impl;

import com.dev.music_manager_backend.models.Role;
import com.dev.music_manager_backend.models.User;
import com.dev.music_manager_backend.repositories.RoleRepository;
import com.dev.music_manager_backend.repositories.TokenRepository;
import com.dev.music_manager_backend.repositories.UserRepository;
import com.dev.music_manager_backend.services.IUserService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements IUserService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final RoleRepository roleRepository;

    @Autowired
    private final TokenRepository tokenRepository;
    @Autowired
    private final EntityManager entityManager;

    @Override
    public User saveUser(User user) {
        log.info("Saving user: {}", user);
        try {
            user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
            user.setRoles(
                    !user.getRoles().isEmpty()
                            ? user.getRoles()
                            : Collections.singletonList(roleRepository.findByName("ROLE_USER").orElse(null))
            );
            // re-attach roles to the persistence context
            List<Role> attachedRoles = new ArrayList<>();
            for (Role role : user.getRoles()) {
                attachedRoles.add(entityManager.merge(role));
            }
            user.setRoles(attachedRoles);
            return userRepository.save(user);
        } catch (Exception exception) {
            throw new RuntimeException("Error while saving User --- " + exception.getMessage());
        }
    }

    @Override
    public User updateUser(Long id, User user) {
        log.info("Updating user by admin: {}", id);
        List<Role> attachedRoles = new ArrayList<>();
        for (Role role : user.getRoles()) {
            attachedRoles.add(entityManager.merge(role));
        }
        user.setRoles(attachedRoles);
        return userRepository.findById(id).map(updateUser -> {
            return userRepository.save(
                    User.builder()
                            .id(id)
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .status(user.isStatus())
                            .roles(user.getRoles())
                            .lastUpdate(LocalDateTime.now())
                            .build()
            );
        }).orElseThrow(() -> new RuntimeException("Update User with id: " + id + " failed"));
    }

//    @Override
//    public User updateUser(Long id, User user) {
//        log.info("Updating user: {}", id);
//        return userRepository.findById(id).map(updateUser -> {
//            updateUser.setFirstName(user.getFirstName());
//            updateUser.setLastName(user.getLastName());
//            return userRepository.save(updateUser);
//        }).orElseThrow(() -> new RuntimeException("Update User with id: " + id + " failed"));
//    }

    @Override
    public User updateEmailToUser(Long id, String email) {
        log.info("Updating email to user: {}", id);
        return userRepository.findById(id).map(user -> {
            user.setEmail(email);
            user.setLastUpdate(LocalDateTime.now());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Update Mail to User with id: " + id + " failed"));
    }

    @Override
    public User updatePasswordToUser(Long id, String oldPassword, String password, String confirmPassword) {
        log.info("Updating password to user: {}", id);
        return userRepository.findById(id).map(user -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            if (encoder.matches(oldPassword, user.getPassword())) {
                if (password.equals(confirmPassword)) {
                    user.setPassword(new BCryptPasswordEncoder().encode(password));
                    user.setLastUpdate(LocalDateTime.now());
                    return userRepository.save(user);
                } else {
                    throw new RuntimeException("Password and Confirm Password not match");
                }
            } else {
                throw new RuntimeException("Old Password not matched");
            }
        }).orElseThrow(() -> new RuntimeException("Update Password to User with id: " + id + " failed"));
    }

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
    @Override
    public Page<Role> findRolesWithPaginationAndSort(Long id, String name, List<Long> roleIds, Long userId, int page, int limit, String field, String typeSort) {
        LinkedHashMap<String, Object> filter = new LinkedHashMap<String, Object>();
        filter.put("id", id);
        filter.put("name", name);
        filter.put("roleIds", roleIds);
        filter.put("userId", userId);
        filter.put("page", page);
        filter.put("limit", limit);
        filter.put("field", field);
        filter.put("typeSort", typeSort);
        log.info("Find Roles with pagination and sort " + filter);
        return roleRepository.findRolesWithPaginationAndSort(id, name, roleIds, roleIds.size(), userId, PageRequest.of(page, limit).withSort(Sort.by(typeSort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, field)));
    }

    @Override
    public List<Role> findAllRoles() {
        return roleRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @Override
    public List<Role> findRolesByListRoleId(List<Long> roleIds) {
        return roleRepository.findRolesByListRoleId(roleIds);
//        return new ArrayList<>();
    }

    @Override
    public Role saveRole(Role role) {
        log.info("Saving role: {}", role);
        return roleRepository.save(role);
    }

//    @Override
//    public Role updateRole(Long id, Role role) {
//        log.info("Updating role: {}", id);
//        return roleRepository.findById(id).map(updateRole ->
//                roleRepository.save(Role.builder()
//                        .id(id)
//                        .name(role.getName())
//                        .build())
//        ).orElseThrow(() -> new RuntimeException("Update Role with id: " + id + " failed"));
//    }
//
//    @Override
//    public Role deleteRole(Long id) {
//        log.info("Deleting role: {}", id);
//        return roleRepository.findById(id).map(
//                role -> {
//                    roleRepository.delete(role);
//                    return role;
//                }
//        ).orElseThrow(() -> new RuntimeException("Delete Role failed"));
//    }
//
//    @Override
//    public Boolean deleteAllRolesExceptAdmin() {
//        log.info("Deleting all roles except admin");
//        try {
//            roleRepository.deleteAllRolesExceptAdmin();
//            return Boolean.TRUE;
//        } catch (Exception e) {
//            return Boolean.TRUE;
//        }
//    }


//    @Override
//    public User addRoleToUser(Long userId, String roleName) {
//        log.info("Adding role {} to user {}", roleName, userId);
//        User user = userRepository.findById(userId).orElse(null);
//        Role role = roleRepository.findByName(roleName).orElse(null);
//        if (user != null && role != null) {
//            user.getRoles().add(role);
//            revokeAllUserTokens(user.getEmail());
//            return userRepository.save(user);
//        } else
//            throw new RuntimeException("Update Role with name: " + roleName + " to User with id: " + userId + " failed");
//    }

    @Override
    public User changeStatusUser(Long userId) {
        return userRepository.findById(userId).map(user -> {
            if (user.isStatus())
                revokeAllUserTokens(user.getEmail());
            user.setStatus(!user.isStatus());
            user.setLastUpdate(LocalDateTime.now());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Change Status User with id: " + userId + " failed"));
    }

//    @Override
//    public Optional<User> findUserByEmail(String email) {
//        log.info("Finding user by email: {}", email);
//        return userRepository.findByEmail(email);
//    }

//    @Override
//    public Page<User> findUsersByRoleId(int roleId, int page, int limit, String field) {
//        log.info("Finding users by role id: {}", roleId);
//        return userRepository.findUsersByRoleName(roleId, PageRequest.of(page, limit).withSort(Sort.by(Sort.Direction.ASC, field)));
//    }

//    @Override
//    public Page<User> findUsersByRoleIds(List<Long> roleIds, int page, int limit, String field, String typeSort) {
//        log.info("Finding users by role names: {}", roleIds);
//        return userRepository.findUsersByRoles(roleIds, roleIds.size(), PageRequest.of(page, limit).withSort(Sort.by(typeSort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, field)));
//    }

    @Override
    public Page<User> findUsersWithPaginationAndSort(Long id, String email, String name, List<Long> roleIds, int status, int page, int limit, String field, String typeSort) {

        List<Long> listRoleIds = roleIds;
//                roleIds.length() == 0 ? new ArrayList<>() : Arrays.stream(roleIds.split("-"))
//                .map(Long::parseLong)
//                .collect(Collectors.toList()
//                );
        LinkedHashMap<String, Object> filter = new LinkedHashMap<String, Object>();
        filter.put("id", id);
        filter.put("email", email);
        filter.put("name", name);
        filter.put("roleIds", listRoleIds);
        filter.put("status", status);
        filter.put("page", page);
        filter.put("limit", limit);
        filter.put("field", field);
        filter.put("typeSort", typeSort);

        log.info("Finding users with pagination and sort " + filter);

        return userRepository.findUsersWithPaginationAndSort(id, email, name, listRoleIds, listRoleIds.size(), status, PageRequest.of(page, limit).withSort(Sort.by(typeSort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, field)));
    }

//    @Override
//    public Page<User> findAllUsers(int page, int limit, String field, String typeSort) {
//        log.info("Finding all users");
//        return userRepository.findAll(PageRequest.of(page, limit).withSort(Sort.by(typeSort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, field)));
//    }
//
//    @Override
//    public Optional<User> findUserById(Long id) {
//        log.info("Finding user by id: {}", id);
//        return userRepository.findById(id);
//    }

    @Override
    public void roleInitialization() {
        if (roleRepository.findAll().isEmpty()) {
            log.info("Initializing roles");
            List<Role> roles = new ArrayList<Role>();
            roles.add(new Role("ROLE_ADMIN"));
            roles.add(new Role("ROLE_USER"));
            roleRepository.saveAll(roles);
        }
    }

    @Override
    public void userInitialization() {
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            log.info("Initializing users");
            userRepository.save(
                    User.builder()
                            .firstName("admin")
                            .lastName("admin")
                            .email("admin@gmail.com")
                            .password(new BCryptPasswordEncoder().encode("admin"))
                            .status(true)
                            .roles(Collections.singletonList(roleRepository.findByName("ROLE_ADMIN").orElse(null)))
                            .build()
            );
        }
    }

    @Override
    public void revokeAllUserTokens(String username) {
        log.info("Revoking all tokens for user {}", username);
        var validUserTokens = tokenRepository.findAllValidTokenByUserEmail(username);
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(t -> t.setRevoked(true));
        tokenRepository.saveAll(validUserTokens);
    }

    @Override
    public User resetUserPassword(Long id) {
        return userRepository.findById(id).map(user -> {
                    user.setPassword(new BCryptPasswordEncoder().encode("Abcd@1234"));
                    user.setLastUpdate(LocalDateTime.now());
                    return userRepository.save(user);
                }
        ).orElseThrow(() -> new RuntimeException("Reset User Password with id: " + id + " failed"));
    }
}
