package edu.oakland.healthscreening;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.apereo.portal.soffit.renderer.SoffitApplication;

@SoffitApplication
@SpringBootApplication
public class HealthScreeningApplication {

  public static void main(String[] args) {
    SpringApplication.run(HealthScreeningApplication.class, args);
  }
}
