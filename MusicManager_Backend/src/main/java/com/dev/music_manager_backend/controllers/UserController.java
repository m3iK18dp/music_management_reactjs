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
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class UserController {
    private final IUserService userService;

    //admin
    @GetMapping("/users/get_all")
    public ResponseObject<Page<User>> getAllUsers(
            @RequestParam("_page") int page,
            @RequestParam("_limit") int limit,
            @RequestParam("_field") String field
    ) {
        Page<User> users = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            users = userService.findAllUsers(page, limit, field);
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
    public ResponseObject<User> getUserById(
            @PathVariable Long id
    ) {
        try {
            return userService.findUserById(id).map(user ->
                    new ResponseObject<>(
                            "ok",
                            "Get user successfully",
                            user
                    )
            ).orElseGet(() ->
                    new ResponseObject<>(
                            "failed",
                            "Not found user with id = " + id,
                            new User()
                    )
            );
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get user with id = " + id + "\n" + e.getMessage(),
                    new User()
            );
        }
    }

    //admin //user
    @GetMapping("/users/get_by_email")
    public ResponseObject<User> getUserByEmail(
            @RequestParam("_email") String email
    ) {
        try {
            return userService.findUserByEmail(email).map(user ->
                    new ResponseObject<>(
                            "ok",
                            "Get user successfully",
                            user
                    )
            ).orElseGet(() ->
                    new ResponseObject<>(
                            "failed",
                            "Not found user with email = " + email,
                            new User()
                    )
            );
        } catch (Exception e) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot get user with email = " + email + "\n" + e.getMessage(),
                    new User()
            );
        }
    }

    //admin
    @GetMapping("/users/get_by_role_id")
    public ResponseObject<Page<User>> getUsersByRoleId(
            @RequestParam("_role_id") int roleId,
            @RequestParam("_page") int page,
            @RequestParam("_limit") int limit,
            @RequestParam("_field") String field
    ) {
        Page<User> users = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            users = userService.findUsersByRoleId(roleId, page, limit, field);
            if (users.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found Users with role = " + roleId,
                        users
                );
            } else {
                return new ResponseObject<>(
                        "ok",
                        "Get Users with role = " + roleId + " Success",
                        users
                );
            }
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Can't get Users with role = " + roleId + " " + exception.getMessage(),
                    users
            );
        }
    }

    //admin
    @GetMapping("/users/get_by_role_ids")
    public ResponseObject<Page<User>> getUsersByRoleIds(
            @RequestParam("_role_ids") List<Integer> roleIds,
            @RequestParam("_page") int page,
            @RequestParam("_limit") int limit,
            @RequestParam("_field") String field
    ) {
        Page<User> users = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        try {
            users = userService.findUsersByRoleIds(roleIds, page, limit, field);
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

    @PostMapping("/users/new")
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
    @PutMapping("/users/{id}/update")
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
                    "Enable user with id = " + id + " successfully",
                    userService.changeStatusUser(id)
            );
        } catch (Exception exception) {
            return new ResponseObject<>(
                    "failed",
                    "Cannot change status User with id = " + id + " to delete\n" + exception.getMessage(),
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
            @RequestBody List<Long> listRoleId
    ) {
        try {
            List<Role> roles = userService.findRolesByListRoleId(listRoleId);
            if (roles.isEmpty()) {
                return new ResponseObject<>(
                        "failed",
                        "Not found Roles with id in listRoleId = " + listRoleId,
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
                    "Can't get Roles with id in listRoleId = " + listRoleId,
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
