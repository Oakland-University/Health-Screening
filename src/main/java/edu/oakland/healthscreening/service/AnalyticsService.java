package edu.oakland.healthscreening.service;

import static edu.oakland.healthscreening.dao.Constants.CSV_HEADER;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.AccountType;
import edu.oakland.healthscreening.model.AnalyticInfo;
import edu.oakland.healthscreening.model.HealthInfo;

import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

  @Autowired private Postgres postgres;

  public List<HealthInfo> getIdentifiableRecords(final int amount, final String interval) {
    final String cleanedInterval = amountToString(amount) + " " + sanitizedInterval(interval);

    return postgres.getHealthForInterval(cleanedInterval);
  }

  public AnalyticInfo getChartsInfo(final int amount, final String interval) {
    final String cleanedInterval = amountToString(amount) + " " + sanitizedInterval(interval);

    final BinaryOperator<AnalyticInfo> infoAccumulator =
        (info, subType) -> {
          info.setCoughing(info.getCoughing() + subType.getCoughing());
          info.setExposed(info.getExposed() + subType.getExposed());
          info.setFeverish(info.getFeverish() + subType.getFeverish());
          info.setSick(info.getSick() + subType.getSick());
          info.setTotal(info.getTotal() + subType.getTotal());
          return info;
        };

    final List<AnalyticInfo> infoByType = postgres.getAnalyticsByType(cleanedInterval);
    EnumSet<AccountType> accountTypes = EnumSet.allOf(AccountType.class);

    final AnalyticInfo totalInfo = infoByType.stream().reduce(new AnalyticInfo(), infoAccumulator);

    Map<AccountType, AnalyticInfo> subTypeAnalytics =
        infoByType.stream()
            .collect(Collectors.toMap(AnalyticInfo::getAccountType, Function.identity()));

    accountTypes.forEach(type -> subTypeAnalytics.putIfAbsent(type, new AnalyticInfo()));

    totalInfo.setSubTypeAnalytics(subTypeAnalytics);

    return totalInfo;
  }

  public String getAnalyticCSV(final int amount, final String interval) {
    final String cleanedInterval = amountToString(amount) + " " + sanitizedInterval(interval);
    return CSV_HEADER + postgres.getAnalyticInfo(cleanedInterval).toCSVString();
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

    final String lowerCaseInterval = interval.toLowerCase();

    if (lowerCaseInterval.contains("hour")) {
      return "hours";
    } else if (lowerCaseInterval.contains("day")) {
      return "days";
    } else if (lowerCaseInterval.contains("week")) {
      return "weeks";
    } else if (lowerCaseInterval.contains("month")) {
      return "months";
    } else {
      return "years";
    }
  }
}
