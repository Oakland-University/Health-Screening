package edu.oakland.healthscreening.controller;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.HealthInfo;

import java.util.List;

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
    // TODO set account type based on bearer token presence

    if (info.shouldStayHome()) {
      // email GHC
    }
    postgres.saveHealthInfo(info);
  }

  @GetMapping("health-info")
  public List<HealthInfo> getHealthInfo() {
    return postgres.getHealthInfo();
  }
}
