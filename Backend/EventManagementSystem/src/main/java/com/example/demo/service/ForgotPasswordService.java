package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.ForgotPassword;
import com.example.demo.repository.ForgotPasswordRepository;

import jakarta.transaction.Transactional;

@Service
public class ForgotPasswordService {

    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;

    public void saveOrUpdateOtp(String email, String otp) {
        ForgotPassword forgotPassword = forgotPasswordRepository.findByEmail(email)
                .orElse(new ForgotPassword());
        forgotPassword.setEmail(email);
        forgotPassword.setOtp(otp);
        forgotPasswordRepository.save(forgotPassword);
    }

    
    public Optional<ForgotPassword> findByEmail(String email) {
        return forgotPasswordRepository.findByEmail(email);
    }
     
    
    @Transactional // This ensures a transaction is opened when this method is called
    public void deleteByEmail(String email) {
        forgotPasswordRepository.deleteByEmail(email);
       
    }
}

