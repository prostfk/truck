--
-- PostgreSQL database dump
--

-- Dumped from database version 11.0
-- Dumped by pg_dump version 11.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE truck;
--
-- Name: truck; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE truck WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Russian_Russia.1251' LC_CTYPE = 'Russian_Russia.1251';


ALTER DATABASE truck OWNER TO postgres;

\connect truck

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: auto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auto (
  id integer NOT NULL,
  type character varying(15) NOT NULL,
  fuel_consumption integer NOT NULL,
  name character varying(45) NOT NULL,
  car_number character varying(45) NOT NULL,
  company_owner integer NOT NULL,
  active boolean DEFAULT true
);


ALTER TABLE public.auto OWNER TO postgres;

--
-- Name: auto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auto_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.auto_id_seq OWNER TO postgres;

--
-- Name: auto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auto_id_seq OWNED BY public.auto.id;


--
-- Name: cancellation_act; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cancellation_act (
  id integer NOT NULL,
  date date,
  amount integer NOT NULL,
  price integer NOT NULL,
  consignment_id bigint NOT NULL
);


ALTER TABLE public.cancellation_act OWNER TO postgres;

--
-- Name: cancellation_act_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cancellation_act_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.cancellation_act_id_seq OWNER TO postgres;

--
-- Name: cancellation_act_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cancellation_act_id_seq OWNED BY public.cancellation_act.id;


--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
  id integer NOT NULL,
  name character varying(45) NOT NULL,
  type character varying(45) NOT NULL,
  client_owner integer NOT NULL
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.client_id_seq OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;


--
-- Name: company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company (
  id integer NOT NULL,
  name character varying(100) NOT NULL,
  active smallint DEFAULT '0'::smallint NOT NULL,
  lock_comment character varying(255),
  locker_id integer,
  lock_date date
);


ALTER TABLE public.company OWNER TO postgres;

--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.company_id_seq OWNER TO postgres;

--
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_id_seq OWNED BY public.company.id;


--
-- Name: consignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consignment (
  id integer NOT NULL,
  name character varying(45) NOT NULL,
  order_id integer NOT NULL
);


ALTER TABLE public.consignment OWNER TO postgres;

--
-- Name: consignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consignment_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.consignment_id_seq OWNER TO postgres;

--
-- Name: consignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consignment_id_seq OWNED BY public.consignment.id;


--
-- Name: driver; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver (
  id integer NOT NULL,
  name character varying(45) NOT NULL,
  passport_number character varying(45) NOT NULL,
  company_of_driver integer NOT NULL,
  userid integer
);


ALTER TABLE public.driver OWNER TO postgres;

--
-- Name: driver_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.driver_id_seq OWNER TO postgres;

--
-- Name: driver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_id_seq OWNED BY public.driver.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
  id integer NOT NULL,
  name character varying(45) NOT NULL,
  client_id integer NOT NULL,
  status integer DEFAULT 0,
  sender integer NOT NULL,
  receiver integer NOT NULL,
  date_accepted date,
  date_executed date,
  waybill_id bigint,
  company_id bigint NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
  id integer NOT NULL,
  name character varying(45) DEFAULT NULL::character varying,
  status integer DEFAULT 0,
  description character varying(100) NOT NULL,
  product_consignment integer NOT NULL,
  cancellation_act bigint,
  price integer,
  count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: route_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.route_list (
  id integer NOT NULL,
  point character varying(200),
  point_level integer,
  waybill_id bigint,
  marked boolean DEFAULT false,
  lat numeric DEFAULT 0.0,
  lng numeric DEFAULT 0.0
);


ALTER TABLE public.route_list OWNER TO postgres;

--
-- Name: route_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.route_list_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.route_list_id_seq OWNER TO postgres;

--
-- Name: route_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.route_list_id_seq OWNED BY public.route_list.id;


