package edu.oakland.healthscreening.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class AnalyticInfo {
  private int total;
  private int sick;
  private int coughing;
  private int feverish;
  private int exposed;

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
        + String.valueOf(sick)
        + ","
        + String.valueOf(feverish)
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
        + String.valueOf(coughing)
        + ","
        +
        /*temp*/ ","
        + String.valueOf(exposed)
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

        return info;
      };
}
