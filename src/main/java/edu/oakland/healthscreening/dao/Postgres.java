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

  @Autowired JdbcTemplate jdbcTemplate;

  private final Logger log = LoggerFactory.getLogger("health-screening");

  public void saveHealthInfo(final HealthInfo info) {
    jdbcTemplate.update(
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

  public void saveAnalyticInfo(final HealthInfo info) {
    jdbcTemplate.update(
        INSERT_ANALYTICS,
        info.getAccountType().toString(),
        info.isCoughing(),
        info.isFeverish(),
        info.isExposed());
  }

  public void savePledge(final Pledge pledge) {
    jdbcTemplate.update(
        INSERT_PLEDGE,
        pledge.getEmail(),
        pledge.isFaceCovering(),
        pledge.isGoodHygiene(),
        pledge.isDistancing());
  }

  public AnalyticInfo getAnalyticInfo(final String interval) {
    return jdbcTemplate.queryForObject(GET_ANALYTIC_INFO, AnalyticInfo.mapper, interval);
  }

  public List<HealthInfo> getHealthInfo() {
    return jdbcTemplate.query(GET_ALL_RESPONSES, HealthInfo.mapper);
  }

  public Optional<HealthInfo> getRecentSubmission(final String pidm, final String email) {
    try {
      final Pledge pledge = jdbcTemplate.queryForObject(GET_RECENT_PLEDGE, Pledge.mapper, email);
      HealthInfo info = new HealthInfo();

      if (pledge.fullAgreement()) {
        info = jdbcTemplate.queryForObject(GET_RECENT_INFO, HealthInfo.mapper, pidm);
      }

      info.setPledge(pledge);

      return Optional.of(info);
    } catch (final EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public Optional<HealthInfo> getRecentSubmission(final String pidm) {
    try {
      return Optional.of(jdbcTemplate.queryForObject(GET_RECENT_INFO, HealthInfo.mapper, pidm));
    } catch (final EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public Optional<HealthInfo> getGuestSubmission(
      final String name, final String email, final String phone) {
    try {
      return Optional.of(
          jdbcTemplate.queryForObject(GET_GUEST_INFO, HealthInfo.mapper, name, email, phone));
    } catch (final EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public void deleteOldRecords() {
    jdbcTemplate.update(DELETE_OLD_RECORDS);
  }
}
