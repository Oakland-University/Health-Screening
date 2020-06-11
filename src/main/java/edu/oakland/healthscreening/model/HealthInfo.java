package edu.oakland.healthscreening.model;

import lombok.Data;

@Data
public class HealthInfo {
  String name;
  String phone;
  String email;
  boolean hasCough;
  boolean hasFever;
  boolean hasExposure;
}
