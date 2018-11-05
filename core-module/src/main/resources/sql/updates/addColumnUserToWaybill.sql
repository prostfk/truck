\connect truck

ALTER TABLE ONLY public.waybill ADD COLUMN user_id integer;
ALTER TABLE ONLY public.waybill
  ADD CONSTRAINT user_checker_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);