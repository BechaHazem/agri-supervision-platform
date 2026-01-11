package com.agrisupervision.supervision.service;

import com.agrisupervision.supervision.client.ExploitationsClient;
import com.agrisupervision.supervision.client.ParcelleDto;
import com.agrisupervision.supervision.domain.DonneeCapteur;
import com.agrisupervision.supervision.domain.DonneeMeteo;
import com.agrisupervision.supervision.kafka.AlertEvent;
import com.agrisupervision.supervision.kafka.AlertProducer;
import com.agrisupervision.supervision.repository.DonneeCapteurRepository;
import com.agrisupervision.supervision.repository.DonneeMeteoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class SupervisionService {

    private final DonneeCapteurRepository donneeCapteurRepository;
    private final DonneeMeteoRepository donneeMeteoRepository;
    private final ExploitationsClient exploitationsClient;
    private final AlertProducer alertProducer;

    private final double sensorThreshold;
    private final double temperatureMax;
    private final double humiditeMax;
    private final double pluviometrieMax;

    public SupervisionService(DonneeCapteurRepository donneeCapteurRepository,
                              DonneeMeteoRepository donneeMeteoRepository,
                              ExploitationsClient exploitationsClient,
                              AlertProducer alertProducer,
                              @Value("${supervision.thresholds.sensor:100}") double sensorThreshold,
                              @Value("${supervision.thresholds.temperature-max:45}") double temperatureMax,
                              @Value("${supervision.thresholds.humidite-max:95}") double humiditeMax,
                              @Value("${supervision.thresholds.pluviometrie-max:200}") double pluviometrieMax) {
        this.donneeCapteurRepository = donneeCapteurRepository;
        this.donneeMeteoRepository = donneeMeteoRepository;
        this.exploitationsClient = exploitationsClient;
        this.alertProducer = alertProducer;
        this.sensorThreshold = sensorThreshold;
        this.temperatureMax = temperatureMax;
        this.humiditeMax = humiditeMax;
        this.pluviometrieMax = pluviometrieMax;
    }

    public List<DonneeCapteur> listCapteurs() {
        return donneeCapteurRepository.findAll();
    }

    public DonneeCapteur getCapteur(Long id) {
        return donneeCapteurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DonneeCapteur", id));
    }

    public DonneeCapteur createCapteur(DonneeCapteur donnee) {
        donnee.setId(null);
        if (donnee.getDate() == null) {
            donnee.setDate(Instant.now());
        }
        DonneeCapteur saved = donneeCapteurRepository.save(donnee);
        detectAndAlert(saved);
        return saved;
    }

    public DonneeCapteur updateCapteur(Long id, DonneeCapteur updates) {
        DonneeCapteur existing = getCapteur(id);
        existing.setParcelleId(updates.getParcelleId());
        existing.setType(updates.getType());
        existing.setValeur(updates.getValeur());
        existing.setDate(updates.getDate() != null ? updates.getDate() : existing.getDate());
        DonneeCapteur saved = donneeCapteurRepository.save(existing);
        detectAndAlert(saved);
        return saved;
    }

    public void deleteCapteur(Long id) {
        if (!donneeCapteurRepository.existsById(id)) {
            throw new ResourceNotFoundException("DonneeCapteur", id);
        }
        donneeCapteurRepository.deleteById(id);
    }

    public List<DonneeMeteo> listMeteo() {
        return donneeMeteoRepository.findAll();
    }

    public DonneeMeteo getMeteo(Long id) {
        return donneeMeteoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DonneeMeteo", id));
    }

    public DonneeMeteo createMeteo(DonneeMeteo donnee) {
        donnee.setId(null);
        if (donnee.getDate() == null) {
            donnee.setDate(Instant.now());
        }
        DonneeMeteo saved = donneeMeteoRepository.save(donnee);
        detectAndAlert(saved);
        return saved;
    }

    public DonneeMeteo updateMeteo(Long id, DonneeMeteo updates) {
        DonneeMeteo existing = getMeteo(id);
        existing.setParcelleId(updates.getParcelleId());
        existing.setTemperature(updates.getTemperature());
        existing.setHumiditeAir(updates.getHumiditeAir());
        existing.setPluviometrie(updates.getPluviometrie());
        existing.setDate(updates.getDate() != null ? updates.getDate() : existing.getDate());
        DonneeMeteo saved = donneeMeteoRepository.save(existing);
        detectAndAlert(saved);
        return saved;
    }

    public void deleteMeteo(Long id) {
        if (!donneeMeteoRepository.existsById(id)) {
            throw new ResourceNotFoundException("DonneeMeteo", id);
        }
        donneeMeteoRepository.deleteById(id);
    }

    private void detectAndAlert(DonneeCapteur donnee) {
        if (donnee.getValeur() == null) {
            return;
        }
        if (donnee.getValeur() <= sensorThreshold) {
            return;
        }

        String parcelleInfo = tryGetParcelleInfo(donnee.getParcelleId());
        String message = "Sensor anomaly: type=" + donnee.getType() + ", valeur=" + donnee.getValeur()
                + " (threshold=" + sensorThreshold + ")" + parcelleInfo;

        alertProducer.publish(new AlertEvent("SENSOR", donnee.getParcelleId(), message, Instant.now()));
    }

    private void detectAndAlert(DonneeMeteo donnee) {
        boolean anomaly = false;
        StringBuilder details = new StringBuilder();

        if (donnee.getTemperature() != null && donnee.getTemperature() > temperatureMax) {
            anomaly = true;
            details.append(" temperature=").append(donnee.getTemperature()).append("> ").append(temperatureMax);
        }
        if (donnee.getHumiditeAir() != null && donnee.getHumiditeAir() > humiditeMax) {
            anomaly = true;
            details.append(" humiditeAir=").append(donnee.getHumiditeAir()).append("> ").append(humiditeMax);
        }
        if (donnee.getPluviometrie() != null && donnee.getPluviometrie() > pluviometrieMax) {
            anomaly = true;
            details.append(" pluviometrie=").append(donnee.getPluviometrie()).append("> ").append(pluviometrieMax);
        }

        if (!anomaly) {
            return;
        }

        String parcelleInfo = tryGetParcelleInfo(donnee.getParcelleId());
        String message = "Weather anomaly:" + details + parcelleInfo;

        alertProducer.publish(new AlertEvent("WEATHER", donnee.getParcelleId(), message, Instant.now()));
    }

    private String tryGetParcelleInfo(Long parcelleId) {
        if (parcelleId == null) {
            return "";
        }
        try {
            ParcelleDto parcelle = exploitationsClient.getParcelleById(parcelleId);
            if (parcelle == null) {
                return "";
            }
            return " | parcelle(culture=" + parcelle.getCulture() + ", etat=" + parcelle.getEtat() + ")";
        } catch (Exception ignored) {
            return "";
        }
    }
}
