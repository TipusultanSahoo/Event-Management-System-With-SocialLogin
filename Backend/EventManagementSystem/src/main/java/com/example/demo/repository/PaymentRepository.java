package com.example.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Payment;


public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Additional query methods can be defined here if needed
	
	
	@Modifying
	@Query("DELETE FROM Payment p WHERE p.registration.id = :registrationId")
	void deleteByRegistrationId(@Param("registrationId") Long registrationId);

}

