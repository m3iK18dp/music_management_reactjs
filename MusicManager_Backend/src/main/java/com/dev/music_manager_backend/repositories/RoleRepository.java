package com.dev.music_manager_backend.repositories;

import com.dev.music_manager_backend.models.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

    @Query(value = """
                SELECT r.* FROM roles r WHERE
                       (:id = -1 OR r.id = :id) AND
                       (LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND
                       (:countRoleIds = 0 OR r.id IN :roleIds) AND
                       (:userId = -1 OR r.id IN
                            (
                                    SELECT r.id
                                    FROM roles r
                                    INNER JOIN users_roles ur ON r.id = ur.role_id
                                    INNER JOIN users u ON ur.user_id = u.id
                                    WHERE u.id = :userId
                            )
                       )
            """, countQuery = """
                SELECT COUNT(r.id) FROM roles r WHERE
                       (:id = -1 OR r.id = :id) AND
                       (LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND
                       (:countRoleIds = 0 OR r.id IN :roleIds) AND
                       (:userId = -1 OR r.id IN
                            (
                                    SELECT r.id
                                    FROM roles r
                                    INNER JOIN users_roles ur ON r.id = ur.role_id
                                    INNER JOIN users u ON ur.user_id = u.id
                                    WHERE u.id = :userId
                            )
                       )
            """, nativeQuery = true)
    Page<Role> findRolesWithPaginationAndSort(
            @Param("id") Long id,
            @Param("name") String name,
            @Param("roleIds") List<Long> roleIds,
            @Param("countRoleIds") int countRoleIds,
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Query(value = """
            SELECT r.*
                    FROM roles r
                    WHERE r.id IN :roleIds
            """, nativeQuery = true)
    List<Role> findRolesByListRoleIds(List<Long> roleIds);
//    @Query(value = """
//            DELETE FROM musicmanager.roles WHERE name != 'ROLE_ADMIN'
//            """, nativeQuery = true)
//    void deleteAllRolesExceptAdmin();
//
//    @Query(value = """
//            SELECT * FROM musicmanager.roles WHERE id IN :listRoleId
//            """, nativeQuery = true)
//    List<Role> findRolesByListRoleId(@Param("listRoleId") List<Long> listRoleId);
}