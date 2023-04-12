package com.dev.music_manager_backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "users")
public class User {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(nullable = false, length = 40)
    private String firstName;
    @NotBlank
    @Column(nullable = false, length = 10)
    private String lastName;
    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String email;
    @NotBlank
    @Column(nullable = false)
    @Builder.Default
    private String password = new BCryptPasswordEncoder().encode("Abcd@1234");

    @Column(nullable = false)
    @Builder.Default
    private boolean status = true;

    @Column
    private LocalDateTime lastUpdate = LocalDateTime.now();
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "users_roles",
            joinColumns = {@JoinColumn(name = "USER_ID", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "ROLE_ID", referencedColumnName = "id")})
//    @JsonManagedReference
    private List<Role> roles = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    @JsonBackReference("users-tokens")
    private List<Token> tokens;
    @OneToMany(mappedBy = "owner")
    @JsonIgnoreProperties("owner")
    private List<Song> songs;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        return email.equals(user.email);
    }

    @Override
    public int hashCode() {
        return email.hashCode();
    }
}