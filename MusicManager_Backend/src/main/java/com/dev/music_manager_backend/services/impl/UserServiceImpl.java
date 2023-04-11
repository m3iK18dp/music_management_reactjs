package com.dev.music_manager_backend.services.impl;

import com.dev.music_manager_backend.DTO.UserRequestDto;
import com.dev.music_manager_backend.models.Role;
import com.dev.music_manager_backend.models.Token;
import com.dev.music_manager_backend.models.User;
import com.dev.music_manager_backend.repositories.RoleRepository;
import com.dev.music_manager_backend.repositories.SongRepository;
import com.dev.music_manager_backend.repositories.TokenRepository;
import com.dev.music_manager_backend.repositories.UserRepository;
import com.dev.music_manager_backend.services.IUserService;
import com.dev.music_manager_backend.util.JwtTokenUtil;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

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
    private final SongRepository songRepository;
    @Autowired
    private final TokenRepository tokenRepository;
    @Autowired
    private final EntityManager entityManager;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public UserRequestDto registerUser(User user) {
        log.info("Register user: {}", user);
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setRoles(
                Collections.singletonList(
                        roleRepository.findByName("USER")
                                .orElseThrow(
                                        () -> new RuntimeException("List role is empty.")
                                )
                )
        );
        List<Role> attachedRoles = new ArrayList<>();
        for (Role role : user.getRoles()) {
            attachedRoles.add(entityManager.merge(role));
        }
        user.setRoles(attachedRoles);
        user.setSongs(new ArrayList<>());
        try {
            return new UserRequestDto(userRepository.save(user));
        } catch (Exception exception) {
            throw new RuntimeException("Email already exists, please enter another email to continue.");
        }
    }

    @Override
    public UserRequestDto saveUser(UserRequestDto user) {
        log.info("Saving user: {}", user);
        List<Role> attachedRoles = new ArrayList<>();
        for (Role role : roleRepository.findRolesByListRoleIds(user.getRoleIds())) {
            attachedRoles.add(entityManager.merge(role));
        }
        try {
            return new UserRequestDto(
                    userRepository.save(
                            User.builder()
                                    .firstName(user.getFirstName())
                                    .lastName(user.getLastName())
                                    .email(user.getEmail())
                                    .status(user.isStatus())
                                    .roles(attachedRoles)
                                    .songs(new ArrayList<>())
                                    .build()
                    )
            );
        } catch (Exception exception) {
            exception.printStackTrace();
            throw new RuntimeException("Email already exists, please enter another email to continue.");
        }
    }

    private User extractUser(HttpServletRequest request) {
        try {
            return userRepository.findByEmail(new JwtTokenUtil().extractUserName(request.getHeader("Authorization").substring(7))).orElse(new User());
        } catch (Exception exception) {
            throw new RuntimeException("Error when querying.");
        }
    }

    @Override
    public UserRequestDto updateUser(Long id, UserRequestDto user, HttpServletRequest request) {
        User userFromAuth = extractUser(request);
        if (
                (id != 1 || userFromAuth.getId() == 1)
                        && (
                        userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
                                || Objects.equals(userFromAuth.getId(), id)
                )
        ) {
            log.info("Updating user by admin: {}", id);
            List<Role> attachedRoles = new ArrayList<>();
            for (Role role : roleRepository.findRolesByListRoleIds(user.getRoleIds())) {
                attachedRoles.add(entityManager.merge(role));
            }
            return userRepository.findById(id).map(updateUser -> {
                if (!Objects.equals(updateUser.getEmail(), user.getEmail()) && userRepository.findByEmail(user.getEmail()).isPresent())
                    throw new RuntimeException("Email already exists, please enter another email to continue.");
                if (!Objects.equals(updateUser.getEmail(), user.getEmail()))
                    revokeAllUserTokens(updateUser.getEmail());
                return new UserRequestDto(
                        userRepository.save(
                                User.builder()
                                        .id(id)
                                        .firstName(user.getFirstName())
                                        .lastName(user.getLastName())
                                        .email(user.getEmail())
                                        .status(user.isStatus())
                                        .password(updateUser.getPassword())
                                        .roles(
                                                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
                                                        ? attachedRoles
                                                        : updateUser.getRoles()
                                        )
                                        .songs(songRepository.findSongsByListSongIds(user.getSongIds()))
                                        .lastUpdate(LocalDateTime.now())
                                        .build()
                        )
                );
            }).orElseThrow(() -> new RuntimeException("User not found."));

        } else
            throw new RuntimeException("You not admin, you can only update your user.");

    }

    @Override
    public UserRequestDto updateEmailToUser(Long id, String email, HttpServletRequest request) {
        log.info("Updating email to user: {}", id);
        User userFromAuth = extractUser(request);
        if (
                userFromAuth.getId() == 1
                        || (
                        id != 1
                                && (
                                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
                                        || Objects.equals(userFromAuth.getId(), id)
                        )
                )
        ) {
            return userRepository.findById(id).map(user -> {
                user.setEmail(email);
                user.setLastUpdate(LocalDateTime.now());
                try {
                    return new UserRequestDto(userRepository.save(user));
                } catch (Exception exception) {
                    throw new RuntimeException("Email already exists, please enter another email to continue.");
                }
            }).orElseThrow(() -> new RuntimeException("Use not found."));
        } else
            throw new RuntimeException("You not admin, you can only update your user.");
    }

    @Override
    public UserRequestDto updatePasswordToUser(Long id, String oldPassword, String newPassword, HttpServletRequest request) {
        log.info("Updating password to user: {}", id);
        User userFromAuth = extractUser(request);
        if (Objects.equals(userFromAuth.getId(), id)) {

            return userRepository.findById(id).map(user -> {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                if (encoder.matches(oldPassword, user.getPassword())) {
                    user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
                    user.setLastUpdate(LocalDateTime.now());
                    return new UserRequestDto(userRepository.save(user));
                } else {
                    throw new RuntimeException("Old Password not matched.");
                }
            }).orElseThrow(() -> new RuntimeException("User not found."));

        } else
            throw new RuntimeException("You not admin, you can only update your user.");
    }


    @Override
    public UserRequestDto changeStatusUser(Long userId, HttpServletRequest request) {
        log.info("Change Status User " + userId);
        User userFromAuth = extractUser(request);
        if (
                userFromAuth.getId() == 1
                        || (
                        userId != 1
                                && (
                                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
                                        || Objects.equals(userFromAuth.getId(), userId)
                        )
                )
        ) {
            return userRepository.findById(userId).map(user -> {

                if (user.isStatus())
                    revokeAllUserTokens(user.getEmail());
                else {
                    List<Token> lstToken = tokenRepository.findAllTokenByUserEmail(user.getEmail());
                    if (lstToken.size() > 0) {
                        Token lastestToken = lstToken.get(lstToken.size() - 1);
                        lastestToken.setRevoked(false);
                        tokenRepository.save(lastestToken);
                    }
                }
                user.setStatus(!user.isStatus());
                user.setLastUpdate(LocalDateTime.now());
                return new UserRequestDto(userRepository.save(user));

            }).orElseThrow(() -> new RuntimeException("User not found."));
        } else
            throw new RuntimeException("You not admin, you can only update your user.");
    }


    @Override
    public Page<UserRequestDto> findUsersWithPaginationAndSort(Long id, String email, String name, List<Long> roleIds, int status, int page, int limit, String field, String typeSort, HttpServletRequest request) {
        User userFromAuth = extractUser(request);
        if (
                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
                        || Objects.equals(userFromAuth.getId(), id)
                        || Objects.equals(userFromAuth.getEmail(), email)
        ) {

            LinkedHashMap<String, Object> filter = new LinkedHashMap<String, Object>();
            filter.put("id", id);
            filter.put("email", email);
            filter.put("name", name);
            filter.put("roleIds", roleIds);
            filter.put("status", status);
            filter.put("page", page);
            filter.put("limit", limit);
            filter.put("field", field);
            filter.put("typeSort", typeSort);
            log.info("Finding users with pagination and sort " + filter);
            Pageable pageable = PageRequest.of(page, limit).withSort(Sort.by(typeSort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, field));
            return UserRequestDto.fromUsers(userRepository.findUsersWithPaginationAndSort(id, email, name, roleIds, roleIds.size(), status, pageable), pageable);

        } else
            throw new RuntimeException("You not admin, you can only read for your user.");
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        log.info("Finding user by email: {}", email);
        try {
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            throw new RuntimeException("Error when querying.");
        }
    }

    @Override
    public void revokeAllUserTokens(String username) {
        log.info("Revoking all tokens for user {}", username);
        try {
            var validUserTokens = tokenRepository.findAllValidTokenByUserEmail(username);
            if (validUserTokens.isEmpty())
                return;
            validUserTokens.forEach(t -> t.setRevoked(true));
            tokenRepository.saveAll(validUserTokens);
        } catch (Exception e) {
            throw new RuntimeException("Error when querying.");
        }
    }

    @Override
    public UserRequestDto resetUserPassword(Long id, HttpServletRequest request) {
        User userFromAuth = extractUser(request);
        if (userFromAuth.getId() == 1 || (id != 1 && (userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN")) || Objects.equals(userFromAuth.getId(), id)))) {

            return userRepository.findById(id).map(user -> {
                        user.setPassword(new BCryptPasswordEncoder().encode("Abcd@1234"));
                        user.setLastUpdate(LocalDateTime.now());
                        return new UserRequestDto(userRepository.save(user));
                    }
            ).orElseThrow(() -> new RuntimeException("User not found."));

        } else
            throw new RuntimeException("You not admin, you can only update your user.");
    }

    @Override
    public Page<Role> findRolesWithPaginationAndSort(Long id, String name, List<Long> roleIds, Long userId, int page, int limit, String field, String typeSort, HttpServletRequest request) {
        User userFromAuth = extractUser(request);
        if (
                userFromAuth.getRoles().stream().anyMatch(r -> Objects.equals(r.getName(), "ADMIN"))
                        || Objects.equals(userFromAuth.getId(), userId)
        ) {
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
        } else
            throw new RuntimeException("You not admin, you can only read role for your user.");

    }

    @Override
    public void roleInitialization() {
        if (roleRepository.findAll().isEmpty()) {
            try {
                log.info("Initializing roles");
                List<Role> roles = new ArrayList<Role>();
                roles.add(new Role("ADMIN"));
                roles.add(new Role("USER"));
                roleRepository.saveAll(roles);
            } catch (Exception e) {
                throw new RuntimeException("Error when querying.");
            }
        }
    }

    @Override
    public void userInitialization() {
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            log.info("Initializing users");
            try {
                userRepository.save(
                        User.builder()
                                .firstName("admin")
                                .lastName("admin")
                                .email("admin@gmail.com")
                                .password(new BCryptPasswordEncoder().encode("admin"))
                                .status(true)
                                .roles(Collections.singletonList(roleRepository.findByName("ADMIN").orElse(null)))
                                .build()
                );
            } catch (Exception e) {
                throw new RuntimeException("Error when querying.");
            }
        }
    }
}
