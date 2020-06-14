package edu.oakland.healthscreening.controller;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.HealthInfo;
import edu.oakland.healthscreening.service.MailService;
import edu.oakland.soffit.auth.AuthService;
import edu.oakland.soffit.auth.SoffitAuthException;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

import com.auth0.jwt.interfaces.Claim;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthScreeningController {
  @Autowired private Postgres postgres;
  @Autowired private MailService mailService;
  @Autowired private AuthService authorizer;
  private final Logger log = LoggerFactory.getLogger("health-screening");

  @ResponseStatus(value = UNAUTHORIZED, reason = "Invalid JWT")
  @ExceptionHandler(SoffitAuthException.class)
  public void soffitError(SoffitAuthException e) {
    log.error("Invalid JWT", e);
  }

  @PostMapping("health-info")
  public void saveHealthInfo(@RequestBody HealthInfo info, HttpServletRequest request) {

    try {
      info = getInfoFromBearer(request, info);
    } catch (SoffitAuthException e) {
      info.setAccountType("guest");
    }

    if (info.shouldStayHome()) {
      mailService.notifyHealthCenter(info);
    }

    postgres.saveHealthInfo(info);
  }

  @GetMapping("health-info")
  public List<HealthInfo> getHealthInfo() throws SoffitAuthException {
    throw new SoffitAuthException("User not allowed access to this resource", null);
  }

  @GetMapping("health-info/current-user")
  public HealthInfo getUserInfo(HttpServletRequest request) throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();

    return postgres.getRecentSubmission(pidm);
  }

  private HealthInfo getInfoFromBearer(HttpServletRequest request, HealthInfo info)
      throws SoffitAuthException {
    Map<String, Claim> personInfo = authorizer.getClaimsFromJWE(request);
    info.setAccountType("student");
    info.setPidm(personInfo.get("pidm").asString());
    info.setName(personInfo.get("cn") == null ? null : personInfo.get("cn").asString());
    info.setEmail(personInfo.get("mail") == null ? null : personInfo.get("mail").asString());
    info.setPhone(
        personInfo.get("telephoneNumber") == null
            ? null
            : personInfo.get("telephoneNumber").asString());

    return info;
  }
}
