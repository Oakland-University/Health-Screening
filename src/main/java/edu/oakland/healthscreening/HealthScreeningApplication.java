package edu.oakland.healthscreening;

import freemarker.cache.ClassTemplateLoader;
import freemarker.cache.TemplateLoader;
import freemarker.template.Configuration;
import org.apereo.portal.soffit.renderer.SoffitApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

@ComponentScan({"edu.oakland.soffit.auth", "edu.oakland.healthscreening"})
@EnableScheduling
@SoffitApplication
@SpringBootApplication
public class HealthScreeningApplication {

  @Bean
  public FreeMarkerConfigurer freemarkerClassLoaderConfig() {
    Configuration configuration = new Configuration(Configuration.VERSION_2_3_30);
    // Print boolean values as the computer sees them (i.e. 'true' and 'false')
    configuration.setBooleanFormat("c");
    // Look for 'ftl' files in src/main/resources/templates - and keep them in the classpath
    TemplateLoader templateLoader = new ClassTemplateLoader(this.getClass(), "/templates");
    configuration.setTemplateLoader(templateLoader);
    FreeMarkerConfigurer freeMarkerConfigurer = new FreeMarkerConfigurer();
    freeMarkerConfigurer.setConfiguration(configuration);
    return freeMarkerConfigurer;
  }

  public static void main(String[] args) {
    SpringApplication.run(HealthScreeningApplication.class, args);
  }
}
