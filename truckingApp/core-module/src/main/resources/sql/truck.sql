CREATE TABLE orders (
  id            SERIAL      NOT NULL PRIMARY KEY,
  name          varchar(45) NOT NULL,
  client_id     int         NOT NULL,
  status        VARCHAR     NOT NULL DEFAULT 'new',
  sender        INT         NOT NULL,
  reciever      INT         NOT NULL,
  date_accepted date                 DEFAULT NULL,
  date_executed date                 DEFAULT NULL,
  waybill_id    BIGINT      NOT NULL,
  company_id BIGINT NOT NULL,
  FOREIGN KEY (company_id) REFERENCES company(id),
  FOREIGN KEY (waybill_id) REFERENCES waybill (id),
  FOREIGN KEY (sender) REFERENCES stock (id),
  FOREIGN KEY (reciever) REFERENCES stock (id),
  FOREIGN KEY (client_id) REFERENCES client (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);