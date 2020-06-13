package edu.oakland.healthscreening.dao;

import static edu.oakland.healthscreening.dao.Constants.GET_ALL_RESPONSES;
import static edu.oakland.healthscreening.dao.Constants.INSERT_HEALTH_INFO;

import edu.oakland.healthscreening.model.HealthInfo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class Postgres {

  @Autowired JdbcTemplate postgresTemplate;

  public void saveHealthInfo(HealthInfo info) {
    postgresTemplate.update(
        INSERT_HEALTH_INFO,
        new Object[] {
          info.getAccountType(),
          info.getPidm(),
          info.getEmail(),
          info.getName(),
          info.getPhone(),
          info.isCoughing(),
          info.isFeverish(),
          info.isExposed()
        });
  }

  public List<HealthInfo> getHealthInfo() {
    return postgresTemplate.query(GET_ALL_RESPONSES, HealthInfo.mapper);
  }
}
