package edu.oakland.healthscreening.dao;

public class Constants {

  public static final String INSERT_PLEDGE =
      (" INSERT INTO screening.pledge                                                               "
              + "   (email, face_covering, good_hygiene, distancing)                                 "
              + " VALUES                                                                            "
              + "   (?, ?, ?, ?)                                                                    ")
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

  public static final String GET_SUPERVISOR_EMAIL =
      (" SELECT                                     "
              + "     supervisor_email              "
              + " FROM                              "
              + "     screening.employee_supervisor "
              + " WHERE                             "
              + "     email = ?                     ")
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

  public static final String GET_RECENT_PLEDGE =
      (" SELECT                                     "
              + "   *                                        "
              + " FROM                                       "
              + "   screening.pledge                         "
              + " WHERE                                      "
              + "   submission_time >= now()::date           "
              + "   AND email = ?                            "
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

  public static final String CSV_HEADER =
    "id,Date,State,County,Zip Code,Address,# of Screenings,workplace_exclusion_for_symptoms," +
    "fever,sore_throat,chills,headache,muscle_aches,abdominal_aches,runny_nose,nausea_vomiting," +
    "shortness_breath,loss_taste_smell,cough,temp,workplace_exclusion_for_contact," +
    "workplace_exclusion_for_travel\n";
}
