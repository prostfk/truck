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

CREATE DATABASE truck WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Belarusian_Belarus.1251' LC_CTYPE = 'Belarusian_Belarus.1251';


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
    lat double precision,
    lng double precision
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
    address character varying(100) NOT NULL,
    active boolean DEFAULT true
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

COPY public.auto (id, type, fuel_consumption, name, car_number, company_owner, active) FROM stdin;
19	крытый кузов	20	Tata LPT 	9412 BY-3	1	t
20	крытый кузов	21	MAN TGX 18.400 	1421 BY-7	1	t
22	крытый кузов	25	MAN 18 18.224 	5812 BY-5	2	t
23	крытый кузов	31	Hyundai HD78 	1251 BY-5	2	t
24	цистерна	32	Hyundai Porter	8725 BY-4	2	t
25	цистерна	23	LIAZ 110 	7124 BY-2	3	t
26	крытый кузов	25	Scania 124 	4851 BY-2	3	t
27	Кртый кузов	24	Scania 124 	5991 BY-6	3	t
21	крытый кузов 1	25	MAN 18 18.224 	1245 BY-7	1	t
\.


--
-- Data for Name: cancellation_act; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cancellation_act (id, date, amount, price, consignment_id) FROM stdin;
33	2018-11-06	0	0	33
2	\N	0	0	34
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, name, type, client_owner) FROM stdin;
1	Евроопт Минск	deafult	1
2	Евроопт Гродно	deafult	1
3	Брусничка	deafult	1
4	IBSO	deafult	2
5	KolTo service	deafult	2
6	Ximik DK	deafult	2
7	SoperDay	deafult	3
8	Choks Pizza	deafult	3
9	Chole Pizza	deafult	3
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company (id, name, active, lock_comment, locker_id, lock_date) FROM stdin;
3	International Trucking	1		\N	\N
2	GoTrans	1	Блокировка за неуплату	\N	2018-10-27
1	Express Bus	1	asd	1	2018-10-30
\.


--
-- Data for Name: consignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consignment (id, name, order_id) FROM stdin;
34	consignment #34	34
33	consignment #34	33
1	Wed Nov 14 11:45:03 MSK 2018	11
2	Wed Nov 14 11:45:56 MSK 2018	12
3	Wed Nov 14 11:47:13 MSK 2018	13
4	Wed Nov 14 11:50:10 MSK 2018	14
\.


--
-- Data for Name: driver; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.driver (id, name, passport_number, company_of_driver, userid) FROM stdin;
4	Павел Конюшин	HB 65717294	2	\N
5	Дмитрий Гребешков	HB 42342112	2	\N
6	Григорий Солнцев	HB 02130294	2	\N
7	Мирон Корсаков	HB 24100492	3	\N
8	Павел Ковалев	HB 94918590	3	\N
9	Григорий коновалов	HB 10850953	3	\N
1	Павел Иванов	HB 72180123	1	32
3	Алексей Гребешков	HB 12342182	1	34
2	Дмитрий Петров 	HB 98220918	1	33
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, name, client_id, status, sender, receiver, date_accepted, date_executed, waybill_id, company_id) FROM stdin;
34	order #34	1	1	3	3	2018-11-05	2018-11-07	34	1
33	order #33	1	1	3	3	2018-11-07	2018-11-10	33	1
11	№1241	3	1	1	1	2018-11-13	2018-11-14	9	1
12	#122	7	1	4	4	2018-09-15	2018-09-17	10	1
13	#1321	8	1	1	1	2018-07-15	2018-07-18	11	1
14	№3432	2	1	3	3	2018-11-01	2018-11-03	12	1
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, status, description, product_consignment, cancellation_act, price, count) FROM stdin;
40	product #40	3	desc	33	\N	121	0
41	product #41	3	desc	33	\N	100	0
42	product #42	1	desc	33	\N	76	0
39	product #39	1	desc	33	\N	123	0
37	product #37	1	desc	34	\N	100	0
1	arduino	1	12	1	\N	11	13
2	arduino 2	1	12	1	\N	11	14
3	Ручки	1	Описание	2	\N	12	110
4	Коробки	1	24x24	3	\N	10	133
5	Палки	2	123	4	\N	12	12
36	product #36	3	desc	34	\N	121	0
38	product #38	2	desc	34	\N	76	0
6	product #40	2	desc	34	\N	76	12
8	product #44	2	desc	34	\N	123	33
7	product #41	1	desc	34	\N	11	1
35	product #35	1	desc	34	\N	123	0
\.


