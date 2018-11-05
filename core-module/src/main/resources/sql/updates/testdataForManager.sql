\connect truck

INSERT INTO public.orders (id, name, client_id, status, sender, receiver, date_accepted, date_executed, waybill_id, company_id) VALUES (11, 'Заказ #415', 1, 'ACTIVE', 3, 3, '1970-01-01', '2018-10-24', 1, 1);

INSERT INTO public.consignment (id, name, order_id) VALUES (1, 'consignment #1', 11);

INSERT INTO public.cancellation_act (id, date, amount, price, consignment_id) values(1, '2018-11-03', 0, 0, 1);

INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price) values(1,  'product #1', 'CHECK_DONE', 'desc', 1, 1, 123);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price) values(2,  'product #2', 'DELIVERED','desc', 1, 1, 123);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price) values(3, 'product #3', 'CHECK_DONE', 'desc', 1, 1, 123);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price) values(4, 'product #4', 'DELIVERED', 'desc', 1, 1, 123);
