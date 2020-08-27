package edu.oakland.healthscreening.service;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.AnalyticInfo;
import static edu.oakland.healthscreening.dao.Constants.CSV_HEADER;;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

  @Autowired private Postgres postgres;

  public AnalyticInfo getAnalyticInfo(final String interval) {
    return postgres.getAnalyticInfo(intervalToDays(interval));
  }

  public AnalyticInfo getAnonymousAnalyticInfo(final String interval) {
    return postgres.getAnonymousAnalyticInfo(intervalToDays(interval));
  }

  public String getAnalyticCSV(final String interval) {
    return CSV_HEADER + postgres.getAnalyticInfo(interval).toCSVString();
  }

  private String intervalToDays(final String interval) {
    switch (interval) {
      case "day":
        return "1 day";
      case "week":
        return "7 days";
      case "month":
        return "1 month";
      default:
        return "999 years";
    }
  }

}
