package edu.oakland.healthscreening.model;

import java.sql.Timestamp;
import java.util.LinkedList;
import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class HealthInfo {
  private AccountType accountType;
  private String pidm;

  @Size(max = 128, message = "Name field should be less than 128 characters")
  private String name;

  @Size(max = 32, message = "Phone field should be less than 32 characters")
  private String phone;

  @Email(message = "Email field should be a valid address")
  private String email;

  private boolean coughing;
  private boolean feverish;
  private boolean exposed;
  private Timestamp submissionTime;
  private Supervisor supervisor;
  private Pledge pledge;

  public boolean shouldStayHome() {
    return (coughing || feverish || exposed);
  }

  public String summarize() {
    return "A potential positive self-screening response was submitted by a "
        + accountType.toString()
        + ":\n\n"
        + "Information about this person:\n"
        + "\tName: "
        + name
        + "\n\tPhone: "
        + phone
        + "\n\tEmail: "
        + email
        + "\n\nResponses: \n\t- "
        + this.responseSummary();
  }

  public static RowMapper<HealthInfo> mapper =
      (rs, rowNum) -> {
        HealthInfo info = new HealthInfo();

        info.setAccountType(AccountType.from(rs.getString("account_type")));
        info.setPidm(rs.getString("pidm"));
        info.setName(rs.getString("name"));
        info.setEmail(rs.getString("email"));
        info.setPhone(rs.getString("phone"));
        info.setCoughing(rs.getBoolean("is_coughing"));
        info.setFeverish(rs.getBoolean("is_feverish"));
        info.setExposed(rs.getBoolean("is_exposed"));
        info.setSubmissionTime(rs.getTimestamp("submission_time"));

        return info;
      };

  private String responseSummary() {
    List<String> summaryList = new LinkedList<>();

    if (coughing) {
      summaryList.add("has a cough or shortness of breath");
    }

    if (feverish) {
      summaryList.add("has a fever");
    }

    if (exposed) {
      summaryList.add("has been exposed to someone with COVID");
    }

    return String.join("\n\t- ", summaryList);
  }
}
