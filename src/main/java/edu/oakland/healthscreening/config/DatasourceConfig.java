package edu.oakland.healthscreening.config;

import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class DatasourceConfig {

  @Bean
  @ConfigurationProperties("spring.datasource.postgres")
  public DataSource postgresDataSource() {
    return DataSourceBuilder.create().build();
  }

  @Bean
  @Primary
  @ConfigurationProperties("spring.datasource.banner")
  public DataSource bannerDataSource() {
    return DataSourceBuilder.create().build();
  }
}
