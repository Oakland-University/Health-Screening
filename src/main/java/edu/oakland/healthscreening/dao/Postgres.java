package edu.oakland.healthscreening.dao;

import static edu.oakland.healthscreening.dao.Constants.DELETE_OLD_RECORDS;
import static edu.oakland.healthscreening.dao.Constants.GET_ALL_RESPONSES;
import static edu.oakland.healthscreening.dao.Constants.GET_ANALYTICS_BY_TYPE;
import static edu.oakland.healthscreening.dao.Constants.GET_ANONYMOUS_ANALYTIC_INFO;
import static edu.oakland.healthscreening.dao.Constants.GET_GUEST_INFO;
import static edu.oakland.healthscreening.dao.Constants.GET_RECENT_INFO;
import static edu.oakland.healthscreening.dao.Constants.GET_RECENT_PLEDGE;
import static edu.oakland.healthscreening.dao.Constants.GET_SUPERVISOR_EMAIL;
import static edu.oakland.healthscreening.dao.Constants.INSERT_PLEDGE;

import edu.oakland.healthscreening.model.AnalyticInfo;
import edu.oakland.healthscreening.model.HealthInfo;
import edu.oakland.healthscreening.model.Pledge;

import java.sql.Types;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

@Repository
public class Postgres {

  @Autowired JdbcTemplate jdbcTemplate;

  private final Logger log = LoggerFactory.getLogger("health-screening");

  public void saveHealthInfo(final HealthInfo info) {
    final SimpleJdbcCall saveHealthInfoCall =
        new SimpleJdbcCall(jdbcTemplate)
            .withSchemaName("screening")
            .withFunctionName("save_health_info")
            .withoutProcedureColumnMetaDataAccess()
            .declareParameters(
                new SqlParameter("p_account_type", Types.VARCHAR),
                new SqlParameter("p_pidm", Types.VARCHAR),
                new SqlParameter("p_email", Types.VARCHAR),
                new SqlParameter("p_phone", Types.VARCHAR),
                new SqlParameter("p_name", Types.VARCHAR),
                new SqlParameter("p_is_coughing", Types.BOOLEAN),
                new SqlParameter("p_is_feverish", Types.BOOLEAN),
                new SqlParameter("p_is_exposed", Types.BOOLEAN),
                new SqlParameter("p_supervisor_email", Types.VARCHAR),
                new SqlParameter("p_is_short_of_breath", Types.BOOLEAN),
                new SqlParameter("p_has_sore_throat", Types.BOOLEAN),
                new SqlParameter("p_is_congested", Types.BOOLEAN),
                new SqlParameter("p_has_muscle_aches", Types.BOOLEAN),
                new SqlParameter("p_has_lost_taste_smell", Types.BOOLEAN),
                new SqlParameter("p_has_headache", Types.BOOLEAN),
                new SqlParameter("p_has_diarrhea", Types.BOOLEAN),
                new SqlParameter("p_is_nauseous", Types.BOOLEAN),
                new SqlParameter("p_has_tested_positive", Types.BOOLEAN));

    final SqlParameterSource parameterSource =
        new MapSqlParameterSource()
            .addValue("p_account_type", info.getAccountType().toString())
            .addValue("p_pidm", info.getPidm())
            .addValue("p_email", info.getEmail())
            .addValue("p_phone", info.getPhone())
            .addValue("p_name", info.getName())
            .addValue("p_is_coughing", info.isCoughing())
            .addValue("p_is_feverish", info.isFeverish())
            .addValue("p_is_exposed", info.isExposed())
            .addValue("p_supervisor_email", info.getSupervisorEmail())
            .addValue("p_is_short_of_breath", info.isShortOfBreath())
            .addValue("p_has_sore_throat", info.isSoreThroat())
            .addValue("p_is_congested", info.isCongested())
            .addValue("p_has_muscle_aches", info.isMuscleAche())
            .addValue("p_has_lost_taste_smell", info.isLossOfTasteOrSmell())
            .addValue("p_has_headache", info.isHeadache())
            .addValue("p_has_diarrhea", info.isDiarrhea())
            .addValue("p_is_nauseous", info.isNauseous())
            .addValue("p_has_tested_positive", info.isTestedPositive());

    log.debug("Preparing to save health info: {}", info);

    saveHealthInfoCall.executeFunction(null, parameterSource);
  }

  public void savePledge(final Pledge pledge) {
    log.debug("Saving pledge: {}", pledge);
    jdbcTemplate.update(
        INSERT_PLEDGE,
        pledge.getEmail(),
        pledge.isFaceCovering(),
        pledge.isGoodHygiene(),
        pledge.isDistancing());
  }

  public AnalyticInfo getAnalyticInfo(final String interval) {
    log.debug("Getting anonymous analytic info for interval: {}", interval);
    return jdbcTemplate.queryForObject(GET_ANONYMOUS_ANALYTIC_INFO, AnalyticInfo.mapper, interval);
  }

  public List<AnalyticInfo> getAnalyticsByType(final String interval) {
    log.debug("Getting chart data for interval: {}", interval);
    return jdbcTemplate.query(GET_ANALYTICS_BY_TYPE, AnalyticInfo.mapper, interval);
  }

  public List<HealthInfo> getHealthForInterval(final String interval) {
    log.debug("Getting chart data for interval: {}", interval);
    return jdbcTemplate.query(GET_ALL_RESPONSES, HealthInfo.mapper, interval);
  }

  public Optional<HealthInfo> getRecentSubmission(final String pidm, final String email) {
    try {
      final Pledge pledge = jdbcTemplate.queryForObject(GET_RECENT_PLEDGE, Pledge.mapper, email);
      HealthInfo info = new HealthInfo();

      if (pledge.fullAgreement()) {
        info = jdbcTemplate.queryForObject(GET_RECENT_INFO, HealthInfo.mapper, pidm);
      }

      info.setPledge(pledge);

      log.debug("Found recent submission for {} : {}", email, info);

      return Optional.of(info);
    } catch (final EmptyResultDataAccessException e) {
      log.debug("No recent info for: {}", email);
      return Optional.empty();
    } catch (final Exception e) {
      log.error("Unknown DAO error finding record for: {}", email, e);
      return Optional.empty();
    }
  }

  public Optional<HealthInfo> getRecentSubmission(final String pidm) {
    try {
      return Optional.ofNullable(
          jdbcTemplate.queryForObject(GET_RECENT_INFO, HealthInfo.mapper, pidm));
    } catch (final EmptyResultDataAccessException e) {
      log.debug("No recent info for: {}", pidm);
      return Optional.empty();
    }
  }

  public Optional<HealthInfo> getGuestSubmission(
      final String name, final String email, final String phone) {
    try {
      return Optional.ofNullable(
          jdbcTemplate.queryForObject(GET_GUEST_INFO, HealthInfo.mapper, name, email, phone));
    } catch (final EmptyResultDataAccessException e) {
      log.debug("No recent info for: {}", email);
      return Optional.empty();
    }
  }

  public Optional<String> getSupervisorEmail(String email) {
    try {
      return Optional.ofNullable(
          jdbcTemplate.queryForObject(GET_SUPERVISOR_EMAIL, String.class, email));
    } catch (final EmptyResultDataAccessException e) {
      log.debug("No supervisor found for {}", email);
      return Optional.empty();
    }
  }

  public void deleteOldRecords() {
    jdbcTemplate.update(DELETE_OLD_RECORDS);
  }
}
