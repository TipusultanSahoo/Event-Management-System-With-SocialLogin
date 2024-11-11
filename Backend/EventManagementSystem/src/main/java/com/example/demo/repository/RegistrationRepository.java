package com.example.demo.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Registration;


public interface RegistrationRepository extends JpaRepository<Registration, Long> {
  
	// Query to find registrations for events created by the specified organizer
    @Query("SELECT r FROM Registration r WHERE r.event.organizer.id = :organizerId")
    List<Registration> findByEventOrganizerId(@Param("organizerId") Long organizerId);
    
    List<Registration> findByEventId(Long eventId);
}
