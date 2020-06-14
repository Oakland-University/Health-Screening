package edu.oakland.healthscreening.dao;

public class Constants {

  public static final String INSERT_HEALTH_INFO =
      (" INSERT INTO screening.health_screening (account_type, pidm, email, name, phone, is_coughing, is_feverish, is_exposed)"
              + " VALUES                                                                                                      "
              + " (CAST(? as account_type), ?, ?, ?, ?, ?, ?, ?)                                                              "
              + "                                                                                                             ")
          .replaceAll("\\s+", " ");

  public static final String GET_ALL_RESPONSES = ("select * from screening.health_screening ");

  public static final String GET_RECENT_INFO =
      ("select * from screening.health_screening where age(submission_time) < INTERVAL '1 day' and pidm = ? order by submission_time desc limit 1");
}
