package com.example.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.ForgotPassword;
import com.example.demo.entity.User;
import com.example.demo.repository.ForgotPasswordRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.ForgotPasswordService;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpSession;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    ForgotPasswordService forgotPasswordService;
    

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Set the organizer to null if not provided
        if (user.getOrganizer() == null) {
            user.setOrganizer(null);
        }
        User createdUser = userService.addUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
    
    

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    
    
    // Enable CORS for this specific endpoint
    
    
    @CrossOrigin(origins = "http://127.0.0.1:5500")      // Allow requests from the frontend
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            // Call the service to register the user
            userService.addUser(user);
            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            // Handle any exceptions and return an appropriate response
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    // login
    
    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            User user = userService.authenticateUser(email, password);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Login error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
   // auth find user
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            return ResponseEntity.badRequest().body("User not authenticated");
        }

        // Fetch user details based on email or another unique identifier
        String email = oauth2User.getAttribute("email");
        User existingUser = userService.findByEmail(email);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(existingUser);
        
    }
    
    
    
    // forgot password
    
    
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request, HttpSession session) {
        String email = request.get("email");
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User doesn't exist with this email."));
        }

        // Generate a random 4-6 digit OTP
        Random random = new Random();
        int otp = 1000 + random.nextInt(9000);
        
        
        // Save or update OTP in the database using the ForgotPasswordService
        forgotPasswordService.saveOrUpdateOtp(email, String.valueOf(otp));
        
        
        System.out.println("Generated OTP: " + otp);
        

        // Send the OTP via email (implement email service)
        // emailService.sendOtpEmail(email, otp); // Example service call
        String subject = "Your OTP Code";
        String message = "Your OTP code is: " + otp;
        emailService.sendEmail(email, subject, message);
        
        return ResponseEntity.ok(Map.of("message", "OTP sent to your email."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String inputOtp = request.get("otp");
        System.out.println("Email by user "+ email);
        System.out.println("Otp by user "+ inputOtp);
        
        // Fetch the stored OTP from the database
        Optional<ForgotPassword> optionalForgotPassword = forgotPasswordService.findByEmail(email);
        if (optionalForgotPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP."));
        }

        ForgotPassword forgotPassword = optionalForgotPassword.get();
        if (!forgotPassword.getOtp().equals(inputOtp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP."));
        }

        return ResponseEntity.ok(Map.of("message", "OTP verified."));
    }

    @PostMapping("/set-new-password")
    public ResponseEntity<?> setNewPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        // Validate if the email exists in the ForgotPassword table
        Optional<ForgotPassword> optionalForgotPassword = forgotPasswordService.findByEmail(email);
        if (optionalForgotPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Session expired. Please try again."));
        }

        // Update the password
        userService.updatePassword(email, newPassword);

        // Delete the OTP record after successful password reset
         forgotPasswordService.deleteByEmail(email);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }

}
