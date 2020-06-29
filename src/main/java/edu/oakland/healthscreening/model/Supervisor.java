package edu.oakland.healthscreening.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class Supervisor {
  @Email private String email;

  @Size(max = 32, message = "Phone field should be less than 32 characters")
  private String phone;

  @Size(max = 128, message = "Name field should be less than 128 characters")
  private String name;

  @Size(max = 128, message = "Name field should be less than 128 characters")
  private String department;
}
