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
    msg.setSubject("Student Health Screening");
    msg.setText(
        "A potential positive self-screening response was submitted by a "
            + info.getAccountType()
            + ":\n\n"
            + "<strong>Information about this person:</strong>\n"
            + "\tName: "
            + info.getName()
            + "\n\tPhone: "
            + info.getPhone()
            + "\n\tEmail: "
            + info.getEmail()
            + "\n\n<strong>Information about this person:</strong>\n"
            + "Responses: "
            + info.responseSummary());
    mailSender.send(msg);
  }
}
