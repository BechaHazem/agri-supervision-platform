package com.agrisupervision.notification.kafka;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, AlertEvent> alertEventConsumerFactory(KafkaProperties kafkaProperties) {
        Map<String, Object> props = new HashMap<>(kafkaProperties.buildConsumerProperties(null));
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        JsonDeserializer<AlertEvent> valueDeserializer = new JsonDeserializer<>(AlertEvent.class);
        valueDeserializer.addTrustedPackages("com.agrisupervision.notification.kafka", "com.agrisupervision.supervision.kafka");

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), valueDeserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AlertEvent> alertEventKafkaListenerContainerFactory(
            ConsumerFactory<String, AlertEvent> alertEventConsumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, AlertEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(alertEventConsumerFactory);
        return factory;
    }
}
