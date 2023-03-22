package com.dev.music_manager_backend.repositories;

import com.dev.music_manager_backend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

    @Query(value = """
            DELETE FROM musicmanager.roles WHERE name != 'ROLE_ADMIN'
            """, nativeQuery = true)
    void deleteAllRolesExceptAdmin();

    @Query(value = """
            SELECT * FROM musicmanager.roles WHERE id IN :listRoleId
            """, nativeQuery = true)
    List<Role> findRolesByListRoleId(@Param("listRoleId") List<Long> listRoleId);
}