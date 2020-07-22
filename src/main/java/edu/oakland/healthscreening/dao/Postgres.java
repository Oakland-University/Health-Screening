package edu.oakland.healthscreening.dao;

import static edu.oakland.healthscreening.dao.Constants.*;

import edu.oakland.healthscreening.model.AnalyticInfo;
import edu.oakland.healthscreening.model.HealthInfo;
import edu.oakland.healthscreening.model.Pledge;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class Postgres {

  @Autowired JdbcTemplate postgresTemplate;
  private final Logger log = LoggerFactory.getLogger("health-screening");

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

  public void savePledge(Pledge pledge) {
    postgresTemplate.update(
        INSERT_PLEDGE,
        pledge.getEmail(),
        pledge.isHasFaceCovering(),
        pledge.isHasGoodHygiene(),
        pledge.isDistancing());
  }

  public AnalyticInfo getAnalyticInfo(String interval) {
    return postgresTemplate.queryForObject(GET_ANALYTIC_INFO, AnalyticInfo.mapper, interval);
  }

  public List<HealthInfo> getHealthInfo() {
    return postgresTemplate.query(GET_ALL_RESPONSES, HealthInfo.mapper);
  }

  public Optional<HealthInfo> getRecentSubmission(String pidm) {
    try {
      return Optional.of(postgresTemplate.queryForObject(GET_RECENT_INFO, HealthInfo.mapper, pidm));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public Optional<HealthInfo> getGuestSubmission(String name, String email, String phone) {
    try {
      return Optional.of(
          postgresTemplate.queryForObject(GET_GUEST_INFO, HealthInfo.mapper, name, email, phone));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public void deleteOldRecords() {
    postgresTemplate.update(DELETE_OLD_RECORDS);
  }
}
