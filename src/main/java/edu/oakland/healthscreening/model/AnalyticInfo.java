package edu.oakland.healthscreening.model;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class AnalyticInfo {
  private int total;
  private int sick;
  private int coughing;
  private int feverish;
  private int exposed;

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
