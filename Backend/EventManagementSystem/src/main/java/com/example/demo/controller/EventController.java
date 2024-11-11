package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Event;
import com.example.demo.entity.Registration;
import com.example.demo.entity.User;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.RegistrationRepository;
import com.example.demo.repository.TicketRepository;
import com.example.demo.service.EventService;
import com.example.demo.service.UserService;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class EventController {

    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private PaymentRepository paymentRepository;


    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
    	
    	
    	System.out.println("Incoming event data: " + event); // Log the event data
        // Get the organizer from the request
        User organizer = event.getOrganizer();
        
        // Validate that the organizer is provided in the request
        if (organizer == null || organizer.getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Check if the organizer exists in the database
        User existingOrganizer = userService.getAllUsers().stream()
                .filter(user -> user.getId().equals(organizer.getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found"));

        // Set the existing user as the organizer for the event
        event.setOrganizer(existingOrganizer);
        
        // Create the event using the event service, passing the event and organizer ID
        Event createdEvent = eventService.createEvent(event, organizer.getId());
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }
    
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable Long organizerId) {
        List<Event> events = eventService.findEventsByOrganizerId(organizerId);
        return ResponseEntity.ok(events);
    }



    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        if (event != null) {
            return new ResponseEntity<>(event, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        Event event = eventService.updateEvent(id, updatedEvent);
        if (event != null) {
            return new ResponseEntity<>(event, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @Transactional
    @DeleteMapping("/{eventId}/cascade")
    public ResponseEntity<String> deleteEventWithAssociations(@PathVariable Long eventId) {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        if (!eventOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // First, delete associated tickets
        ticketRepository.deleteByEventId(eventId);

        // Next, delete associated feedback
        feedbackRepository.deleteByEventId(eventId);

        // Then, delete associated registrations and payments
        List<Registration> registrations = registrationRepository.findByEventId(eventId);
        for (Registration registration : registrations) {
            paymentRepository.deleteByRegistrationId(registration.getId());
            registrationRepository.delete(registration);
        }

        // Finally, delete the event itself
        eventRepository.deleteById(eventId);

        return ResponseEntity.ok("Event and associated records deleted successfully.");
    }

}
