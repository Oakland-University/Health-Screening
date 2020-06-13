package edu.oakland.healthscreening.dao;

public class Constants {

  public static final String INSERT_HEALTH_INFO =
      (" INSERT INTO screening.health_screening (account_type, pidm, email, name, phone, is_coughing, is_feverish, is_exposed)  "
          + " VALUES                                                                                                      "
          + " (CAST(? as account_type), ?, ?, ?, ?, ?, ?, ?)                                                                 "
          + "                                                                                                             ");

  public static final String GET_ALL_RESPONSES = ("select * from screening.health_screening ");
}
