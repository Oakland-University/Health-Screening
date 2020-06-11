package edu.oakland.healthscreening.controller;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.HealthInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthScreeningController {
  @Autowired private Postgres postgres;

  @PostMapping("health-info")
  public void saveHealthInfo(@RequestBody HealthInfo info) {
    postgres.saveHealthInfo(info);
  }

  @GetMapping("health-info")
  public void getHealthInfo() {
    // maybe do something here, idk
  }
}
