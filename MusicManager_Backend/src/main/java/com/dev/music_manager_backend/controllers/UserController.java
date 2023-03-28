package com.dev.music_manager_backend.controllers;

import com.dev.music_manager_backend.models.ResponseObject;
import com.dev.music_manager_backend.models.Role;
import com.dev.music_manager_backend.models.User;
import com.dev.music_manager_backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
                                              @RequestParam(value = "_page", defaultValue = "0") int page,
                                              @RequestParam(value = "_limit", defaultValue = "10") int limit,
                                              @RequestParam(value = "_field", defaultValue = "id") String field,
                                              @RequestParam(value = "_type_sort", defaultValue = "asc") String typeSort) {
//        if (id != -1) {
//            return getUserById(id);
//        }
//        if (!Objects.equals(email, "%")) {
//            return getUserByEmail(email);
//        }
//        if (!Objects.equals(roleIds, "%")) {
//            return getUsersByRoleIds(roleIds, page, limit, field, typeSort);
//        }
//        return getAllUsers(page, limit, field, typeSort);
        Page<User> users = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            users = userService.findUsersWithPaginationAndSort(id, email, name, roleIds, page, limit, field, typeSort);
            if (users.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found Users",
                        users
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get All Success",
                        users
                );
            }
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't get all Users ====" + exception.getMessage(),
                    users
            );
        }
    }

    //admin
    @GetMapping("/users/get_all")
    public ResponseObject<Page<User>> getAllUsers(
            int page,
            int limit,
            String field,
            String typeSort
    ) {
        Page<User> users = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            users = userService.findAllUsers(page, limit, field, typeSort);
            if (users.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found Users",
                        users
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get All Success",
                        users
                );
            }
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't get all Users",
                    users
            );
        }
    }

    //admin //user
    @GetMapping("/users/get_by_id/{id}")
    public ResponseObject<Page<User>> getUserById(
            Long id
    ) {
        try {
            return userService.findUserById(id).map(user ->
                    new ResponseObject<>(
                            "ok",
                            "Get user successfully",
                            (Page<User>) new PageImpl<>(List.of(user), PageRequest.of(0, 10), 1)
                    )
            ).orElseGet(() ->
                    new ResponseObject<>(
                            "failed",
                            "Not found user with id = " + id,
                            new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 1)
                    )
            );
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get user with id = " + id + "\n" + e.getMessage(),
                    new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 1)
            );
        }
    }

    //admin //user
    @GetMapping("/users/get_by_email")
    public ResponseObject<Page<User>> getUserByEmail(
            String email
    ) {
        try {
            Page<User> users = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
            return userService.findUserByEmail(email).map(user ->
                    new ResponseObject<>(
                            "ok",
                            "Get user successfully",
                            (Page<User>) new PageImpl<>(List.of(user), PageRequest.of(0, 10), 1)

                    )
            ).orElseGet(() ->
                    new ResponseObject<>(
                            "failed",
                            "Not found user with email = " + email,
                            new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 1)

                    )
            );
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get user with email = " + email + "\n" + e.getMessage(),
                    new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 1)
            );
        }
    }

    //admin
//    @GetMapping("/users/get_by_role_id")
//    public ResponseObject<Page<User>> getUsersByRoleId(
//            @RequestParam("_role_id") int roleId,
//            @RequestParam("_page") int page,
//            @RequestParam("_limit") int limit,
//            @RequestParam("_field") String field
//    ) {
//        Page<User> users = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
//        try {
//            users = userService.findUsersByRoleId(roleId, page, limit, field);
//            if (users.isEmpty()) {
//                return new ResponseObject<>(
//                        "failed",
//                        "Not found Users with role = " + roleId,
//                        users
//                );
//            } else {
//                return new ResponseObject<>(
//                        "ok",
//                        "Get Users with role = " + roleId + " Success",
//                        users
//                );
//            }
//        } catch (Exception exception) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Can't get Users with role = " + roleId + " " + exception.getMessage(),
//                    users
//            );
//        }
//    }

    //admin
    @GetMapping("/users/get_by_role_ids")
    public ResponseObject<Page<User>> getUsersByRoleIds(
            String roleIds,
            int page,
            int limit,
            String field,
            String typeSort
    ) {
        Page<User> users = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            users = userService.findUsersByRoleIds(
                    Arrays.stream(roleIds.split("-"))
                            .map(Long::parseLong)
                            .collect(Collectors.toList()
                            ),
                    page,
                    limit,
                    field,
                    typeSort
            );
            if (users.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found Users with roles = " + roleIds,
                        users
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get Users with roles = " + roleIds + " Success",
                        users
                );
            }
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't get Users with roles = " + roleIds,
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
            @RequestBody User user
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Update user with id: " + id,
                    userService.updateUser(id, user)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't update user with id = " + id + "\n" + exception.getMessage(),
                    new User()
            );
        }
    }

    @PutMapping("/users/{id}/reset_password")
    public ResponseObject<User> resetPassword(
            @PathVariable Long id
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Reset password to user with id: " + id + " success",
                    userService.resetUserPassword(id)
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
//    @PostMapping("/users/{id}/update")
//    public ResponseObject<User> updateUser(@PathVariable Long id, @RequestParam("user") String user) {
//        try {
//            return new ResponseObject<>(
//                    "ok",
//                    "Update user with id: " + id,
//                    userService.updateUser(id, MyObjectMapper.readValue(user, User.class))
//            );
//        } catch (Exception exception) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Can't update user with id = " + id + "\n" + exception.getMessage(),
//                    null
//            );
//        }
//    }

    //user
    @PutMapping("/users/{id}/update_email")
    public ResponseObject<User> updateEmailToUser(
            @PathVariable Long id,
            @RequestBody String email
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Update user email with id: " + id,
                    userService.updateEmailToUser(id, email)
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
    @PutMapping("/users/{id}/update_password")
    public ResponseObject<User> updatePasswordToUser(
            @PathVariable Long id,
            @RequestBody List<String> listPassword
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Update user email with id: " + id,
                    userService.updatePasswordToUser(id, listPassword.get(0), listPassword.get(1), listPassword.get(2))
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't update user password with id = " + id + "\n" + exception.getMessage(),
                    new User()
            );
        }
    }

