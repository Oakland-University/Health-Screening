package edu.oakland.healthscreening.dao;

import static edu.oakland.healthscreening.dao.Constants.*;

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
        info.getAccountType().toString(),
        info.getPidm(),
        info.getEmail(),
        info.getName(),
        info.getPhone(),
        info.isCoughing(),
        info.isFeverish(),
        info.isExposed());
  }

  public void saveAnalyticInfo(HealthInfo info) {
    postgresTemplate.update(
        INSERT_ANALYTICS,
        info.getAccountType().toString(),
        info.isCoughing(),
        info.isFeverish(),
        info.isExposed());
  }

  public List<HealthInfo> getHealthInfo() {
    return postgresTemplate.query(GET_ALL_RESPONSES, HealthInfo.mapper);
  }

  public HealthInfo getRecentSubmission(String pidm) {
    return postgresTemplate.queryForObject(GET_RECENT_INFO, HealthInfo.mapper);
  }

  public void deleteOldRecords() {
    postgresTemplate.update(DELETE_OLD_RECORDS);
  }
}
