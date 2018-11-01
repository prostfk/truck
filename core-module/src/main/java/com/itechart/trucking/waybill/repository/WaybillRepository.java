package com.itechart.trucking.waybill.repository;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.waybill.entity.Waybill;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WaybillRepository extends CrudRepository<Waybill, Long> {

    Waybill findWaybillById(Long id);

    @Query("select d From Driver d where d.id not IN (select w.driver.id FROM Waybill w where (:dDep between w.dateDeparture and w.dateArrival) or (:dArr between w.dateDeparture and w.dateArrival) and w.driver.id = :companyId GROUP BY w.driver.id)")
    List<Driver> findCustomQueryDriverByDate(@Param("dDep") java.util.Date dDep,@Param("dArr") java.util.Date dArr,@Param("companyId") Long companyId);

    @Query("select a From Auto a where a.id not IN (select w.auto.id FROM Waybill w where (:dDep between w.dateDeparture and w.dateArrival) or (:dArr between w.dateDeparture and w.dateArrival) and w.auto.id = :companyId GROUP BY w.auto.id)")
    List<Auto> findCustomQueryAutoByDate(@Param("dDep") java.util.Date dDep, @Param("dArr") java.util.Date dArr, @Param("companyId") Long companyId);

}
