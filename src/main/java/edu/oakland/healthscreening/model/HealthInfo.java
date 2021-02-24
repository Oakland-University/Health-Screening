package edu.oakland.healthscreening.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

  private boolean congested;
  private boolean coughing;
  private boolean diarrhea;
  private boolean exposed;
  private boolean testedPositive;
  private boolean feverish;
  private boolean headache;
  private boolean lossOfTasteOrSmell;
  private boolean muscleAche;
  private boolean nauseous;
  private boolean shortOfBreath;
  private boolean soreThroat;
  private Timestamp submissionTime;
  private String supervisorEmail;
  private Pledge pledge;

  public boolean shouldStayHome() {
    return (coughing
        || feverish
        || exposed
        || shortOfBreath
        || soreThroat
        || congested
        || muscleAche
        || lossOfTasteOrSmell
        || headache
        || diarrhea
        || nauseous
        || testedPositive);
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
          + "\n\n They currently are not reporting any symptoms";
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
          + "\n\nResponses: \n\t- "
          + this.responseSummary();
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
        info.setCoughing(rs.getBoolean("is_coughing"));
        info.setFeverish(rs.getBoolean("is_feverish"));
        info.setExposed(rs.getBoolean("is_exposed"));
        info.setShortOfBreath(rs.getBoolean(("is_short_of_breath")));
        info.setSoreThroat(rs.getBoolean(("has_sore_throat")));
        info.setCongested(rs.getBoolean(("is_congested")));
        info.setMuscleAche(rs.getBoolean(("has_muscle_aches")));
        info.setLossOfTasteOrSmell(rs.getBoolean(("has_lost_taste_smell")));
        info.setHeadache(rs.getBoolean(("has_headache")));
        info.setDiarrhea(rs.getBoolean(("has_diarrhea")));
        info.setNauseous(rs.getBoolean(("is_nauseous")));
        info.setTestedPositive(rs.getBoolean(("has_tested_positive")));
        info.setSubmissionTime(rs.getTimestamp("submission_time"));

        return info;
      };

  private String responseSummary() {
    final List<String> summaryList = new LinkedList<>();

    if (coughing) {
      summaryList.add("is experiencing a cough");
    }

    if (feverish) {
      summaryList.add("is experiencing a fever");
    }

    if (exposed) {
      summaryList.add("has been exposed to someone with COVID");
    }

    if (shortOfBreath) {
      summaryList.add("is experiencing shortness of breath");
    }

    if (soreThroat) {
      summaryList.add("is experiencing a sore throat");
    }

    if (congested) {
      summaryList.add("is experiencing new, unexplained congestion");
    }

    if (muscleAche) {
      summaryList.add("is experiencing muscle aches");
    }

    if (lossOfTasteOrSmell) {
      summaryList.add("is experiencing a loss of taste or smell");
    }

    if (headache) {
      summaryList.add("is experiencing a headache");
    }

    if (diarrhea) {
      summaryList.add("is experiencing diarrhea");
    }

    if (nauseous) {
      summaryList.add("is experiencing nausea or vomiting");
    }

    if (testedPositive) {
      summaryList.add("has tested positive for COVID-19 within the last 10 days");
    }

    return String.join("\n\t- ", summaryList);
  }
}
