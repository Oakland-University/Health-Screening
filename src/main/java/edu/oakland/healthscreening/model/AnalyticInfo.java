package edu.oakland.healthscreening.model;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.jdbc.core.RowMapper;

@Builder(toBuilder = true)
@ToString
@Getter
@JsonInclude(NON_NULL)
public class AnalyticInfo {
  private int total;
  private int potentiallyPositive;
  private int symptomatic;
  private int exposed;
  private AccountType accountType;
  private Map<AccountType, AnalyticInfo> subTypeAnalytics;

  public static RowMapper<AnalyticInfo> mapper =
      (rs, rowNum) ->
          AnalyticInfo.builder()
              .total(rs.getInt("total"))
              .potentiallyPositive(rs.getInt("potentially_positive"))
              .exposed(rs.getInt("exposed"))
              .accountType(
                  rs.getString("account_type") == null
                      ? null
                      : AccountType.fromString(rs.getString("account_type")))
              .build();
}