//    @PostMapping("/users/{id}/add_role")
//    public ResponseObject<User> addRoleToUser(@PathVariable Long id, @RequestParam("role") String roleName) {
//        try {
//            return new ResponseObject<>(
//                    "ok",
//                    "Update user role with id: " + id,
//                    userService.addRoleToUser(id, roleName)
//            );
//        } catch (Exception exception) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Can't update user role with id = " + id + "\n" + exception.getMessage(),
//                    null
//            );
//        }
//    }

    @PutMapping("/users/{id}/change_status")
    public ResponseObject<User> changStatusUser(
            @PathVariable Long id
    ) {
        try {
            return new ResponseObject<>(
                    "ok",
                    "Change Status user with id = " + id + " successfully",
                    userService.changeStatusUser(id)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot change status User with id = " + id + "===" + exception.getMessage(),
                    new User()
            );
        }
    }

//    @PostMapping("/users/{id}/delete")
//    public ResponseObject<User> deleteUser(@PathVariable Long id) {
//        try {
//            return new ResponseObject<>(
//                    "ok",
//                    "Delete user with id = " + id + " successfully",
//                    userService.deleteUser(id)
//            );
//        } catch (Exception exception) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Cannot find User with id = " + id + " to delete\n" + exception.getMessage(),
//                    null
//            );
//        }
//    }
//
//    @PostMapping("/users/delete_all")
//    public ResponseObject<Boolean> deleteAllUsers(@PathVariable Long id) {
//        if (userService.deleteAllUsersExceptAdmin()) {
//            return new ResponseObject<>(
//                    "ok",
//                    "Delete all song successfully",
//                    Boolean.TRUE
//            );
//        } else {
//            return new ResponseObject<>(
//                    "failed",
//                    "Can't delete all songs",
//                    Boolean.TRUE
//            );
//        }
//    }

    @GetMapping("/roles")
    public ResponseObject<List<Role>> getAllRoles() {
        try {
            List<Role> roles = userService.findAllRoles();
            if (roles.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found Roles",
                        roles
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get All Roles Success",
                        roles
                );
            }
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't get all Roles",
                    new ArrayList<>()
            );
        }
    }

    @GetMapping("/roles/load_roles_by_list_role_id")
    public ResponseObject<List<Role>> getRolesByListRoleId(
            @RequestParam("role_ids") String roleIds
    ) {
        try {
            List<Role> roles = userService.findRolesByListRoleId(
                    Arrays.stream(roleIds.split("-"))
                            .map(Long::parseLong)
                            .collect(Collectors.toList()
                            ));
            if (roles.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found Roles with id in listRoleId = " + roleIds,
                        roles
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get All Roles Success",
                        roles
                );
            }
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't get Roles with id in listRoleId = " + roleIds,
                    new ArrayList<>()
            );
        }
    }

//    @PostMapping("/roles/{id}/update")
//    public ResponseObject<Role> updateRole(@PathVariable Long id, @RequestParam("role") String role) {
//        try {
//            return new ResponseObject<>(
//                    "ok",
//                    "Update role with id: " + id,
//                    userService.updateRole(id, MyObjectMapper.readValue(role, Role.class))
//            );
//        } catch (Exception exception) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Can't update role with id = " + id + "\n" + exception.getMessage(),
//                    null
//            );
//        }
//    }
//
//    @PostMapping("/roles/{id}/delete")
//    public ResponseObject<Role> deleteRole(@PathVariable Long id) {
//        try {
//            return new ResponseObject<>(
//                    "ok",
//                    "Delete Role with id = " + id + " successfully",
//                    userService.deleteRole(id)
//            );
//        } catch (Exception exception) {
//            return new ResponseObject<>(
//                    "failed",
//                    "Cannot find Role with id = " + id + " to delete\n" + exception.getMessage(),
//                    null
//            );
//        }
//    }
//
//    @PostMapping("/roles/delete_all")
//    public ResponseObject<Boolean> deleteAllRoles() {
//        if (userService.deleteAllRolesExceptAdmin()) {
//            return new ResponseObject<>(
//                    "ok",
//                    "Delete all song successfully",
//                    Boolean.TRUE
//            );
//        } else {
//            return new ResponseObject<>(
//                    "failed",
//                    "Can't delete all songs",
//                    Boolean.TRUE
//            );
//        }
//    }
}
