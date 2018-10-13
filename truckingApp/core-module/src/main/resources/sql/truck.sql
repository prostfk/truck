CREATE TABLE company (
  id     SERIAL       NOT NULL PRIMARY KEY,
  name   varchar(100) NOT NULL,
  active smallint     NOT NULL DEFAULT '0'
);
CREATE TABLE driver (
  id                SERIAL      NOT NULL PRIMARY KEY,
  name              varchar(45) NOT NULL,
  passport_number   varchar(45) NOT NULL,
  company_of_driver int         NOT NULL,
  FOREIGN KEY (company_of_driver) REFERENCES company (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
CREATE TABLE auto (
  id               SERIAL PRIMARY KEY,
  type             VARCHAR(15) NOT NULL,
  fuel_consumption int         NOT NULL,
  name             varchar(45) NOT NULL,
  car_number       varchar(45) NOT NULL,
  company_owner    int         NOT NULL,
  FOREIGN KEY (company_owner) REFERENCES company (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE TABLE stock (
  id         SERIAL      NOT NULL PRIMARY KEY,
  name       varchar(45) NOT NULL,
  company_id int         NOT NULL,
  address    VARCHAR(50) NOT NULL,
  FOREIGN KEY (company_id) REFERENCES company (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
CREATE TABLE client (
  id           SERIAL      NOT NULL PRIMARY KEY,
  name         varchar(45) NOT NULL,
  type         VARCHAR(45) NOT NULL,
  client_owner int         NOT NULL,
  FOREIGN KEY (client_owner) REFERENCES company (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

/*step 2*/
CREATE TABLE waybill (
  id             SERIAL NOT NULL PRIMARY KEY,
  status         VARCHAR(45) DEFAULT NULL,
  driver         int    NOT NULL,
  auto           int    NOT NULL,
  date_departure date        DEFAULT NULL,
  date_arrival   date        DEFAULT NULL,
  FOREIGN KEY (auto) REFERENCES auto (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  FOREIGN KEY (driver) REFERENCES driver (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
CREATE TABLE orders (
  id            SERIAL      NOT NULL PRIMARY KEY,
  name          varchar(45) NOT NULL,
  client_id     int         NOT NULL,
  status        VARCHAR(45) NOT NULL DEFAULT 'new',
  sender        INT         NOT NULL,
  reciever      INT         NOT NULL,
  date_accepted date                 DEFAULT NULL,
  date_executed date                 DEFAULT NULL,
  waybill_id    BIGINT      NOT NULL,
  company_id    BIGINT      NOT NULL,
  FOREIGN KEY (company_id) REFERENCES company (id),
  FOREIGN KEY (waybill_id) REFERENCES waybill (id),
  FOREIGN KEY (sender) REFERENCES stock (id),
  FOREIGN KEY (reciever) REFERENCES stock (id),
  FOREIGN KEY (client_id) REFERENCES client (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
/*step 3*/
CREATE TABLE consignment (
  id              SERIAL      NOT NULL PRIMARY KEY,
  name            varchar(45) NOT NULL,
  consignment_ref INT         NOT NULL,
  FOREIGN KEY (consignment_ref) REFERENCES orders (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
CREATE TABLE product (
  id                  SERIAL       NOT NULL PRIMARY KEY,
  name                varchar(45) DEFAULT NULL,
  status              VARCHAR(45) DEFAULT NULL,
  description         varchar(100) NOT NULL,
  product_consignment INT,
  FOREIGN KEY (product_consignment) REFERENCES consignment (id)
);

CREATE TABLE cancellation_act (
  id        SERIAL NOT NULL PRIMARY KEY,
  date      date   NOT NULL,
  amount    int    NOT NULL,
  price     int    NOT NULL,
  productId int    NOT NULL,
  FOREIGN KEY (productId) REFERENCES product (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE route_list (
  id          SERIAL NOT NULL PRIMARY KEY,
  point       INT,
  point_level INT,
  waybill_id  BIGINT,
  FOREIGN KEY (waybill_id) REFERENCES waybill (id)
);

CREATE TABLE users (
  id        SERIAL NOT NULL PRIMARY KEY,
  username  VARCHAR(20),
  email     VARCHAR(50),
  password  VARCHAR(100),
  user_role VARCHAR(20)
);