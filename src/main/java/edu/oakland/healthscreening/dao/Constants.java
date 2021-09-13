package edu.oakland.healthscreening.dao;

public class Constants {

  public static final String GET_ANONYMOUS_ANALYTIC_INFO =
      (" SELECT                                                                              "
              + "     null as account_type,                                                  "
              + "     COUNT(*) AS total,                                                     "
              + "     SUM                                                                    "
              + "     (CASE                                                                  "
              + "         WHEN is_symptomatic = TRUE                                         "
              + "         OR is_exposed = TRUE THEN 1                                        "
              + "         ELSE 0                                                             "
              + "     END) AS potentially_positive,                                          "
              + "     SUM(CASE WHEN is_symptomatic = TRUE THEN 1 ELSE 0 END) AS symptomatic, "
              + "     SUM(CASE WHEN is_exposed = TRUE THEN 1 ELSE 0 END) AS exposed          "
              + " FROM                                                                       "
              + "     screening.anonymous_data                                               "
              + " WHERE                                                                      "
              + "     AGE(submission_time) <= ?::INTERVAL                                    ")
          .replaceAll("\\s+", " ");

  public static final String GET_ANALYTICS_BY_TYPE =
      (" select                                                                              "
              + "   account_type,                                                            "
              + "   COUNT(*) as total,                                                       "
              + "   SUM                                                                      "
              + "     (CASE                                                                  "
              + "         WHEN is_symptomatic = TRUE                                         "
              + "         OR is_exposed = TRUE THEN 1                                        "
              + "         ELSE 0                                                             "
              + "     END) AS potentially_positive,                                          "
              + "     SUM(CASE WHEN is_symptomatic = TRUE THEN 1 ELSE 0 END) AS symptomatic, "
              + "     SUM(CASE WHEN is_exposed = TRUE THEN 1 ELSE 0 END) AS exposed          "
              + " from                                                                       "
              + "     screening.anonymous_data                                               "
              + " where                                                                      "
              + "   AGE(submission_time) <= ?::INTERVAL                                      "
              + " group by                                                                   "
              + "   account_type                                                             ")
          .replaceAll("\\s+", " ");

  public static final String GET_ALL_RESPONSES =
      (" SELECT                                           "
              + "     *                                   "
              + " FROM                                    "
              + "     screening.health_screening          "
              + " WHERE                                   "
              + "     AGE(submission_time) <= ?::INTERVAL "
              + " ORDER BY                                "
              + "     submission_time DESC                ")
          .replaceAll("\\s+", " ");

  public static final String GET_SUPERVISOR_EMAIL =
      (" SELECT                                     "
              + "     supervisor_email              "
              + " FROM                              "
              + "     screening.employee_supervisor "
              + " WHERE                             "
              + "     email = ?                     ")
          .replaceAll("\\s+", " ");

  public static final String GET_RECENT_INFO =
      (" SELECT                                              "
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
      (" SELECT                                              "
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
}
