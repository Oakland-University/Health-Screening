package edu.oakland.healthscreening.model;

import java.util.LinkedList;
import java.util.List;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class Pledge {
  private boolean hasFaceCovering;
  private boolean hasGoodHygiene;
  private boolean isDistancing;
  private String name;
  private String email;

  public boolean fullAgreement() {
    return (hasFaceCovering && hasGoodHygiene && isDistancing);
  }

  public String summarize() {
    return "The person: "
        + name
        + "\nWith email: "
        + email
        + "\nHas indicated that they:\n\t-"
        + this.responseSummary();
  }

  public String responseSummary() {
    List<String> summaryList = new LinkedList<>();

    if (hasFaceCovering) {
      summaryList.add("Do not have a face covering");
    }

    if (hasGoodHygiene) {
      summaryList.add("Are not practicing good hygiene");
    }

    if (isDistancing) {
      summaryList.add("Are not willing to practice physical distancing");
    }

    return String.join("\n\t- ", summaryList);
  }

  public static RowMapper<Pledge> mapper =
      (rs, rowNum) -> {
        Pledge pledge = new Pledge();

        pledge.setHasFaceCovering(rs.getBoolean("face_covering"));
        pledge.setHasGoodHygiene(rs.getBoolean("good_hygiene"));
        pledge.setHasFaceCovering(rs.getBoolean("distancing"));
        pledge.setEmail(rs.getString("email"));

        return pledge;
      };
}
