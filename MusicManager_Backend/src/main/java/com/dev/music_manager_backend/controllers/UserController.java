package com.dev.music_manager_backend.controllers;

import com.dev.music_manager_backend.models.ResponseObject;
import com.dev.music_manager_backend.models.Role;
import com.dev.music_manager_backend.models.User;
import com.dev.music_manager_backend.services.IUserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class UserController {
    private final IUserService userService;

    @GetMapping("/users")
    public ResponseObject<Page<User>> getUser(@RequestParam(value = "_id", defaultValue = "-1") Long id,
                                              @RequestParam(value = "_email", defaultValue = "") String email,
                                              @RequestParam(value = "_name", defaultValue = "") String name,
                                              @RequestParam(value = "_role_ids", defaultValue = "") List<Long> roleIds,
                                              @RequestParam(value = "_status", defaultValue = "-1") int status,
                                              @RequestParam(value = "_page", defaultValue = "0") int page,
                                              @RequestParam(value = "_limit", defaultValue = "10") int limit,
                                              @RequestParam(value = "_field", defaultValue = "id") String field,
                                              @RequestParam(value = "_type_sort", defaultValue = "asc") String typeSort,
                                              HttpServletRequest request
    ) {

        LinkedHashMap<String, Object> filter = new LinkedHashMap<>();
        filter.put("id", id);
        filter.put("email", email);
        filter.put("name", name);
        filter.put("roleIds", roleIds);
        filter.put("status", status);
        filter.put("page", page);
        filter.put("limit", limit);
        filter.put("field", field);
        filter.put("typeSort", typeSort);
        Page<User> users = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            users = userService.findUsersWithPaginationAndSort(id, email, name, roleIds, status, page, limit, field, typeSort, request);
            if (users.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found Users with " + filter,
                        users
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get All Success with " + filter,
                        users
                );
            }
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't get all Users with " + filter + " ====" + exception.getMessage(),
                    users
            );
        }
    }

    @PostMapping("/users")
    public ResponseObject<User> addUser(
            @RequestBody User user
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Add User Success",
                    userService.saveUser(user)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't add user --- " + exception.getMessage(),
                    new User()
            );
        }
    }

    //admin
    @PutMapping("/users/{id}")
    public ResponseObject<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Update user with id: " + id,
                    userService.updateUser(id, user, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't update user with id = " + id + "\n" + exception.getMessage(),
                    new User()
            );
        }
    }

    @PutMapping("/users/reset_password/{id}")
    public ResponseObject<User> resetPassword(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Reset password to user with id: " + id + " success",
                    userService.resetUserPassword(id, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't reset password to user with id = " + id + "\n" + exception.getMessage(),
                    new User()
            );
        }
    }

    //user
    @PutMapping("/users/update_email/{id}")
    public ResponseObject<User> updateEmailToUser(
            @PathVariable Long id,
            @RequestBody String email,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Update user email with id: " + id,
                    userService.updateEmailToUser(id, email, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't update user email with id = " + id + "\n" + exception.getMessage(),
                    new User()
            );
        }
    }

    //user
    @PutMapping("/users/update_password/{id}")
    public ResponseObject<User> updatePasswordToUser(
            @PathVariable Long id,
            @RequestBody List<String> listPassword,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Update user email with id: " + id,
                    userService.updatePasswordToUser(id, listPassword.get(0), listPassword.get(1), request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't update user password with id = " + id + "\n" + exception.getMessage(),
                    new User()
            );
        }
    }

    @PutMapping("/users/change_status/{id}")
    public ResponseObject<User> changStatusUser(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Change Status user with id = " + id + " successfully",
                    userService.changeStatusUser(id, request)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot change status User with id = " + id + "===" + exception.getMessage(),
                    new User()
            );
        }
    }

    @GetMapping("/roles")
    public ResponseObject<Page<Role>> getRoles(
            @RequestParam(value = "_id", defaultValue = "-1") Long id,
            @RequestParam(value = "_name", defaultValue = "") String name,
            @RequestParam(value = "_role_ids", defaultValue = "") List<Long> roleIds,
            @RequestParam(value = "_userId", defaultValue = "-1") Long userId,
            @RequestParam(value = "_page", defaultValue = "0") int page,
            @RequestParam(value = "_limit", defaultValue = "10") int limit,
            @RequestParam(value = "_field", defaultValue = "id") String field,
            @RequestParam(value = "_type_sort", defaultValue = "asc") String typeSort,
            HttpServletRequest request
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
        Page<Role> roles = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            roles = userService.findRolesWithPaginationAndSort(id, name, roleIds, userId, page, limit, field, typeSort, request);
            if (roles.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found Roles with " + filter,
                        roles
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get Roles Success with " + filter,
                        roles
                );
            }
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't get Roles with " + filter + " ===" + exception.getMessage(),
                    roles
            );
        }
    }
}
