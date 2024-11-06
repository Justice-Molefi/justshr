package com.justice.justshr.config;


import com.justice.justshr.repository.UserRepository;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final UserRepository userRepository;
    @Value("${jwt.secret}")
    private String jwtKey;

    public SecurityConfiguration(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/v1/auth/register", "/api/v1/auth/login", "api/v1/auth/logout").permitAll();
                    auth.anyRequest().authenticated();
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(OAuth2ResourceServerConfigurer -> OAuth2ResourceServerConfigurer.jwt(Customizer.withDefaults()))
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, BCryptPasswordEncoder passwordEncoder){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(daoAuthenticationProvider);
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return email -> userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtDecoder jwtDecoder(){
        byte[] keyBytes = jwtKey.getBytes();
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, 0, keyBytes.length, "HMACSHA256");
        return NimbusJwtDecoder.withSecretKey(keySpec).macAlgorithm(MacAlgorithm.HS256).build();
    }

    @Bean
    public JwtEncoder jwtEncoder(){
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtKey.getBytes()));
    }

    @Bean
    public BearerTokenResolver bearerTokenResolver(){
        return new CustomBearerTokenResolver();
    }
}
