package edu.oakland.healthscreening.dao;

import static edu.oakland.healthscreening.dao.Constants.*;

import edu.oakland.healthscreening.model.AnalyticInfo;
import edu.oakland.healthscreening.model.HealthInfo;
import edu.oakland.healthscreening.model.Pledge;

import java.util.List;
import java.util.Optional;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class Postgres {

  @Autowired JdbcTemplate postgresJdbcTemplate;

  private final Logger log = LoggerFactory.getLogger("health-screening");

  @Autowired
  @Qualifier("postgresDataSource")
  public void Postgres(DataSource dataSource) {
    this.postgresJdbcTemplate = new JdbcTemplate(dataSource);
  }

  public void saveHealthInfo(HealthInfo info) {
    postgresJdbcTemplate.update(
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
    postgresJdbcTemplate.update(
        INSERT_ANALYTICS,
        info.getAccountType().toString(),
        info.isCoughing(),
        info.isFeverish(),
        info.isExposed());
  }

  public void savePledge(Pledge pledge) {
    postgresJdbcTemplate.update(
        INSERT_PLEDGE,
        pledge.getEmail(),
        pledge.isFaceCovering(),
        pledge.isGoodHygiene(),
        pledge.isDistancing());
  }

  public AnalyticInfo getAnalyticInfo(String interval) {
    return postgresJdbcTemplate.queryForObject(GET_ANALYTIC_INFO, AnalyticInfo.mapper, interval);
  }

  public List<HealthInfo> getHealthInfo() {
    return postgresJdbcTemplate.query(GET_ALL_RESPONSES, HealthInfo.mapper);
  }

  public Optional<HealthInfo> getRecentSubmission(String pidm, String email) {
    try {
      Pledge pledge = postgresJdbcTemplate.queryForObject(GET_RECENT_PLEDGE, Pledge.mapper, email);
      HealthInfo info = new HealthInfo();

      if (pledge.fullAgreement()) {
        info = postgresJdbcTemplate.queryForObject(GET_RECENT_INFO, HealthInfo.mapper, pidm);
      }

      info.setPledge(pledge);

      return Optional.of(info);
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public Optional<HealthInfo> getRecentSubmission(String pidm) {
    try {
      return Optional.of(
          postgresJdbcTemplate.queryForObject(GET_RECENT_INFO, HealthInfo.mapper, pidm));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public Optional<HealthInfo> getGuestSubmission(String name, String email, String phone) {
    try {
      return Optional.of(
          postgresJdbcTemplate.queryForObject(
              GET_GUEST_INFO, HealthInfo.mapper, name, email, phone));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public void deleteOldRecords() {
    postgresJdbcTemplate.update(DELETE_OLD_RECORDS);
  }
}
