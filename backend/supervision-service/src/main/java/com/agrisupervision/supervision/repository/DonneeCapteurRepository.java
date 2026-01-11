package com.agrisupervision.supervision.repository;

import com.agrisupervision.supervision.domain.DonneeCapteur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonneeCapteurRepository extends JpaRepository<DonneeCapteur, Long> {
}
