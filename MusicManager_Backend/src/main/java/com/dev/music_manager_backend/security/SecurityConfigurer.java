package com.dev.music_manager_backend.security;

import com.dev.music_manager_backend.services.authenticationService.CustomLogoutSuccessHandler;
import com.dev.music_manager_backend.services.authenticationService.CustomUserDetailsService;
import com.dev.music_manager_backend.util.JwtRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfigurer {
    @Autowired
    private final CustomUserDetailsService customUserDetailsService;
    @Autowired
    private final JwtRequestFilter jwtRequestFilter;
    @Autowired
    private final LogoutHandler logoutHandler;
    @Autowired
    private final CustomLogoutSuccessHandler customLogoutSuccessHandler;


    @Bean
    public JwtRequestFilter jwtAuthenticationFilter() {
        return new JwtRequestFilter();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder());
    }

//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer() {
//        return (web) -> web.ignoring()
//                .requestMatchers("/api/**");
//    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests((authorize) ->
                                authorize
                                        .requestMatchers("/api/auth", "/api/auth/**").permitAll()
                                        .requestMatchers(HttpMethod.GET, "/api/songs/**").permitAll()
                                        .requestMatchers(HttpMethod.POST, "/api/songs/**").authenticated()
                                        .requestMatchers(HttpMethod.PUT, "/api/songs/**").hasAnyAuthority("ADMIN")
                                        .requestMatchers(HttpMethod.DELETE, "/api/songs/**").hasAnyAuthority("ADMIN")

//                                .requestMatchers(HttpMethod.GET, "/api/users", "/api/users/**").authenticated()
                                        .requestMatchers(HttpMethod.POST, "/api/users", "/api/users/**").hasAnyAuthority("ADMIN")
                                        .requestMatchers(HttpMethod.DELETE, "/api/users", "/api/users/**").hasAnyAuthority("ADMIN")
//                                .requestMatchers(
//                                        HttpMethod.PUT,
//                                        "/api/users",
//                                        "/users/change_status/**",
//                                        "/users/reset_password/**",
//                                        "/users/update_email/**",
//                                        "/users/update_password/**"
//                                ).authenticated()
                                        .anyRequest().authenticated()
                ).sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .logout()
                .logoutUrl("/api/auth/logout")
                .addLogoutHandler(logoutHandler)
                .logoutSuccessHandler(customLogoutSuccessHandler);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
