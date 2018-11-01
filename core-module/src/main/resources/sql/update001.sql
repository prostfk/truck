\connect truck
ALTER TABLE ONLY public.waybill ADD COLUMN check_date date;
insert into consignment(id, name, order_id) values(2, 'consignment_name', 3);
insert into cancellation_act(id, date, amount, price, consignment_id) values(2, '2018-02-03', 0, 0, 2);
insert into product(id, name, status, description, price, product_consignment, cancellation_act) values(4, 'pr4', 'ACCEPTED', 'desc', 123, 2, 2);
insert into product(id, name, status, description, price, product_consignment, cancellation_act) values(5, 'pr5', 'CHECK_DONE', 'desc', 123, 2, 2);
insert into product(id, name, status, description, price, product_consignment, cancellation_act) values(6, 'pr6', 'CHECK_DONE', 'desc', 123, 2, 2);