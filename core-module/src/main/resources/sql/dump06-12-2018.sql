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
-- Name: company_locker_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_locker_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.company_locker_id_seq OWNER TO postgres;

--
-- Name: company_locker_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_locker_id_seq OWNED BY public.company.locker_id;


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
-- Name: consignment_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consignment_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.consignment_order_id_seq OWNER TO postgres;

--
-- Name: consignment_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consignment_order_id_seq OWNED BY public.consignment.order_id;


--
-- Name: driver; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver (
    id integer NOT NULL,
    name character varying(45) NOT NULL,
    passport_number character varying(45) NOT NULL,
    company_of_driver integer NOT NULL,
    userid integer NOT NULL
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
-- Name: driver_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.driver_userid_seq OWNER TO postgres;

--
-- Name: driver_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_userid_seq OWNED BY public.driver.userid;


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
-- Name: orders_client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_client_id_seq OWNER TO postgres;

--
-- Name: orders_client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_client_id_seq OWNED BY public.orders.client_id;


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
    count integer DEFAULT 0 NOT NULL,
    cancelled_count integer
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
    lng double precision,
    lat double precision
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- Name: stock_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_company_id_seq OWNER TO postgres;

--
-- Name: stock_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_company_id_seq OWNED BY public.stock.company_id;


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
-- Name: waybill_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.waybill_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.waybill_user_id_seq OWNER TO postgres;

--
-- Name: waybill_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waybill_user_id_seq OWNED BY public.waybill.user_id;


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
-- Name: company locker_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company ALTER COLUMN locker_id SET DEFAULT nextval('public.company_locker_id_seq'::regclass);


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

INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (1, 'Седан', 13, 'Mazda 123', 'asdas 321523', 2, true);
INSERT INTO public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) VALUES (2, 'Civic', 15, 'Honda 32', 'Mr 432543', 2, true);


--
-- Data for Name: cancellation_act; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cancellation_act (id, date, amount, price, consignment_id) VALUES (1, '2018-12-02', 0, 0, 1);
INSERT INTO public.cancellation_act (id, date, amount, price, consignment_id) VALUES (2, '2018-12-02', 18, 222, 2);


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.client (id, name, type, client_owner) VALUES (1, 'Евроопт Минск', 'default', 2);
INSERT INTO public.client (id, name, type, client_owner) VALUES (2, 'Евроопт Гродно', 'default', 2);
INSERT INTO public.client (id, name, type, client_owner) VALUES (3, 'Брусничка', 'default', 2);


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.company (id, name, active, lock_comment, locker_id, lock_date) VALUES (2, 'Comp1', 1, NULL, NULL, NULL);
INSERT INTO public.company (id, name, active, lock_comment, locker_id, lock_date) VALUES (3, 'Comp2', 1, NULL, 1, NULL);
INSERT INTO public.company (id, name, active, lock_comment, locker_id, lock_date) VALUES (4, 'Comp3', 1, NULL, 2, NULL);
INSERT INTO public.company (id, name, active, lock_comment, locker_id, lock_date) VALUES (5, 'Comp4', 1, NULL, 3, NULL);


--
-- Data for Name: consignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.consignment (id, name, order_id) VALUES (1, 'Sun Dec 02 00:33:29 MSK 2018', 1);
INSERT INTO public.consignment (id, name, order_id) VALUES (2, 'Sun Dec 02 16:43:10 MSK 2018', 2);


--
-- Data for Name: driver; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (1, 'Drever Deriea', 'Mp 4325352', 2, 6);
INSERT INTO public.driver (id, name, passport_number, company_of_driver, userid) VALUES (2, 'Valera Drievd', 'MP 42646454', 2, 7);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.orders (id, name, client_id, status, sender, receiver, date_accepted, date_executed, waybill_id, company_id) VALUES (2, 'SecondOrder', 3, 1, 2, 1, '2018-12-07', '2018-12-05', 3, 2);
INSERT INTO public.orders (id, name, client_id, status, sender, receiver, date_accepted, date_executed, waybill_id, company_id) VALUES (1, 'ПервыйЗаказ', 2, 1, 2, 1, '2018-12-05', '2018-12-04', 2, 2);


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count, cancelled_count) VALUES (1, 'МОлоко', 1, 'Молочное', 1, 1, 1, 194, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count, cancelled_count) VALUES (2, 'Сливки', 1, '3.6', 1, 1, 2, 100, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count, cancelled_count) VALUES (4, 'Чай', 1, 'Черный', 2, 2, 11, 132, 0);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price, count, cancelled_count) VALUES (3, 'Кофе', 1, '500г', 2, 2, 15, 194, 0);