--
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock (
  id integer NOT NULL,
  name character varying(45) NOT NULL,
  company_id integer NOT NULL,
  address character varying(50) NOT NULL,
  active boolean DEFAULT true,
  lat double precision,
  lng double precision
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- Name: stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.stock_id_seq OWNER TO postgres;

--
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_id_seq OWNED BY public.stock.id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens (
  id integer NOT NULL,
  email character varying(50),
  token_value character varying(100)
);


ALTER TABLE public.tokens OWNER TO postgres;

--
-- Name: tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tokens_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.tokens_id_seq OWNER TO postgres;

--
-- Name: tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tokens_id_seq OWNED BY public.tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
  id integer NOT NULL,
  username character varying(20),
  email character varying(50),
  password character varying(100),
  user_role character varying(20),
  company bigint,
  birth_day date,
  first_name character varying(50),
  second_name character varying(50) NOT NULL,
  third_name character varying(50),
  city character varying(60),
  country character varying(60),
  street character varying(60),
  house_number character varying(60),
  flat_number character varying(60),
  reg_date timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: waybill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waybill (
  id integer NOT NULL,
  status integer DEFAULT 0,
  driver integer NOT NULL,
  auto integer NOT NULL,
  date_departure date,
  date_arrival date,
  check_date date,
  user_id integer
);


ALTER TABLE public.waybill OWNER TO postgres;

--
-- Name: waybill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.waybill_id_seq
AS integer
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


ALTER TABLE public.waybill_id_seq OWNER TO postgres;

--
-- Name: waybill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waybill_id_seq OWNED BY public.waybill.id;


--
-- Name: auto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auto ALTER COLUMN id SET DEFAULT nextval('public.auto_id_seq'::regclass);


--
-- Name: cancellation_act id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cancellation_act ALTER COLUMN id SET DEFAULT nextval('public.cancellation_act_id_seq'::regclass);


--
-- Name: client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);


--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);


--
-- Name: consignment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consignment ALTER COLUMN id SET DEFAULT nextval('public.consignment_id_seq'::regclass);