--
-- Data for Name: route_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.route_list (id, point, point_level, waybill_id, marked, lat, lng) FROM stdin;
35	Гродно	2	34	f	\N	\N
14	Гродно	2	33	\N	\N	\N
34	Минск	1	34	t	\N	\N
\.


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock (id, name, company_id, address, active) FROM stdin;
1	Склад 1	1	Брусничная 12	t
3	Склад 3	1	Иванова 44	t
8	Склад CV4	3	Портовая 17	t
9	Склад CV11	3	Красноармейская 91	t
7	Склад 12	2	Демидова 10	t
4	Склад 17	1	Држный берег 7	t
10	Склад 12	1	Адрес	t
12	Склад 12	1	Адрес	t
2	Склад 2	1	Солнечный берег 19	t
5	Склд 10	1	Кольная 3	t
6	Склад 16	1	Шаманова 17	t
11	Складское помещение	1	Белого В.А.	t
\.


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens (id, email, token_value) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, user_role, company, birth_day, first_name, second_name, third_name, city, country, street, house_number, flat_number, reg_date) FROM stdin;
30	user3	user3@	$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu	ROLE_DISPATCHER	1	1983-06-11	\N	surname	\N	\N	\N	\N	\N	\N	2018-11-14 16:53:38.520958
34	user7	user7@	$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu	ROLE_DRIVER	1	1987-01-16	\N	surname	\N	\N	\N	\N	\N	\N	2018-11-14 16:53:38.520958
35	user8	user8@	$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu	ROLE_COMP_OWNER	2	1981-07-10	\N	surname	\N	\N	\N	\N	\N	\N	2018-11-14 16:53:38.520958
29	user2	user2@	$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu	ROLE_ADMIN	1	1983-06-17	\N	surname	\N	\N	\N	\N	\N	\N	2018-11-14 16:53:38.520958
33	user6	user6@	$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu	ROLE_DRIVER	1	1987-01-10	\N	surname	\N	\N	\N	\N	\N	\N	2018-11-14 16:53:38.520958
38	nickname	gdsg@mail.ru	$2a$10$4Rzg7hoelmEz5Ye4oQ0s..HtVOYG.E7NFXD6ALg/SWQ2rzHyxEGdK	ROLE_MANAGER	1	1997-02-11	name	sname	fname	Ufa	Belarus	улица	дом	12	2018-11-14 16:53:38.520958
1	sysamin	sysamin	$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu	ROLE_SYS_ADMIN	\N	1987-05-07	\N	surname	\N	\N	\N	\N	\N	\N	2018-11-14 16:53:38.520958
36	user9	user9@	$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu	ROLE_ADMIN	2	1987-01-22	\N	surname	\N	\N	\N	\N	\N	\N	2018-11-14 16:53:38.520958
37	user10	user10@	$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu	ROLE_COMP_OWNER	3	1983-07-16	\N	surname	\N	\N	\N	\N	\N	\N	2018-11-14 16:53:38.520958
32	driverUser	driverUser@mail.ru	$2a$10$2cJzMqzRrp/Li0OajI.ELOUSkItyj68li1qzBpEaPfyHljxZs8oZu	ROLE_DRIVER	1	1985-03-02	\N	surname	\N	\N	\N	\N	\N	\N	2018-11-14 16:53:38.520958
28	user1	user1@	$2a$10$N3mldylSkzcMR1gzF90oSe9u17lsc40BfERyK/cKXY748XTfHMArO	ROLE_COMP_OWNER	1	1983-12-05	null	surname		Minsk	Belarus	Kolasa	29	1	2018-11-14 16:53:38.520958
31	user4	user4@	$2a$10$Bhf9EKzsDVGXfNgFAyf4t.MBhYPtthEbQQWfPT91VzLfOoHksuw2G	ROLE_MANAGER	1	1985-01-09	managerName	surname							2018-11-14 16:53:38.520958
\.


--
-- Data for Name: waybill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.waybill (id, status, driver, auto, date_departure, date_arrival, check_date, user_id) FROM stdin;
12	1	1	19	2018-07-15	2018-07-18	\N	\N
10	1	1	19	2018-10-26	2018-10-28	\N	\N
11	1	1	21	2018-09-15	2018-09-17	\N	\N
9	1	1	19	2018-11-17	2018-11-19	\N	\N
33	1	2	20	2018-11-20	2018-11-22	2018-11-06	31
34	1	2	20	2018-11-23	2018-11-25	\N	\N
\.


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

SELECT pg_catalog.setval('public.consignment_id_seq', 4, true);


--
-- Name: driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_id_seq', 9, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 14, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 8, true);


--
-- Name: route_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.route_list_id_seq', 15, true);


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

SELECT pg_catalog.setval('public.users_id_seq', 39, true);


--
-- Name: waybill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waybill_id_seq', 12, true);


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

