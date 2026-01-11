package com.agrisupervision.notification.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class AlertListener {

    private static final Logger log = LoggerFactory.getLogger(AlertListener.class);

    @KafkaListener(
            topics = "${notification.alerts.topic:alerts-topic}",
            groupId = "${spring.kafka.consumer.group-id:notification-service}",
            containerFactory = "alertEventKafkaListenerContainerFactory"
    )
    public void onAlert(AlertEvent event) {
        if (event == null) {
            return;
        }
        log.info("Received alert: kind={}, parcelleId={}, timestamp={}, message={}",
                event.getKind(), event.getParcelleId(), event.getTimestamp(), event.getMessage());
    }
}
