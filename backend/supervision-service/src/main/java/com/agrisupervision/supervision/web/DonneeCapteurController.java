package com.agrisupervision.supervision.web;

import com.agrisupervision.supervision.domain.DonneeCapteur;
import com.agrisupervision.supervision.service.SupervisionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supervision/capteurs")
public class DonneeCapteurController {

    private final SupervisionService supervisionService;

    public DonneeCapteurController(SupervisionService supervisionService) {
        this.supervisionService = supervisionService;
    }

    @GetMapping
    public List<DonneeCapteur> list() {
        return supervisionService.listCapteurs();
    }

    @GetMapping("/{id}")
    public DonneeCapteur get(@PathVariable Long id) {
        return supervisionService.getCapteur(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DonneeCapteur create(@RequestBody DonneeCapteur donneeCapteur) {
        return supervisionService.createCapteur(donneeCapteur);
    }

    @PutMapping("/{id}")
    public DonneeCapteur update(@PathVariable Long id, @RequestBody DonneeCapteur donneeCapteur) {
        return supervisionService.updateCapteur(id, donneeCapteur);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        supervisionService.deleteCapteur(id);
    }
}
