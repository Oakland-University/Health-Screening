package edu.oakland.healthscreening.service;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.AnalyticInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

  @Autowired private Postgres postgres;

  public AnalyticInfo getAnalyticInfo(String interval) {
    switch (interval) {
      case "day":
        return postgres.getAnalyticInfo("1 day");
      case "week":
        return postgres.getAnalyticInfo("7 days");
      case "month":
        return postgres.getAnalyticInfo("30 days");
      default:
        return postgres.getAnalyticInfo("999 years");
    }
  }
}
