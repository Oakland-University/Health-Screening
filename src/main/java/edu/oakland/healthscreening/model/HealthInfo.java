package edu.oakland.healthscreening.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import lombok.Builder;
import org.springframework.jdbc.core.RowMapper;

@Builder(toBuilder = true)
public class HealthInfo {
  public final AccountType accountType;
  public final String pidm;

  @Size(max = 128, message = "Name field should be less than 128 characters")
  public final String name;

  @Size(max = 32, message = "Phone field should be less than 32 characters")
  public final String phone;

  @Email(message = "Email field should be a valid address")
  public final String email;

  public final boolean symptomatic;
  public final boolean exposed;
  public final Timestamp submissionTime;
  public final String supervisorEmail;

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
          + email
          + "\nResponses to HS questions:"
          + "\n\tSymptomatic:\tExposed"
          + "\n\t"
          + symptomatic
          + "\t"
          + exposed;
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
      (rs, rowNum) ->
          HealthInfo.builder()
              .accountType(AccountType.fromString(rs.getString("account_type")))
              .pidm(rs.getString("pidm"))
              .name(rs.getString("name"))
              .email(rs.getString("email"))
              .phone(rs.getString("phone"))
              .exposed(rs.getBoolean("is_exposed"))
              .submissionTime(rs.getTimestamp("submission_time"))
              .symptomatic(rs.getBoolean("is_symptomatic"))
              .build();
}
