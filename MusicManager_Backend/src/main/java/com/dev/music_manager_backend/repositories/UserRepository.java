package com.dev.music_manager_backend.repositories;


import com.dev.music_manager_backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    //    @Query(value = """
//            DELETE FROM musicmanager.users_roles WHERE user_id = :id;
//            DELETE FROM musicmanager.users WHERE id = :id;
//            """, nativeQuery = true)
//    void deleteById(Long id);
//
//    @Query(value = """
//            DELETE FROM musicmanager.users_roles WHERE user_id = (
//                SELECT user_id FROM musicmanager.users WHERE email != 'admin@gmail.com'
//            );
//            DELETE FROM musicmanager.users WHERE email != 'admin@gmail.com';
//            """, nativeQuery = true)
//    void deleteAllUsersExceptAdmin();
    @Query(value = """
                SELECT u.* FROM users u WHERE
                       (:id = -1 OR u.id = :id) AND
                       (SUBSTRING_INDEX(LOWER(u.email),'@', 1) LIKE LOWER(CONCAT('%', :email, '%'))) AND
                       (CONCAT(LOWER(u.firstName),' ',LOWER(u.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))) AND
                       (:countRoleIds = 0 OR u.id IN
                            (
                                    SELECT u.id
                                    FROM users u
                                    INNER JOIN users_roles ur ON u.id = ur.user_id
                                    INNER JOIN roles r ON ur.role_id = r.id
                                    WHERE r.id IN :roleIds
                                    GROUP BY u.id
                                    HAVING COUNT(DISTINCT r.id) = :countRoleIds
                            )
                       )
            """, countQuery = """
                SELECT COUNT(u.id) FROM users u WHERE
                       (SUBSTRING_INDEX(LOWER(u.email),'@', 1) LIKE LOWER(CONCAT('%', :email, '%'))) AND
                       (CONCAT(LOWER(u.firstName),' ',LOWER(u.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))) AND
                       (:countRoleIds = 0 OR u.id IN
                            (
                                    SELECT u.id
                                    FROM users u
                                    INNER JOIN users_roles ur ON u.id = ur.user_id
                                    INNER JOIN roles r ON ur.role_id = r.id
                                    WHERE r.id IN :roleIds
                                    GROUP BY u.id
                                    HAVING COUNT(DISTINCT r.id) = :countRoleIds
                            )
                       )
            """, nativeQuery = true)
    Page<User> findUsersWithPaginationAndSort(
            @Param("id") Long id,
            @Param("email") String email,
            @Param("name") String name,
            @Param("roleIds") List<Long> roleIds,
            @Param("countRoleIds") int countRoleIds,
            Pageable pageable
    );

//    @Query(value = """
//            SELECT u.* FROM musicmanager.users u, musicmanager.roles r, musicmanager.users_roles ur
//            WHERE u.id=ur.USER_ID AND r.id=ur.ROLE_ID AND r.id= :roleId
//            """, nativeQuery = true)
//    Page<User> findUsersByRoleName(int roleId, Pageable pageable);


    @Query(value = """
            SELECT u.*
            FROM users u
            INNER JOIN users_roles ur ON u.id = ur.user_id
            INNER JOIN roles r ON ur.role_id = r.id
            WHERE r.id IN :roleIds
            GROUP BY u.id
            HAVING COUNT(DISTINCT r.id) = :countRoleNames
            """, nativeQuery = true)
    Page<User> findUsersByRoles(@Param("roleIds") List<Long> roleIds, @Param("countRoleNames") int countRoleNames, Pageable pageable);


}