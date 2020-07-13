package edu.oakland.healthscreening.controller;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.AccountType;
import edu.oakland.healthscreening.model.AnalyticInfo;
import edu.oakland.healthscreening.model.HealthInfo;
import edu.oakland.healthscreening.service.AnalyticsService;
import edu.oakland.healthscreening.service.MailService;
import edu.oakland.soffit.auth.AuthService;
import edu.oakland.soffit.auth.SoffitAuthException;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.auth0.jwt.interfaces.Claim;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthScreeningController {
  @Autowired private Postgres postgres;
  @Autowired private AnalyticsService analytics;
  @Autowired private MailService mailService;
  @Autowired private AuthService authorizer;
  private final Logger log = LoggerFactory.getLogger("health-screening");

  @ResponseStatus(value = UNAUTHORIZED, reason = "Invalid JWT")
  @ExceptionHandler(SoffitAuthException.class)
  public void soffitError(SoffitAuthException e) {
    log.error("Invalid JWT", e);
  }

  @ResponseStatus(value = INTERNAL_SERVER_ERROR, reason = "Unspecified exception")
  @ExceptionHandler(Exception.class)
  public void generalError(Exception e) {
    log.error("Unspecified exception", e);
  }

  @PostMapping("health-info")
  public void saveHealthInfo(@Valid @RequestBody HealthInfo info, HttpServletRequest request)
      throws SoffitAuthException {

    Map<String, Claim> personInfo = authorizer.getClaimsFromJWE(request);

    Claim pidm = personInfo.get("pidm");

    // TODO Handle all cases and abstract to seperate method

    if (pidm == null) {
      info.setAccountType(AccountType.GUEST);
    } else {
      info.setAccountType(AccountType.STUDENT);
      info.setPidm(pidm.asString());
      info.setName(personInfo.get("cn") == null ? null : personInfo.get("cn").asString());
      info.setEmail(personInfo.get("mail") == null ? null : personInfo.get("mail").asString());

      //  Only replace the provided phone if it's null or empty
      if (info.getPhone() == null || info.getPhone().isEmpty()) {
        info.setPhone(
            personInfo.get("telephoneNumber") == null
                ? null
                : personInfo.get("telephoneNumber").asString());
      }
    }

    if (info.shouldStayHome()) {
      mailService.notifyHealthCenter(info);
    }

    postgres.saveHealthInfo(info);
    postgres.saveAnalyticInfo(info);
  }

  @GetMapping("health-info")
  public List<HealthInfo> getHealthInfo() throws SoffitAuthException {
    String groups  = authorizer.getClaimFromJWE(request, "groups").asString();

    if (groups.contains("GHC")) {
      return postgres.getHealthInfo();
    } else {
      throw new SoffitAuthException("User not allowed access to this resource", null);
    }
  }

  @GetMapping("health-info/current-user")
  public HealthInfo getUserInfo(HttpServletRequest request) throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();

    return postgres.getRecentSubmission(pidm);
  }

  @GetMapping("health-info/analytics/{interval}")
  public AnalyticInfo getAnalyticInfo(@PathVariable("interval") String interval)
      throws SoffitAuthException {
    String groups  = authorizer.getClaimFromJWE(request, "groups").asString();

    if (groups.contains("GHC")) {
      return postgres.getHealthInfo();
    } else {
      throw new SoffitAuthException("User not allowed access to this resource", null);
    }
  }
}
