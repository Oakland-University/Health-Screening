package edu.oakland.healthscreening;

import org.apereo.portal.soffit.renderer.SoffitApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan({"edu.oakland.soffit.auth", "edu.oakland.healthscreening"})
@SoffitApplication
@SpringBootApplication
public class HealthScreeningApplication {

  public static void main(String[] args) {
    SpringApplication.run(HealthScreeningApplication.class, args);
  }
}
