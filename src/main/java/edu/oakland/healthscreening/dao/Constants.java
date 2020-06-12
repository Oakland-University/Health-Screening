package edu.oakland.healthscreening.dao;

public class Constants {

  public static final String INSERT_HEALTH_INFO =
      (" INSERT INTO screening.health_screening (account_type, pidm, email, phone, is_coughing, is_feverish, is_exposed)  "
          + " VALUES                                                                                             "
          + " (?, ?, ?, ?, ?, ?, ?)                                                                              "
          + "                                                                                                    ");

  public static final String GET_ALL_RESPONSES = ("select * from health_screening ");
}