--
-- Data for Name: route_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (11, 'Minsk', 2, 3, NULL, 53.928853752649, 27.5075301032349);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (9, 'Завершение', NULL, 3, NULL, 53.9017861, 27.5503582);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (2, 'Завершение', NULL, 2, NULL, 53.9017861, 27.5503582);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (8, 'Отправление', 1, 3, true, 53.9231175, 27.4292096);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (10, 'Minsk', 1, 3, false, 53.9270615274077, 27.4706073797331);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (14, 'Minsk', 1, 2, false, 53.9227321067507, 27.4668141703888);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (15, 'Minsk', 2, 2, false, 53.918505183365, 27.5122367975457);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (17, 'Minsk', 3, 2, false, 53.9124704929198, 27.5334187846466);
INSERT INTO public.route_list (id, point, point_level, waybill_id, marked, lat, lng) VALUES (1, 'Отправление', 1, 2, true, 53.9231175, 27.4292096);


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (1, 'Революционная 14', 2, 'Революционная 15', true, 27.5503582000000051, 53.9017861000000025);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (2, 'Неманская 56', 2, 'Неманская 56', true, 27.4292096000000356, 53.9231174999999965);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (3, 'Мясникова 25', 2, 'Мясникова 25', true, 27.5452289999999991, 53.8987440000000007);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (4, 'Куйбышева 19', 2, 'Куйбышева 19', true, 27.5643199999999986, 53.9109499999999997);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (5, 'Красная 5', 2, 'Красная 5', true, 27.5700399999999988, 53.9117299999999986);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (6, 'Киселёва 10', 3, 'Киселёва 10', true, 27.5718700000000005, 53.9113100000000003);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (7, 'Червякова 9', 3, 'Червякова 9', true, 27.5355699999999999, 53.9381699999999995);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (8, 'Курчатова 8', 3, 'Курчатова 8', true, 27.4714600000000004, 53.8385800000000003);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (9, 'Чечота 6', 3, 'Чечота 6', true, 27.47851, 53.8475400000000022);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (10, 'Калинина 20', 3, 'Калинина 20', true, 27.6048100000000005, 53.9281500000000023);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (11, 'Логойский Тракт 5', 4, 'Логойский Тракт 5', true, 27.6068500000000014, 53.9411800000000028);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (12, 'Богдановича 78', 4, 'Богдановича 78', true, 27.5743900000000011, 53.9281500000000023);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (13, 'Орловская 4', 4, 'Орловская 4', true, 27.5363800000000012, 53.931519999999999);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (14, 'Мирошниченко 16 К2', 4, 'Мирошниченко 16 К2', true, 27.6195400000000006, 53.9602900000000005);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (15, 'Седых 58', 5, 'Седых 58', true, 27.6374299999999984, 53.9479200000000034);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (16, 'Славинского 27', 5, 'Славинского 27', true, 27.6361500000000007, 53.9381100000000018);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (17, 'Парниковая 11', 5, 'Парниковая 11', true, 27.6332500000000003, 53.9206399999999988);
INSERT INTO public.stock (id, name, company_id, address, active, lng, lat) VALUES (18, 'Партизанский Проспект 21', 5, 'Партизанский Проспект 21', true, 27.5951500000000003, 53.8829100000000025);


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tokens (id, email, token_value) VALUES (2, 'prostfk@gmail.com', 'hF4MgvlSSEsRiMgBGmU7vaPQBrCXV1ivCQFkYINt');
INSERT INTO public.tokens (id, email, token_value) VALUES (3, 'prostrmk@gmail.com', 'pytLUKYd8VEJ8YBUsLmAhbjRw4w7FNuQes1SFU34');
INSERT INTO public.tokens (id, email, token_value) VALUES (4, 'asd@ewq.qw', 'q9vgXgfarqQwWJ6vyz4K3SIO4XUEHLVYMN7dHje4');
INSERT INTO public.tokens (id, email, token_value) VALUES (5, 'proasasdjdf123332@ewqeqwe.asdwe2', '6RsxQVBisvtl3ngi1KO7l7XNWHQIEDX0blPJFuku');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (1, 'sysadmin', 'aswe@mai.we', '$2a$10$IbXArv6oqz14IQwqJl6gluvhVzAR6PoDhSMxTZ/QXhw7e8n0qQ0xG', 'ROLE_SYS_ADMIN', NULL, '2018-11-05', 'Rasda', 'asdasd', 'sada', 'asd', 'asd', 'asd', '23', '23', '2018-10-01 21:08:27.05');
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (2, 'owner1', 'prostrmk@gmail.com', '$2a$10$FLvbsyczPqoP6QqSisEiHuiHoBK1R17g4d0yn4eW5DB8HvdVAV3c6', 'ROLE_COMP_OWNER', 2, '1992-02-11', 'Roman', 'Medvedev', '', '', '', '', '', NULL, '2018-12-01 21:13:26.543989');
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (3, 'admin1', 'asmde@asd.ew', '$2a$10$NG/SeUKaya2cdlHGR2CTjex2eMlg1dCAEvEgNn3sMx/8fZ5KAYV4y', 'ROLE_ADMIN', 2, '1993-01-11', 'admen', 'Adminer', '', '', '', '', '', '', '2018-12-01 21:14:14.57178');
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (4, 'dispatcher1', 'despasd@male.we', '$2a$10$OHJWV0ztar2hMmNkY8B5EONIRAMmzgFaiONPWYlq937IcHUsHyX7C', 'ROLE_DISPATCHER', 2, '1992-01-09', 'erer', 'Dispatch', '', '', '', '', '', '', '2018-12-01 21:15:48.593342');
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (5, 'manager1', 'man@ew.qw', '$2a$10$P.0BSLiuYaZRH9VNd8PKguWV9jb0/VCooOYuYHjv4mmCZNIQKLq3i', 'ROLE_MANAGER', 2, '1994-02-05', 'Man', 'Manage', '', '', '', '', '', '', '2018-12-01 21:16:23.545894');
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (6, 'driver1', 'deriasf@reqw.we', '$2a$10$5v00CCfDIpw.hgJhxWswz.sPjRRMGovGNeDHZrDu9ChDsjY.2pGdG', 'ROLE_DRIVER', 2, '1984-12-09', 'Drever', 'Deriea', '', '', '', '', '', '', '2018-12-01 21:17:30.202391');
INSERT INTO public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) VALUES (7, 'driver1second', 'valeraDriver@mail.ru', '$2a$10$3GY.QONqw1gQlhzaDYfBBOHH0d8Hx3ZHGDEL7ExrbsHfFs3MhiPz2', 'ROLE_DRIVER', 2, '1994-03-08', 'Valera', 'Drievd', '', '', '', '', '', '', '2018-12-02 13:39:55.504814');


