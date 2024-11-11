package com.example.demo.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Event;


public interface EventRepository extends JpaRepository<Event, Long> {
    // Additional query methods can be defined here if needed
	
	@Query("SELECT e FROM Event e WHERE e.organizer.id = :organizerId")
	List<Event> findByOrganizerId(@Param("organizerId") Long organizerId);

}