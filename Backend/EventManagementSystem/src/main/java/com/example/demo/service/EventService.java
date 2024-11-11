package com.example.demo.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Event;
import com.example.demo.entity.User;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;

    
    public Event createEvent(Event event, Long organizerId) {
        User organizer = userRepository.findById(organizerId)
            .orElseThrow(() -> new RuntimeException("Organizer not found"));
        event.setOrganizer(organizer);
        return eventRepository.save(event);
    }


    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        Optional<Event> existingEvent = eventRepository.findById(id);
        if (existingEvent.isPresent()) {
            Event eventToUpdate = existingEvent.get();
            
            // Update the properties of the event
            eventToUpdate.setTitle(updatedEvent.getTitle());
            eventToUpdate.setDescription(updatedEvent.getDescription());
            eventToUpdate.setDate(updatedEvent.getDate());
            eventToUpdate.setTime(updatedEvent.getTime());
            eventToUpdate.setLocation(updatedEvent.getLocation());
            eventToUpdate.setTicketPrice(updatedEvent.getTicketPrice());
            eventToUpdate.setImageUrl(updatedEvent.getImageUrl());

            // Set the organizer
            if (updatedEvent.getOrganizer() != null && updatedEvent.getOrganizer().getId() != null) {
                User organizer = userRepository.findById(updatedEvent.getOrganizer().getId())
                        .orElseThrow(() -> new RuntimeException("Organizer not found"));
                eventToUpdate.setOrganizer(organizer);
            } else {
                throw new IllegalArgumentException("Organizer is required");
            }

            return eventRepository.save(eventToUpdate);
        } else {
            return null;
        }
    }


    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
    
    //-----------------------------
    public List<Event> findEventsByOrganizerId(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }
}