--
-- Data for Name: waybill; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.waybill (id, status, driver, auto, date_departure, date_arrival, check_date, user_id) VALUES (2, 2, 1, 1, '2018-12-05', '2018-12-04', '2018-12-02', 5);
INSERT INTO public.waybill (id, status, driver, auto, date_departure, date_arrival, check_date, user_id) VALUES (3, 1, 2, 2, '2018-12-07', '2018-12-05', NULL, NULL);


--
-- Name: auto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auto_id_seq', 2, true);


--
-- Name: cancellation_act_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cancellation_act_id_seq', 2, true);


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 3, true);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_id_seq', 6, true);


--
-- Name: company_locker_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_locker_id_seq', 4, true);


--
-- Name: consignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consignment_id_seq', 2, true);


--
-- Name: consignment_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consignment_order_id_seq', 1, false);


--
-- Name: driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_id_seq', 2, true);


--
-- Name: driver_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_userid_seq', 1, false);


--
-- Name: orders_client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_client_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 2, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 4, true);


--
-- Name: route_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.route_list_id_seq', 17, true);


--
-- Name: stock_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_company_id_seq', 1, false);


--
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_id_seq', 18, true);


--
-- Name: tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: waybill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waybill_id_seq', 3, true);


--
-- Name: waybill_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waybill_user_id_seq', 1, false);


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
-- Name: driver driver_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver
    ADD CONSTRAINT driver_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


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

