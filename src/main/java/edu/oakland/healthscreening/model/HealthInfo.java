package edu.oakland.healthscreening.model;

import java.sql.Timestamp;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class HealthInfo {
  // TODO transition to enum
  private String accountType;
  private String pidm;
  private String name;
  private String phone;
  private String email;
  private boolean coughing;
  private boolean feverish;
  private boolean exposed;
  private Timestamp submissionTime;

  public boolean shouldStayHome() {
    return (coughing || feverish || exposed);
  }

  public static RowMapper<HealthInfo> mapper =
      (rs, rowNum) -> {
        HealthInfo info = new HealthInfo();

        info.setAccountType(rs.getString("account_type"));
        info.setPidm(rs.getString("pidm"));
        info.setEmail(rs.getString("email"));
        info.setPhone(rs.getString("phone"));
        info.setCoughing(rs.getBoolean("is_coughing"));
        info.setFeverish(rs.getBoolean("is_feverish"));
        info.setExposed(rs.getBoolean("is_exposed"));
        info.setSubmissionTime(rs.getTimestamp("submission_time"));

        return info;
      };
}
