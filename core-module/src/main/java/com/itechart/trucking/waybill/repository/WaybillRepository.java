package com.itechart.trucking.waybill.repository;

import com.itechart.trucking.waybill.entity.Waybill;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WaybillRepository extends CrudRepository<Waybill, Long> {

    Waybill findWaybillById(Long id);
/*    @Query("SELECT w FROM Waybill w WHERE Waybill.dateArrival=:date")
    Waybill findCustomQueryByDate(@Param("date") String date);*/

}
