package edu.oakland.healthscreening.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

  private boolean symptomatic;
  private boolean exposed;
  private Timestamp submissionTime;
  private String supervisorEmail;

  public boolean shouldStayHome() {
    return (symptomatic || exposed);
  }

  public String summarize() {
    if (!shouldStayHome()) {
      return "A health screening correction was submitted by a "
          + accountType.toString()
          + ":\n\n"
          + "Information about this person:\n"
          + "\tName: "
          + name
          + "\n\tPhone: "
          + phone
          + "\n\tEmail: "
          + email
          + "\n\n They are reporting in a way that should clear them to come to campus";
    } else {
      return "A potential positive self-screening response was submitted by a "
          + accountType.toString()
          + ":\n\n"
          + "Information about this person:\n"
          + "\tName: "
          + name
          + "\n\tPhone: "
          + phone
          + "\n\tEmail: "
          + email;
    }
  }

  public String supervisorSummary() {
    if (shouldStayHome()) {
      return "This is a notification to let you know that "
          + name
          + " will not be back at work.\n\n"
          + "If you have any questions, contact the Oakland University Graham Health Center, 408 Meadow Brook Road, Rochester Hills MI 48309 248-370-4375 fax 248-370-2691\n"
          + "\nSubmitter Email: "
          + email
          + "\nSubmitter Name: "
          + name;
    } else {
      final String dateString =
          LocalDateTime.now().format(DateTimeFormatter.ofPattern("MM-dd-yyyy"));
      return "Thank you all for doing your part to keep campus healthy!\n\n"
          + "The employee, "
          + name
          + " is allowed on campus for the duration of "
          + dateString;
    }
  }

  public static RowMapper<HealthInfo> mapper =
      (rs, rowNum) -> {
        final HealthInfo info = new HealthInfo();

        info.setAccountType(AccountType.fromString(rs.getString("account_type")));
        info.setPidm(rs.getString("pidm"));
        info.setName(rs.getString("name"));
        info.setEmail(rs.getString("email"));
        info.setPhone(rs.getString("phone"));
        info.setExposed(rs.getBoolean("is_exposed"));
        info.setSubmissionTime(rs.getTimestamp("submission_time"));
        info.setSymptomatic(rs.getBoolean("symptomatic"));

        return info;
      };
}
