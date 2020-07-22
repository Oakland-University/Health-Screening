package edu.oakland.healthscreening.model;

import java.util.LinkedList;
import java.util.List;

import lombok.Data;

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
    return "The person "
        + name
        + "with email: "
        + email
        + "has indicated that they:\n\n"
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
}