--
-- Name: driver id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver ALTER COLUMN id SET DEFAULT nextval('public.driver_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Name: route_list id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route_list ALTER COLUMN id SET DEFAULT nextval('public.route_list_id_seq'::regclass);


--
-- Name: stock id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock ALTER COLUMN id SET DEFAULT nextval('public.stock_id_seq'::regclass);


--
-- Name: tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens ALTER COLUMN id SET DEFAULT nextval('public.tokens_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: waybill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waybill ALTER COLUMN id SET DEFAULT nextval('public.waybill_id_seq'::regclass);


--
-- Data for Name: auto; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (19, 'крытый кузов', 20, 'Tata LPT ', '9412 BY-3', 1, true);
INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (20, 'крытый кузов', 21, 'MAN TGX 18.400 ', '1421 BY-7', 1, true);
INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (21, 'крытый кузов', 25, 'MAN 18 18.224 ', '1245 BY-7', 1, true);
INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (22, 'крытый кузов', 25, 'MAN 18 18.224 ', '5812 BY-5', 2, true);
INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (23, 'крытый кузов', 31, 'Hyundai HD78 ', '1251 BY-5', 2, true);
INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (24, 'цистерна', 32, 'Hyundai Porter', '8725 BY-4', 2, true);
INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (25, 'цистерна', 23, 'LIAZ 110 ', '7124 BY-2', 3, true);
INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (26, 'крытый кузов', 25, 'Scania 124 ', '4851 BY-2', 3, true);
INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (27, 'Кртый кузов', 24, 'Scania 124 ', '5991 BY-6', 3, true);


--
-- Data for Name: cancellation_act; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cancellation_act (id, date, amount, price, consignment_id) VALUES (33, '2018-11-06', 0, 0, 33);
INSERT INTO public.cancellation_act (id, date, amount, price, consignment_id) VALUES (2, NULL, 0, 0, 34);


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.client (id, name, type, client_owner) VALUES (1, 'Евроопт Минск', 'deafult', 1);
INSERT INTO public.client (id, name, type, client_owner) VALUES (2, 'Евроопт Гродно', 'deafult', 1);
INSERT INTO public.client (id, name, type, client_owner) VALUES (3, 'Брусничка', 'deafult', 1);
INSERT INTO public.client (id, name, type, client_owner) VALUES (4, 'IBSO', 'deafult', 2);
INSERT INTO public.client (id, name, type, client_owner) VALUES (5, 'KolTo service', 'deafult', 2);
INSERT INTO public.client (id, name, type, client_owner) VALUES (6, 'Ximik DK', 'deafult', 2);
INSERT INTO public.client (id, name, type, client_owner) VALUES (7, 'SoperDay', 'deafult', 3);
INSERT INTO public.client (id, name, type, client_owner) VALUES (8, 'Choks Pizza', 'deafult', 3);
INSERT INTO public.client (id, name, type, client_owner) VALUES (9, 'Chole Pizza', 'deafult', 3);


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.company (id, name, active, lock_comment, locker_id, lock_date) VALUES (3, 'International Trucking', 1, '', NULL, NULL);
INSERT INTO public.company (id, name, active, lock_comment, locker_id, lock_date) VALUES (2, 'GoTrans', 1, 'Блокировка за неуплату', NULL, '2018-10-27');
INSERT INTO public.company (id, name, active, lock_comment, locker_id, lock_date) VALUES (1, 'Express Bus', 0, 'asd', NULL, '2018-10-30');


--
-- Data for Name: consignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.consignment (id, name, order_id) VALUES (34, 'consignment #34', 34);
INSERT INTO public.consignment (id, name, order_id) VALUES (33, 'consignment #34', 33);


--
-- Data for Name: driver; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (4, 'Павел Конюшин', 'HB 65717294', 2, NULL);
INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (5, 'Дмитрий Гребешков', 'HB 42342112', 2, NULL);
INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (6, 'Григорий Солнцев', 'HB 02130294', 2, NULL);
INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (7, 'Мирон Корсаков', 'HB 24100492', 3, NULL);
INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (8, 'Павел Ковалев', 'HB 94918590', 3, NULL);
INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (9, 'Григорий коновалов', 'HB 10850953', 3, NULL);
INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (1, 'Павел Иванов', 'HB 72180123', 1, 32);
INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (3, 'Алексей Гребешков', 'HB 12342182', 1, 34);
INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (2, 'Дмитрий Петров ', 'HB 98220918', 1, 33);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.orders (id, name, client_id, status, sender, receiver, date_accepted, date_executed, waybill_id, company_id) VALUES (34, 'order #34', 1, 1, 3, 3, '2018-11-05', '2018-11-07', 34, 1);
INSERT INTO public.orders (id, name, client_id, status, sender, receiver, date_accepted, date_executed, waybill_id, company_id) VALUES (33, 'order #33', 1, 1, 3, 3, '2018-11-07', '2018-11-10', 33, 1);


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count) VALUES (40, 'product #40', 3, 'desc', 33, NULL, 121, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count) VALUES (41, 'product #41', 3, 'desc', 33, NULL, 100, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count) VALUES (42, 'product #42', 1, 'desc', 33, NULL, 76, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count) VALUES (39, 'product #39', 1, 'desc', 33, NULL, 123, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count) VALUES (37, 'product #37', 1, 'desc', 34, NULL, 100, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count) VALUES (35, 'product #35', 1, 'desc', 34, NULL, 123, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count) VALUES (36, 'product #36', 1, 'desc', 34, NULL, 121, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count) VALUES (38, 'product #38', 1, 'desc', 34, NULL, 76, 0);


--
-- Data for Name: route_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (14, 'Гродно', 2, 33, NULL, 53.7169, 27.9776);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (36, '', 7, 34, NULL, 53.7201302788227, 27.9867323821106);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (37, '', 8, 34, NULL, 53.7130700719784, 27.9448470061341);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (39, '', 9, 34, NULL, 53.7111702171817, 27.9917963927307);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (40, '', 10, 34, NULL, 53.744485194911, 27.8471452081246);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (41, '', 11, 34, NULL, 53.7104216316275, 27.9540809775074);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (42, 'Смиловичский сельский Совет', 12, 34, NULL, 53.7241525432803, 28.0190047209778);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (43, 'Смиловичский сельский Совет', 13, 34, NULL, 53.7216132798783, 27.9680212920227);


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (1, 'Склад 1', 1, 'Брусничная 12', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (3, 'Склад 3', 1, 'Иванова 44', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (8, 'Склад CV4', 3, 'Портовая 17', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (9, 'Склад CV11', 3, 'Красноармейская 91', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (7, 'Склад 12', 2, 'Демидова 10', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (4, 'Склад 17', 1, 'Држный берег 7', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (10, 'Склад 12', 1, 'Адрес', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (12, 'Склад 12', 1, 'Адрес', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (2, 'Склад 2', 1, 'Солнечный берег 19', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (5, 'Склд 10', 1, 'Кольная 3', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (6, 'Склад 16', 1, 'Шаманова 17', true, NULL, NULL);
INSERT INTO public.stock (id, name, company_id, address, active, lan, lng) VALUES (11, 'Складское помещение', 1, 'Белого В.А.', true, NULL, NULL);


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (29, 'user2', 'user2@', '$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu', 'ROLE_ADMIN', 1, '1983-06-17', NULL, 'surname', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (30, 'user3', 'user3@', '$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu', 'ROLE_DISPATCHER', 1, '1983-06-11', NULL, 'surname', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (33, 'user6', 'user6@', '$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu', 'ROLE_DRIVER', 1, '1987-01-10', NULL, 'surname', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (34, 'user7', 'user7@', '$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu', 'ROLE_DRIVER', 1, '1987-01-16', NULL, 'surname', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (35, 'user8', 'user8@', '$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu', 'ROLE_COMP_OWNER', 2, '1981-07-10', NULL, 'surname', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (36, 'user9', 'user9@', '$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu', 'ROLE_ADMIN,', 2, '1987-01-22', NULL, 'surname', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (1, 'sysamin', 'sysamin', '$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu', 'ROLE_SYS_ADMIN', NULL, '1987-05-07', NULL, 'surname', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (37, 'user10', 'user10@', '$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu', 'ROLE_COMP_OWNER', 3, '1983-07-16', NULL, 'surname', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (32, 'driverUser', 'driverUser@mail.ru', '$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu', 'ROLE_DRIVER', 1, '1985-03-02', NULL, 'surname', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (28, 'user1', 'user1@', '$2a$10$7UG3DYWF7T/1XCd.xAxRv.lhECiZdLxKxGv1Xnm45U4d8b2cDacda', 'ROLE_COMP_OWNER', 1, '1983-05-12', '', 'surname', '', 'Minsk', 'Belarus', 'Kolasa', '29', '1', NULL);
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (31, 'user4', 'user4@', '$2a$10$ZVUK0t/h9Fqsq0DtZYnNZuFr31YCQMEzaeqD9nspW6NhazKOHVvH2', 'ROLE_MANAGER', 1, '1985-09-01', 'managerName', 'surname', '', '', 'Беларусь', '', '', '', NULL);


--
-- Data for Name: waybill; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.waybill (id, status, driver, auto, date_departure, date_arrival, check_date, user_id) VALUES (33, 1, 2, 19, '2018-11-05', '2018-11-09', '2018-11-06', 31);
INSERT INTO public.waybill (id, status, driver, auto, date_departure, date_arrival, check_date, user_id) VALUES (34, 3, 2, 19, '2018-11-07', '2018-11-20', NULL, NULL);


--
-- Name: auto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auto_id_seq', 27, true);


--
-- Name: cancellation_act_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cancellation_act_id_seq', 2, true);


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 9, true);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_id_seq', 3, true);


--
-- Name: consignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consignment_id_seq', 1, false);


--
-- Name: driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_id_seq', 9, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 10, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 1, false);


--
-- Name: route_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.route_list_id_seq', 43, true);


--
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_id_seq', 12, true);


--
-- Name: tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 40, true);


--
-- Name: waybill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waybill_id_seq', 8, true);


--
-- Name: auto auto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auto
ADD CONSTRAINT auto_pkey PRIMARY KEY (id);


--
-- Name: cancellation_act cancellation_act_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cancellation_act
ADD CONSTRAINT cancellation_act_pkey PRIMARY KEY (id);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: consignment consignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consignment
ADD CONSTRAINT consignment_pkey PRIMARY KEY (id);


--
-- Name: driver driver_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver
ADD CONSTRAINT driver_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: route_list route_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route_list
ADD CONSTRAINT route_list_pkey PRIMARY KEY (id);


--
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
ADD CONSTRAINT stock_pkey PRIMARY KEY (id);


--
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: waybill waybill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waybill
ADD CONSTRAINT waybill_pkey PRIMARY KEY (id);


--
-- Name: auto auto_company_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auto
ADD CONSTRAINT auto_company_owner_fkey FOREIGN KEY (company_owner) REFERENCES public.company(id) ON DELETE CASCADE;


--
-- Name: cancellation_act cancellation_act_consignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cancellation_act
ADD CONSTRAINT cancellation_act_consignment_id_fkey FOREIGN KEY (consignment_id) REFERENCES public.consignment(id);


--
-- Name: client client_client_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
ADD CONSTRAINT client_client_owner_fkey FOREIGN KEY (client_owner) REFERENCES public.company(id);


--
-- Name: consignment consignment_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consignment
ADD CONSTRAINT consignment_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: driver driver_company_of_driver_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver
ADD CONSTRAINT driver_company_of_driver_fkey FOREIGN KEY (company_of_driver) REFERENCES public.company(id);


--
-- Name: orders orders_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: orders orders_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id);


--
-- Name: orders orders_receiver_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_receiver_fkey FOREIGN KEY (receiver) REFERENCES public.stock(id);


--
-- Name: orders orders_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_sender_fkey FOREIGN KEY (sender) REFERENCES public.stock(id);


--
-- Name: orders orders_waybill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_waybill_id_fkey FOREIGN KEY (waybill_id) REFERENCES public.waybill(id);


--
-- Name: product product_cancellation_act_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
ADD CONSTRAINT product_cancellation_act_fkey FOREIGN KEY (cancellation_act) REFERENCES public.cancellation_act(id);


--
-- Name: product product_product_consignment_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
ADD CONSTRAINT product_product_consignment_fkey FOREIGN KEY (product_consignment) REFERENCES public.consignment(id);


--
-- Name: route_list route_list_waybill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route_list
ADD CONSTRAINT route_list_waybill_id_fkey FOREIGN KEY (waybill_id) REFERENCES public.waybill(id);


--
-- Name: stock stock_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
ADD CONSTRAINT stock_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id);


--
-- Name: company sysadmin_id_ref; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
ADD CONSTRAINT sysadmin_id_ref FOREIGN KEY (locker_id) REFERENCES public.users(id);


--
-- Name: waybill user_checker_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waybill
ADD CONSTRAINT user_checker_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_company_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
ADD CONSTRAINT users_company_fkey FOREIGN KEY (company) REFERENCES public.company(id);


--
-- Name: waybill waybill_auto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waybill
ADD CONSTRAINT waybill_auto_fkey FOREIGN KEY (auto) REFERENCES public.auto(id);


--
-- Name: waybill waybill_driver_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waybill
ADD CONSTRAINT waybill_driver_fkey FOREIGN KEY (driver) REFERENCES public.driver(id);


--
-- PostgreSQL database dump complete
--
