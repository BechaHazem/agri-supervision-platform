package com.agrisupervision.supervision.client;

public class ParcelleDto {

    private Long id;
    private Long exploitationId;
    private String culture;
    private Double surface;
    private String etat;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getExploitationId() {
        return exploitationId;
    }

    public void setExploitationId(Long exploitationId) {
        this.exploitationId = exploitationId;
    }

    public String getCulture() {
        return culture;
    }

    public void setCulture(String culture) {
        this.culture = culture;
    }

    public Double getSurface() {
        return surface;
    }

    public void setSurface(Double surface) {
        this.surface = surface;
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }
}
