package edu.oakland.healthscreening.service;

import static edu.oakland.healthscreening.model.AccountType.*;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.AccountType;
import edu.oakland.healthscreening.model.HealthInfo;
import edu.oakland.healthscreening.model.Pledge;

import java.text.SimpleDateFormat;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
public class MailService {

  @Autowired private MailSender mailSender;
  @Autowired private Postgres postgres;

  @Value("${health-screening.health-center-address}")
  String healthCenterAddress;

  @Value("${health-screening.dean-of-students-address}")
  String deanAddress;

  @Value("${health-screening.email-from}")
  String mailFrom;

  private final Logger log = LoggerFactory.getLogger("health-screening");

  public void sendPledgeDisagreement(Pledge pledge, AccountType accountType) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setSubject("Coronavirus Honor Pledge Disagreement");
    msg.setFrom(mailFrom);

    if (accountType == STUDENT) {
      msg.setTo(deanAddress, pledge.getSupervisorEmail());
    } else {
      msg.setTo(pledge.getSupervisorEmail());
    }

    msg.setText(pledge.summarize());

    log.debug("Sending pledge email:\nfrom: {}\tto: {}", msg.getFrom(), msg.getTo());
    mailSender.send(msg);
  }

  public void sendNotificationEmail(HealthInfo info, AccountType accountType) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom(mailFrom);
    msg.setSubject(getEmailSubject(info));
    msg.setText(info.summarize());

    if (info.getPledge().getSupervisorEmail() != null
        && !info.getPledge().getSupervisorEmail().isEmpty()) {
      msg.setTo(healthCenterAddress, info.getPledge().getSupervisorEmail());
    } else {
      msg.setTo(healthCenterAddress);
    }

    log.debug("Sending screening email:\nfrom: {}\tto: {}", msg.getFrom(), msg.getTo());
    mailSender.send(msg);
  }

  public void sendGuestCertificate(String name, String email, String phone) throws MailException {
    Optional<HealthInfo> optionalInfo = postgres.getGuestSubmission(name, email, phone);

    if (optionalInfo.isPresent()) {
      sendCertificate(optionalInfo.get());
    }
  }

  public void sendAuthenticatedCertificate(String pidm) throws MailException {
    Optional<HealthInfo> optionalInfo = postgres.getRecentSubmission(pidm);

    if (optionalInfo.isPresent()) {
      sendCertificate(optionalInfo.get());
    }
  }

  private String getEmailSubject(HealthInfo info) {

    switch (info.getAccountType()) {
      case STUDENT:
        return "Student Health Screening";
      case GUEST:
        return "Guest Health Screening";
      case STAFF:
        return "Staff Health Screening";
      case FACULTY:
        return "Faculty Health Screening";
      case STUDENT_EMPLOYEE:
        return "Student Employee Health Screening";
      default:
        return "Health Screening";
    }
  }

  private void sendCertificate(HealthInfo info) throws MailException {
    SimpleMailMessage msg = new SimpleMailMessage();

    msg.setTo(info.getEmail());
    msg.setFrom(mailFrom);

    if (info.shouldStayHome()) {
      msg.setSubject("OU Health Screening");
      msg.setText(
          "Please do not come to the Oakland University Campus.\n"
              + "Contact the Graham Health Center at (248) 370-2341.\n"
              + "Do Your Part to help maintain a safe and health campus: stay home.");
    } else {
      String dateString = new SimpleDateFormat("MM/dd/yy").format(info.getSubmissionTime());
      msg.setSubject("Health Screening Certificate");
      String bodyText =
          String.format(
              "Thank you for doing your part to keep campus healthy!\n\nThis person, %s, is allowed on campus for the duration of %s.",
              info.getName(), dateString);
      msg.setText(bodyText);
    }

    mailSender.send(msg);
  }
}
