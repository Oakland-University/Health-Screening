package edu.oakland.healthscreening.service;

import edu.oakland.healthscreening.dao.Postgres;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RecordDeltionService {

  @Autowired private Postgres postgres;

  @Scheduled(cron = "${health-screening.deletion-time}")
  public void deleteRecords() {
    postgres.deleteOldRecords();
  }
}
