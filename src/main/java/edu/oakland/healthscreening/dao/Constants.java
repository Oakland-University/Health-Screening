package edu.oakland.healthscreening.dao;

public class Constants {

  public static final String INSERT_HEALTH_INFO =
      (" INSERT INTO screening.health_screening                                                     "
              + "   (account_type, pidm, email, name, phone, is_coughing, is_feverish, is_exposed)  "
              + " VALUES                                                                            "
              + "   (CAST(? as screening.account_type), ?, ?, ?, ?, ?, ?, ?)                        ")
          .replaceAll("\\s+", " ");

  public static final String INSERT_ANALYTICS =
      (" INSERT INTO screening.analytics                                                            "
              + "   (account_type, is_coughing, is_feverish, is_exposed)                            "
              + " VALUES                                                                            "
              + "   (CAST(? as screening.account_type), ?, ?, ?)                                    ")
          .replaceAll("\\s+", " ");

  public static final String GET_ALL_RESPONSES = ("select * from screening.health_screening ");

  public static final String GET_RECENT_INFO =
      (" SELECT                                     "
              + "   *                                        "
              + " FROM                                       "
              + "   screening.health_screening               "
              + " WHERE                                      "
              + "   submission_time >= now()::date           "
              + "   AND pidm = ?                             "
              + " ORDER BY                                   "
              + "   submission_time DESC                     "
              + " LIMIT 1                                    ")
          .replaceAll("\\s+", " ");

  public static final String GET_GUEST_INFO =
      (" SELECT                                     "
              + "   *                                        "
              + " FROM                                       "
              + "   screening.health_screening               "
              + " WHERE                                      "
              + "   submission_time >= now()::date           "
              + "   AND name = ?                             "
              + "   AND email = ?                            "
              + "   AND phone = ?                            "
              + " ORDER BY                                   "
              + "   submission_time DESC                     "
              + " LIMIT 1                                    ")
          .replaceAll("\\s+", " ");

  public static final String DELETE_OLD_RECORDS =
      (" DELETE FROM                                   "
              + "   screening.health_screening                  "
              + " WHERE                                         "
              + "   age(submission_time) >= INTERVAL '30 days'  ")
          .replaceAll("\\s+", " ");
}
