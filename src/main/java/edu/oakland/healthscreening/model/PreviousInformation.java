package edu.oakland.healthscreening.model;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class PreviousInformation {

  private String phone;
  private String supervisorEmail;

  public static RowMapper<PreviousInformation> mapper =
      (rs, rowNum) -> {
        final PreviousInformation info = new PreviousInformation();

        info.setPhone(rs.getString("phone"));
        info.setSupervisorEmail(rs.getString("supervisor_email"));

        return info;
      };
}
