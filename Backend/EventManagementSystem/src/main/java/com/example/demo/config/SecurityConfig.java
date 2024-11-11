package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                .requestMatchers("/", "/login", "/oauth2/**", "/api/users/login", "/api/events","/api/feedback","/api/users/register","/loginSuccess","/api/users/**","/api/events/**","/api/payments","/api/registrations","/api/tickets").permitAll()  // Allow access to /api/events
                .anyRequest().authenticated()
            )
             .oauth2Login(oauth2Login -> oauth2Login
            		.successHandler((request, response, authentication) -> {
            			System.out.println("successHandler is running*******");
            		    response.sendRedirect("/loginSuccess");
            		})
            	);
        http
      .sessionManagement(sessionManagement ->
          sessionManagement.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
      );


        
//        09/ nov/2024-for forget psw session

//        http
//        .sessionManagement()
//        .sessionCreationPolicy(SessionCreationPolicy.ALWAYS);
//        http
//        .sessionManagement()
//        .sessionFixation().none();
        
        return http.build();
        
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://127.0.0.1:5500");
        config.addAllowedOrigin("http://localhost:5500");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
