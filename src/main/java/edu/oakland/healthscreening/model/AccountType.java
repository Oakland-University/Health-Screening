package edu.oakland.healthscreening.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum AccountType {
  @JsonProperty("student")
  STUDENT,
  @JsonProperty("guest")
  GUEST,
  @JsonProperty("staff")
  STAFF,
  @JsonProperty("faculty")
  FACULTY,
  @JsonProperty("student_employee")
  STUDENT_EMPLOYEE;

  public static AccountType from(String type) {

    Objects.requireNonNull(type, "Cannot infer AccountType from null");

    switch (type.toLowerCase()) {
      case "student":
        return STUDENT;
      case "guest":
        return GUEST;
      case "staff":
        return STAFF;
      case "faculty":
        return FACULTY;
      case "student_employee":
        return STUDENT_EMPLOYEE;
      default:
        throw new IllegalArgumentException("Incorrect account type provided");
    }
  }

  @Override
  public String toString() {
    return super.toString().toLowerCase();
  }

}
