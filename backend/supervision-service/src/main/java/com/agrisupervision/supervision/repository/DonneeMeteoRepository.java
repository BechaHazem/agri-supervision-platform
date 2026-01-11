package com.agrisupervision.supervision.repository;

import com.agrisupervision.supervision.domain.DonneeMeteo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonneeMeteoRepository extends JpaRepository<DonneeMeteo, Long> {
}
