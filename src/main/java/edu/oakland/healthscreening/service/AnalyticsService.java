package edu.oakland.healthscreening.service;

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
        (info, subType) ->
            AnalyticInfo.builder()
                .exposed(info.getExposed() + subType.getExposed())
                .potentiallyPositive(
                    info.getPotentiallyPositive() + subType.getPotentiallyPositive())
                .total(info.getTotal() + subType.getTotal())
                .build();

    final List<AnalyticInfo> infoByType = postgres.getAnalyticsByType(cleanedInterval);
    EnumSet<AccountType> accountTypes = EnumSet.allOf(AccountType.class);

    final AnalyticInfo totalInfo =
        infoByType.stream().reduce(AnalyticInfo.builder().build(), infoAccumulator);

    Map<AccountType, AnalyticInfo> subTypeAnalytics =
        infoByType.stream()
            .collect(Collectors.toMap(AnalyticInfo::getAccountType, Function.identity()));

    accountTypes.forEach(
        type -> subTypeAnalytics.putIfAbsent(type, AnalyticInfo.builder().build()));

    return totalInfo.toBuilder().subTypeAnalytics(subTypeAnalytics).build();
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
