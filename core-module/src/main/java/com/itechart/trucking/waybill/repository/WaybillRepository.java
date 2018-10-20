package com.itechart.trucking.waybill.repository;

import com.itechart.trucking.waybill.entity.Waybill;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaybillRepository extends CrudRepository<Waybill, Long> {

    Waybill findWaybillById(Long id);

}
