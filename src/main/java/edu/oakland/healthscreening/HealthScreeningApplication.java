package edu.oakland.healthscreening;

import org.apereo.portal.soffit.renderer.SoffitApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@ComponentScan({"edu.oakland.soffit.auth", "edu.oakland.healthscreening"})
@EnableScheduling
@SoffitApplication
@SpringBootApplication
public class HealthScreeningApplication {

  public static void main(String[] args) {
    SpringApplication.run(HealthScreeningApplication.class, args);
  }
}
