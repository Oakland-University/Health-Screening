package edu.oakland.healthscreening.controller;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.HealthInfo;
import edu.oakland.healthscreening.service.MailService;
import edu.oakland.soffit.auth.AuthService;
import edu.oakland.soffit.auth.SoffitAuthException;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

import com.auth0.jwt.interfaces.Claim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthScreeningController {
  @Autowired private Postgres postgres;
  @Autowired private MailService mailService;
  @Autowired private AuthService authorizer;

  @PostMapping("health-info")
  public void saveHealthInfo(@RequestBody HealthInfo info, HttpServletRequest request)
      throws SoffitAuthException {

    try {
      Map<String, Claim> personInfo = authorizer.getClaimsFromJWE(request);
      info.setAccountType("student");
      info.setPidm(personInfo.get("pidm").asString());
      info.setName(personInfo.get("givenName") == null ? null : personInfo.get("givenName").asString());
      info.setEmail(personInfo.get("mail") == null ? null : personInfo.get("mail").asString());
      info.setPhone(
          personInfo.get("telephoneNumber") == null
              ? null
              : personInfo.get("telephoneNumber").asString());

    } catch (SoffitAuthException e) {
      info.setAccountType("guest");
    }

    if (info.shouldStayHome()) {
      mailService.notifyHealthCenter(info);
    }

    postgres.saveHealthInfo(info);
  }

  @GetMapping("health-info")
  public List<HealthInfo> getHealthInfo() {
    return postgres.getHealthInfo();
  }
}
