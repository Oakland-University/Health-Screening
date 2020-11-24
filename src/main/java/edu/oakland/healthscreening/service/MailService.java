package edu.oakland.healthscreening.service;

import static edu.oakland.healthscreening.model.AccountType.FACULTY;
import static edu.oakland.healthscreening.model.AccountType.GUEST;
import static edu.oakland.healthscreening.model.AccountType.STAFF;
import static edu.oakland.healthscreening.model.AccountType.STUDENT;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.AccountType;
import edu.oakland.healthscreening.model.HealthInfo;
import edu.oakland.healthscreening.model.Pledge;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

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

    ArrayList<String> emailList = new ArrayList<>();
    String supervisorEmail = pledge.getSupervisorEmail();

    if (supervisorEmail != null && !supervisorEmail.isEmpty()) {
      emailList.add(supervisorEmail);
    }

    if (accountType == STUDENT) {
      emailList.add(deanAddress);
    }

    msg.setTo(emailList.toArray(new String[emailList.size()]));

    msg.setText(pledge.summarize());
    log.debug("Sending mail to: {}\nFor {}'s pledge disagreement", msg.getTo(), pledge.getEmail());
    mailSender.send(msg);
  }

  public void emailHealthCenter(HealthInfo info, AccountType accountType) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom(mailFrom);
    msg.setSubject(getEmailSubject(info));
    msg.setText(info.summarize());
    msg.setTo(healthCenterAddress);
    log.debug(
        "Sending mail to: {}\nFor {}'s potential postive screening", msg.getTo(), info.getName());
    mailSender.send(msg);
  }

  public void emailSupervisor(HealthInfo info) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom(mailFrom);
    msg.setSubject("Employee Health Screening");
    msg.setTo(info.getPledge().getSupervisorEmail());
    msg.setText(info.supervisorSummary());
    log.debug("Sending mail to: {}\nWho is {}'s supervisor'", msg.getTo(), info.getName());
    mailSender.send(msg);
  }

  public void sendGuestCertificate(String name, String email, String phone) throws MailException {
    postgres.getGuestSubmission(name, email, phone).ifPresent(this::sendCertificate);
  }

  public void sendAuthenticatedCertificate(String pidm) throws MailException {
    postgres.getRecentSubmission(pidm).ifPresent(this::sendCertificate);
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

    log.debug(
        "Sending certificate to: {}\tWith stay_home = {}", msg.getTo(), info.shouldStayHome());
    mailSender.send(msg);
  }
}
