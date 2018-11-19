package com.itechart.trucking.waybill.repository;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.waybill.entity.Waybill;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WaybillRepository extends CrudRepository<Waybill, Long> {

    Waybill findWaybillById(Long id);

    @Query("select d From Driver d where d.id not IN " +
            "(select w.driver.id FROM Waybill w where " +
            "(:dDep between w.dateDeparture and w.dateArrival) " +
            "or (:dArr between w.dateDeparture and w.dateArrival)  GROUP BY w.driver.id " +
            ") " +
            "AND d.company.id=:companyId")
    List<Driver> findFreeDrivers(@Param("dDep") java.util.Date dDep,@Param("dArr") java.util.Date dArr,@Param("companyId") Long companyId);

    @Query("select a From Auto a where a.id not IN (select w.auto.id FROM Waybill w where (:dDep between w.dateDeparture and w.dateArrival) or (:dArr between w.dateDeparture and w.dateArrival) GROUP BY w.auto.id) AND a.company.id=:companyId")
    List<Auto> findFreeAutos(@Param("dDep") java.util.Date dDep, @Param("dArr") java.util.Date dArr, @Param("companyId") Long companyId);

    @Query("select d From Driver d where d.id not IN " +
            "(select w.driver.id FROM Waybill w where " +
            "((:dDep between w.dateDeparture and w.dateArrival) " +
            "or (:dArr between w.dateDeparture and w.dateArrival)   " +
            ") and w.id not in(:wayBillId) GROUP BY w.driver.id)" +
            "AND d.company.id=:companyId")
    List<Driver> findFreeDriversToChange(@Param("dDep") java.util.Date dDep,@Param("dArr") java.util.Date dArr,@Param("companyId") Long companyId,@Param("wayBillId") Long wayBillId);

    @Query("select a From Auto a where a.id not IN " +
            "(select w.auto.id FROM Waybill w where " +
            "((:dDep between w.dateDeparture and w.dateArrival) " +
            "or (:dArr between w.dateDeparture and w.dateArrival)" +
            ") and w.id not in(:wayBillId) GROUP BY w.auto.id) " +
            "AND a.company.id=:companyId")
    List<Auto> findFreeAutosToChange(@Param("dDep") java.util.Date dDep, @Param("dArr") java.util.Date dArr, @Param("companyId") Long companyId,@Param("wayBillId") Long wayBillId);

//    @Query(value = "SELECT * FROM driver WHERE id NOT IN (SELECT driver FROM waybill CROSS JOIN driver WHERE waybill.driver=driver.id AND :dDep BETWEEN date_departure and date_arrival OR :dArr BETWEEN date_arrival and date_departure AND driver.company_of_driver=:companyId) AND driver.company_of_driver=:companyId", nativeQuery = true)
//    List<Driver> findFreeDrivers(@Param("dDep") java.util.Date dDep,@Param("dArr") java.util.Date dArr,@Param("companyId") Long companyId);

    @Deprecated
    @Query("select d From Driver d where d.id not IN (select w.driver.id FROM Waybill w where (:dDep between w.dateDeparture and w.dateArrival) or (:dArr between w.dateDeparture and w.dateArrival) and w.driver.id = :companyId GROUP BY w.driver.id)")
    List<Driver> findCustomQueryDriverByDate(@Param("dDep") java.util.Date dDep,@Param("dArr") java.util.Date dArr,@Param("companyId") Long companyId);

    @Deprecated
    @Query("select a From Auto a where a.id not IN (select w.auto.id FROM Waybill w where (:dDep between w.dateDeparture and w.dateArrival) or (:dArr between w.dateDeparture and w.dateArrival) and w.auto.id = :companyId GROUP BY w.auto.id)")
    List<Auto> findCustomQueryAutoByDate(@Param("dDep") java.util.Date dDep, @Param("dArr") java.util.Date dArr, @Param("companyId") Long companyId);

    @Transactional
    @Modifying
    @Query(value = "UPDATE waybill set status=:waybillStatus, driver=:driverId, auto=:autoId,date_departure=:dateDeparture,date_arrival=:dateArrival WHERE id=:waybillId",nativeQuery = true)
    void updateWaybill(@Param("waybillId")Long waybillId,@Param("waybillStatus")Integer waybillStatus, @Param("driverId")Long driverId,@Param("autoId")Long autoId,@Param("dateDeparture")String dateDeparture,@Param("dateArrival")String dateArrival);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO waybill(status, driver, auto, date_departure, date_arrival) VALUES (:waybillStatus, :driverId, :autoId, :dateDeparture, :dateArrival)", nativeQuery = true)
    int saveWaybill(@Param("waybillStatus")Integer waybillStatus, @Param("driverId")Long driverId,@Param("autoId")Long autoId,@Param("dateDeparture")String dateDeparture,@Param("dateArrival")String dateArrival);

}