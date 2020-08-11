package edu.oakland.healthscreening.model;

import java.util.LinkedList;
import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class Pledge {
  private boolean faceCovering;
  private boolean goodHygiene;
  private boolean distancing;

  @Size(max = 128, message = "Name field should be less than 128 characters")
  private String name;

  @Email(message = "Email field should be a valid address")
  private String email;

  @Email(message = "Email field should be a valid address")
  private String supervisorEmail;

  public boolean fullAgreement() {
    return (faceCovering && goodHygiene && distancing);
  }

  public String summarize() {
    return "The person: "
        + name
        + "\nWith email: "
        + email
        + "\nHas indicated that they:\n\t- "
        + this.responseSummary();
  }

  public String responseSummary() {
    List<String> summaryList = new LinkedList<>();

    if (!faceCovering) {
      summaryList.add("Do not have a face covering");
    }

    if (!goodHygiene) {
      summaryList.add("Are not practicing good hygiene");
    }

    if (!distancing) {
      summaryList.add("Are not willing to practice physical distancing");
    }

    return String.join("\n\t- ", summaryList);
  }

  public static RowMapper<Pledge> mapper =
      (rs, rowNum) -> {
        Pledge pledge = new Pledge();

        pledge.setFaceCovering(rs.getBoolean("face_covering"));
        pledge.setGoodHygiene(rs.getBoolean("good_hygiene"));
        pledge.setDistancing(rs.getBoolean("distancing"));
        pledge.setEmail(rs.getString("email"));

        return pledge;
      };
}
