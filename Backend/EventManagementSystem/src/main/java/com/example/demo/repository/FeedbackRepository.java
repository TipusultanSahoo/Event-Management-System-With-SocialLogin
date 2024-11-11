package com.example.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Feedback;


public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // Additional query methods can be defined here if needed
	
	@Modifying
	@Query("DELETE FROM Feedback f WHERE f.event.id = :eventId")
	void deleteByEventId(@Param("eventId") Long eventId);

}
