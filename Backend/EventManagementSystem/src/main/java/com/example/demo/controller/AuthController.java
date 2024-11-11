package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;

@RestController
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/loginSuccess")
    public ResponseEntity<?> handleLoginSuccess(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            return ResponseEntity.badRequest().body("OAuth2User is null");
        }

        // Extract user details from OAuth2User object
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        if (email == null || name == null) {
            return ResponseEntity.badRequest().body("Email or name is missing from OAuth2 response");
        }

        // Check if user already exists in the database
        User existingUser = userService.findByEmail(email);
        if (existingUser == null) {
            // Create a new user
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword("psw"); // Password is not used for Google OAuth users
            System.out.println("***************");
            System.out.println(name);
            System.out.println(email);
            System.out.println("*****************");
            existingUser = userService.addUser(newUser);
        }
           
        // Return the user details to the frontend
        return ResponseEntity.ok(existingUser);
    }

    @GetMapping("/loginFailure")
    public String loginFailure() {
        return "Login failed. Please try again.";
    }
}
