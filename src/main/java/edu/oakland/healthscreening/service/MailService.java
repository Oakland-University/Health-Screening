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

  public void notifyHealthCenter(HealthInfo info) throws MailException {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(healthCenterAddress);
    msg.setSubject("Student Health Screening");
    msg.setText(
        "A potential positive self-screening response was submitted by a "
            + info.getAccountType()
            + ":\n\n"
            + "Information about this person:\n"
            + "Name: "
            + info.getName()
            + ", Phone: "
            + info.getPhone()
            + ", Email: "
            + info.getEmail()
            + "\nInformation about this person:\n"
            + "Responses: "
            + info.responseSummary());
    mailSender.send(msg);
  }
}
