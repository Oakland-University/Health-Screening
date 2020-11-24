package edu.oakland.healthscreening.model;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
@JsonInclude(NON_NULL)
public class AnalyticInfo {
  private int total;
  private int sick;
  private int congested;
  private int coughing;
  private int diarrhea;
  private int exposed;
  private int feverish;
  private int headache;
  private int lossOfTasteOrSmell;
  private int muscleAche;
  private int nauseous;
  private int shortOfBreath;
  private int soreThroat;
  private AccountType accountType;
  private Map<AccountType, AnalyticInfo> subTypeAnalytics;

  public String toCSVString() {
    final String dateString = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MM/dd/yyyy"));
    return
    /*id*/ ","
        + dateString
        + ","
        + "MI,"
        + "Oakland,"
        + "48326,"
        + "2200 North Squirrel Road,"
        + total
        + ","
        + sick
        + ","
        + feverish
        + ","
        +
        /*sore_throat*/ ","
        +
        /*chills*/ ","
        +
        /*headache*/ ","
        +
        /*muscle_aches*/ ","
        +
        /*abdominal_aches*/ ","
        +
        /*runny_nose*/ ","
        +
        /*nausea_vomiting*/ ","
        +
        /*shortness_breath*/ ","
        +
        /*loss_taste_smell*/ ","
        + coughing
        + ","
        +
        /*temp*/ ","
        + exposed
        + ","
    /*workplace_exclusion_travel*/ ;
  }

  public static RowMapper<AnalyticInfo> mapper =
      (rs, rowNum) -> {
        AnalyticInfo info = new AnalyticInfo();

        info.setTotal(rs.getInt("total"));
        info.setSick(rs.getInt("sick"));
        info.setCoughing(rs.getInt("coughing"));
        info.setFeverish(rs.getInt("feverish"));
        info.setExposed(rs.getInt("exposed"));

        String accountType = rs.getString("account_type");

        if (accountType != null) {
          info.setAccountType(AccountType.fromString(accountType));
        }

        return info;
      };
}
