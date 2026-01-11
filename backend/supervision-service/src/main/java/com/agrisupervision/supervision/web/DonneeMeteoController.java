package com.agrisupervision.supervision.web;

import com.agrisupervision.supervision.domain.DonneeMeteo;
import com.agrisupervision.supervision.service.SupervisionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supervision/meteo")
public class DonneeMeteoController {

    private final SupervisionService supervisionService;

    public DonneeMeteoController(SupervisionService supervisionService) {
        this.supervisionService = supervisionService;
    }

    @GetMapping
    public List<DonneeMeteo> list() {
        return supervisionService.listMeteo();
    }

    @GetMapping("/{id}")
    public DonneeMeteo get(@PathVariable Long id) {
        return supervisionService.getMeteo(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DonneeMeteo create(@RequestBody DonneeMeteo donneeMeteo) {
        return supervisionService.createMeteo(donneeMeteo);
    }

    @PutMapping("/{id}")
    public DonneeMeteo update(@PathVariable Long id, @RequestBody DonneeMeteo donneeMeteo) {
        return supervisionService.updateMeteo(id, donneeMeteo);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        supervisionService.deleteMeteo(id);
    }
}
