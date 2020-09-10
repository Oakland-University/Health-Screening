package edu.oakland.healthscreening.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.savedrequest.NullRequestCache;

@ConditionalOnExpression("${ldap.enabled:true}")
@Configuration
@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {

  @Value("${web.security.ldap.user.dn.pattern}")
  private String userDnPattern;

  @Value("${web.security.ldap.group.search.base}")
  private String groupSearchBase;

  @Value("${web.security.ldap.manager.dn}")
  private String managerDn;

  @Value("${web.security.ldap.manager.password}")
  private String ldapPassword;

  @Value("${web.security.ldap.url}")
  private String ldapUrl;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.csrf()
        .disable()
        .authorizeRequests()
        .antMatchers("/api/v1/health-info/analytics/*/csv")
        .fullyAuthenticated()
        .and()
        .requestCache()
        .requestCache(new NullRequestCache())
        .and()
        .httpBasic();
  }

  @Override
  public void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.ldapAuthentication()
        .userDnPatterns(userDnPattern)
        .groupSearchBase(groupSearchBase)
        .contextSource()
        .managerDn(managerDn)
        .managerPassword(ldapPassword)
        .url(ldapUrl);
  }
}
