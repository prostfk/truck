INSERT INTO public.consignment (id, name, order_id) VALUES (12, 'consignment #2', 5);
INSERT INTO public.cancellation_act (id, date, amount, price, consignment_id) values(1, '2018-11-03', 0, 0, 12);

INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price) values(17,  'product #5', 'CHECK_DONE', 'desc', 2, 1, 123);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price) values(18,  'product #6', 'DELIVERED','desc', 2, 1, 123);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price) values(19, 'product #7', 'CHECK_DONE', 'desc', 2, 1, 123);
INSERT INTO public.product (id, name, status, description, product_consignment, cancellation_act, price) values(20, 'product #8', 'CHECK_DONE', 'desc', 2, 1, 123);
