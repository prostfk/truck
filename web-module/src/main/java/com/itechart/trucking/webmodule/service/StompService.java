package com.itechart.trucking.webmodule.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class StompService {
    private static final Logger LOGGER = LoggerFactory.getLogger(StompService.class);

    @Autowired
    private SimpMessagingTemplate template;

    private ObjectMapper mapper = new ObjectMapper();

    public void sendNotification(String topic, Object object) {
        try {
            template.convertAndSend(topic, mapper.writeValueAsString(object));
        } catch (JsonProcessingException e) {
            LOGGER.error("Can not parse object", e);
        }
    }
}
