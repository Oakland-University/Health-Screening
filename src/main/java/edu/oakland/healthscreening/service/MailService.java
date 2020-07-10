package edu.oakland.healthscreening.service;

import edu.oakland.healthscreening.dao.Postgres;
import edu.oakland.healthscreening.model.HealthInfo;

import java.text.SimpleDateFormat;
import java.util.Optional;

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

  @Value("${health-screening.email-from}")
  String mailFrom;

  public void notifyHealthCenter(HealthInfo info) throws MailException {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(healthCenterAddress);
    msg.setFrom(mailFrom);
    msg.setSubject(getEmailSubject(info));
    msg.setText(info.summarize());
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
      msg.setText(
          "Thank you for doing your part to keep our campus healthy!\n\n"
              + "This person is allowed on campus for the duration of: "
              + dateString);
    }
  }
}
