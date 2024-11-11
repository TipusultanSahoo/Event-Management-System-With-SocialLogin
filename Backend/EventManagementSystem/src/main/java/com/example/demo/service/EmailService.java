package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        // Create a SimpleMailMessage
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to); // Set recipient email address
        message.setSubject(subject); // Set email subject
        message.setText(text); // Set email body content

        // Send the email
        mailSender.send(message);
    }
}
