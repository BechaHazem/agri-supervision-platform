package com.agrisupervision.supervision.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "donnees_meteo")
public class DonneeMeteo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long parcelleId;

    private Double temperature;

    private Double humiditeAir;

    private Double pluviometrie;

    @Column(nullable = false)
    private Instant date;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParcelleId() {
        return parcelleId;
    }

    public void setParcelleId(Long parcelleId) {
        this.parcelleId = parcelleId;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumiditeAir() {
        return humiditeAir;
    }

    public void setHumiditeAir(Double humiditeAir) {
        this.humiditeAir = humiditeAir;
    }

    public Double getPluviometrie() {
        return pluviometrie;
    }

    public void setPluviometrie(Double pluviometrie) {
        this.pluviometrie = pluviometrie;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }
}
