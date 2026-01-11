package com.agrisupervision.supervision.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class AlertProducer {

    private final KafkaTemplate<String, AlertEvent> kafkaTemplate;
    private final String topic;

    public AlertProducer(KafkaTemplate<String, AlertEvent> kafkaTemplate,
                         @Value("${supervision.alerts.topic:alerts-topic}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public void publish(AlertEvent event) {
        kafkaTemplate.send(topic, event.getParcelleId() != null ? event.getParcelleId().toString() : null, event);
    }
}
