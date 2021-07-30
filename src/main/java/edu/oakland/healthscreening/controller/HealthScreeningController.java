package edu.oakland.healthscreening.controller;

import static edu.oakland.healthscreening.model.AccountType.FACULTY;
import static edu.oakland.healthscreening.model.AccountType.GUEST;
import static edu.oakland.healthscreening.model.AccountType.STAFF;
import static edu.oakland.healthscreening.model.AccountType.STUDENT;
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
import java.util.Optional;
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
import org.springframework.web.bind.annotation.RequestParam;
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

  @GetMapping("campus-status")
  public Optional<HealthInfo> getCampusStatus(HttpServletRequest request)
      throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();
    String email = authorizer.getClaimFromJWE(request, "mail").asString();

    return postgres.getRecentSubmission(pidm, email);
  }

  @GetMapping("supervisor-email")
  public Optional<String> getSupervisorEmail(HttpServletRequest request)
      throws SoffitAuthException {
    return postgres.getSupervisorEmail(authorizer.getClaimFromJWE(request, "mail").asString());
  }

  @PostMapping("health-info")
  public void saveHealthInfo(@Valid @RequestBody HealthInfo info, HttpServletRequest request)
      throws SoffitAuthException {

    Map<String, Claim> personInfo = authorizer.getClaimsFromJWE(request);

    AccountType accountType = getAccountFromRequest(personInfo.get("groups"));
    String supervisorEmail = info.getSupervisorEmail();

    info.setAccountType(accountType);
    info.setSupervisorEmail(supervisorEmail);

    boolean previousPositive = false;

    if (accountType != GUEST) {
      info.setPidm(personInfo.get("pidm").asString());
      info.setName(personInfo.get("cn") == null ? null : personInfo.get("cn").asString());
      String email = personInfo.get("mail") == null ? null : personInfo.get("mail").asString();
      info.setEmail(email);

      // Only replace the provided phone if it's null or empty
      // TODO: Figure out if this gets run, and if so, when
      if (info.getPhone() == null || info.getPhone().isEmpty()) {
        info.setPhone(
            personInfo.get("telephoneNumber") == null
                ? null
                : personInfo.get("telephoneNumber").asString());
      }

      previousPositive =
          postgres
              .getRecentSubmission(info.getPidm(), info.getEmail())
              .map(HealthInfo::shouldStayHome)
              .orElse(false);
    }

    if (info.shouldStayHome() || previousPositive) {
      mailService.emailHealthCenter(info, accountType);
    }
    if (supervisorEmail != null && !supervisorEmail.isEmpty()) {
      mailService.emailSupervisor(info);
    }

    postgres.saveHealthInfo(info);
  }

  @GetMapping("health-info/{interval}")
  public List<HealthInfo> getHealthInfo(
      HttpServletRequest request,
      @PathVariable("interval") String interval,
      @RequestParam(defaultValue = "1") int amount)
      throws SoffitAuthException {
    List<String> groups = authorizer.getClaimFromJWE(request, "groups").asList(String.class);

    if (groups != null && groups.contains("GHC")) {
      return analytics.getIdentifiableRecords(amount, interval);
    } else {
      throw new SoffitAuthException("User not allowed access to this resource", null);
    }
  }

  @GetMapping("health-info/current-user")
  public Optional<HealthInfo> getUserInfo(HttpServletRequest request) throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();
    String email = authorizer.getClaimFromJWE(request, "mail").asString();

    return postgres.getRecentSubmission(pidm, email);
  }

  @GetMapping("health-info/certificate-email")
  public void getCertificateEmail(
      HttpServletRequest request,
      @RequestParam String name,
      @RequestParam String phone,
      @RequestParam String email)
      throws SoffitAuthException {
    Map<String, Claim> personInfo = authorizer.getClaimsFromJWE(request);

    Claim pidm = personInfo.get("pidm");

    if (pidm == null) {
      mailService.sendGuestCertificate(name, email, phone);
    } else {
      mailService.sendAuthenticatedCertificate(pidm.asString());
    }
  }

  @GetMapping("health-info/analytics/{interval}")
  public AnalyticInfo getAnalyticInfo(
      @PathVariable("interval") String interval,
      @RequestParam(defaultValue = "1") int amount,
      HttpServletRequest request)
      throws SoffitAuthException {
    List<String> groups = authorizer.getClaimFromJWE(request, "groups").asList(String.class);

    if (groups != null && (groups.contains("GHC") || groups.contains("Portal Administrators"))) {
      return analytics.getChartsInfo(amount, interval);
    } else {
      throw new SoffitAuthException("User not allowed access to this resource", null);
    }
  }

  private AccountType getAccountFromRequest(Claim groupsClaim) {
    if (groupsClaim == null) {
      return GUEST;
    }

    List<String> groups = groupsClaim.asList(String.class);

    if (groups.contains("OU Faculty")) {
      return FACULTY;
    } else if (groups.contains("OU Staff")) {
      return STAFF;
    } else if (groups.contains("OU Student")) {
      return STUDENT;
    }

    return GUEST;
  }
}
