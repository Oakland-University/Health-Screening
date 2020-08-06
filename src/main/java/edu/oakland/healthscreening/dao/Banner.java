package edu.oakland.healthscreening.dao;

import static edu.oakland.healthscreening.dao.Constants.GET_BANNER_SUPERVISOR;

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
public class Banner {

  @Autowired private JdbcTemplate bannerJdbcTemplate;

  private final Logger log = LoggerFactory.getLogger("health-screening");

  @Autowired
  @Qualifier("bannerDataSource")
  public void Banner(DataSource dataSource) {
    this.bannerJdbcTemplate = new JdbcTemplate(dataSource);
  }

  public Optional<String> getSupervisorEmail(String pidm) {
    try {
      return Optional.of(
          bannerJdbcTemplate.queryForObject(GET_BANNER_SUPERVISOR, String.class, pidm));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }
}
