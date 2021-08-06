package edu.oakland.healthscreening.service;

import static edu.oakland.healthscreening.model.AccountType.FACULTY;
import static edu.oakland.healthscreening.model.AccountType.GUEST;
import static edu.oakland.healthscreening.model.AccountType.STAFF;
import static edu.oakland.healthscreening.model.AccountType.STUDENT;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.HealthInfo;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import freemarker.template.TemplateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

@Service
public class MailService {

  @Autowired private JavaMailSender mailSender;
  @Autowired private Postgres postgres;
  @Autowired private FreeMarkerConfigurer configurer;

  @Value("${health-screening.health-center-address}")
  String healthCenterAddress;

  @Value("${health-screening.dean-of-students-address}")
  String deanAddress;

  @Value("${health-screening.email-from}")
  String mailFrom;

  private final Logger log = LoggerFactory.getLogger("health-screening");

  public void emailHealthCenter(HealthInfo info)
      throws IOException, TemplateException, MessagingException {
    MimeMessage message = mailSender.createMimeMessage();

    Map<String, Object> templateModel = new HashMap<>();
    templateModel.put("info", info);

    String text =
        FreeMarkerTemplateUtils.processTemplateIntoString(
            configurer.getConfiguration().getTemplate("ghc-email.ftl"), templateModel);

    log.debug(
        "Sending mail to: {}\nFor {}'s potential postive screening",
        healthCenterAddress,
        info.name);

    // Should see if UTF-8 is the default encoding, since it's an optional param
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    helper.setFrom(mailFrom);
    helper.setTo(healthCenterAddress);
    helper.setText(text, true);
    mailSender.send(message);
  }

  public void emailSupervisor(HealthInfo info) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom(mailFrom);
    msg.setSubject("Employee Health Screening -- " + info.email);
    msg.setTo(info.supervisorEmail);
    msg.setText(info.supervisorSummary());
    log.debug("Sending mail to: {}\nWho is {}'s supervisor'", msg.getTo(), info.name);
    mailSender.send(msg);
  }

  public void sendGuestCertificate(String name, String email, String phone) throws MailException {
    postgres.getGuestSubmission(name, email, phone).ifPresent(this::sendCertificate);
  }

  public void sendAuthenticatedCertificate(String pidm) throws MailException {
    postgres.getRecentSubmission(pidm).ifPresent(this::sendCertificate);
  }

  private String getEmailSubject(HealthInfo info) {

    switch (info.accountType) {
      case STUDENT:
        return "Student Health Screening -- " + info.email;
      case GUEST:
        return "Guest Health Screening -- " + info.email;
      case STAFF:
        return "Staff Health Screening -- " + info.email;
      case FACULTY:
        return "Faculty Health Screening -- " + info.email;
      default:
        return "Health Screening -- " + info.email;
    }
  }

  private void sendCertificate(HealthInfo info) throws MailException {
    SimpleMailMessage msg = new SimpleMailMessage();

    msg.setTo(info.email);
    msg.setFrom(mailFrom);

    if (info.shouldStayHome()) {
      msg.setSubject("OU Health Screening");
      msg.setText(
          "Please do not come to the Oakland University Campus.\n"
              + "Contact the Graham Health Center at (248) 370-2341.\n"
              + "Do Your Part to help maintain a safe and health campus: stay home.");
    } else {
      String dateString = new SimpleDateFormat("MM/dd/yy").format(info.submissionTime);
      msg.setSubject("Health Screening Certificate");
      String bodyText =
          String.format(
              "Thank you for doing your part to keep campus healthy!\n\nThis person, %s, is allowed on campus for the duration of %s.",
              info.name, dateString);
      msg.setText(bodyText);
    }

    log.debug(
        "Sending certificate to: {}\tWith stay_home = {}", msg.getTo(), info.shouldStayHome());
    mailSender.send(msg);
  }
}
