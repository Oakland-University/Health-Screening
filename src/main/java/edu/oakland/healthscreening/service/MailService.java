package edu.oakland.healthscreening.service;

import edu.oakland.healthscreening.model.HealthInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
public class MailService {

  @Autowired private MailSender mailSender;

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
}
