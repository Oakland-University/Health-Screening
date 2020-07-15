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

  public static final String GET_ANALYTIC_INFO =
      (" SELECT                                                                           "
              + "     COUNT(*) AS total,                                                  "
              + "     SUM                                                                 "
              + "     (CASE                                                               "
              + "         WHEN is_feverish = TRUE                                         "
              + "         OR is_coughing = TRUE                                           "
              + "         OR is_exposed = TRUE THEN 1                                     "
              + "         ELSE 0                                                          "
              + "     END) AS sick,                                                       "
              + "     SUM(CASE WHEN is_coughing = TRUE THEN 1 ELSE 0 END) AS coughing,    "
              + "     SUM(CASE WHEN is_feverish = TRUE THEN 1 ELSE 0 END) AS feverish,    "
              + "     SUM(CASE WHEN is_exposed = TRUE THEN 1 ELSE 0 END) AS exposed       "
              + " FROM                                                                    "
              + "     screening.health_screening                                          "
              + " WHERE                                                                   "
              + "     AGE(submission_time) <= ?::INTERVAL                                 ")
          .replaceAll("\\s+", " ");

  public static final String GET_ALL_RESPONSES =
      (" SELECT                                     "
              + "     *                             "
              + " FROM                              "
              + "     screening.health_screening    "
              + " ORDER BY                          "
              + "     submission_time DESC          ")
          .replaceAll("\\s+", " ");

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
