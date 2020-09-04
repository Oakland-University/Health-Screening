package edu.oakland.healthscreening.service;

import static edu.oakland.healthscreening.dao.Constants.CSV_HEADER;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.AnalyticInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

  @Autowired private Postgres postgres;

  public AnalyticInfo getAnalyticInfo(final int amount, final String interval) {
    final String cleanedInterval = amountToString(amount) + " " + sanitizedInterval(interval);
    return postgres.getAnalyticInfo(cleanedInterval);
  }

  public AnalyticInfo getAnonymousAnalyticInfo(final int amount, final String interval) {
    final String cleanedInterval = amountToString(amount) + " " + sanitizedInterval(interval);
    return postgres.getAnonymousAnalyticInfo(cleanedInterval);
  }

  public String getAnalyticCSV(final int amount, final String interval) {
    final String cleanedInterval = amountToString(amount) + " " + sanitizedInterval(interval);
    return CSV_HEADER + postgres.getAnonymousAnalyticInfo(cleanedInterval).toCSVString();
  }

  private String amountToString(final int amount) {
    if (amount <= 0) {
      return "999";
    } else {
      return String.valueOf(amount);
    }
  }

  private String sanitizedInterval(String interval) {
    if (interval == null) {
      return "years";
    }

    interval = interval.toLowerCase();

    if (interval.contains("hour")) {
      return "hours";
    } else if (interval.contains("day")) {
      return "days";
    } else if (interval.contains("week")) {
      return "weeks";
    } else if (interval.contains("month")) {
      return "months";
    } else {
      return "years";
    }
  }
}
