package com.itechart.trucking.order.repository;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.order.entity.Order;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends CrudRepository<Order, Long> {
    List<Order> findAllByCompany(Company company);

/*    @Query("select o From Order o where o.waybill_id IN (select w.id FROM Waybill w where w.driver.id = :driverId) and o.status='Accepted'")
    List<Order> findCustomQueryOrderByDriver(@Param("driverId") Long driverId);*/


    @Query("select o From Order o where o.waybill IN (select w.id FROM Waybill w where w.driver.id = :driverId) and o.status='Accepted' ")
    List<Order> findCustomQueryOrderByDriver(@Param("driverId") Long driverId);

/*    @Query("select a From Auto a where a.id not IN (select w.auto.id FROM Waybill w where w.auto.id = :companyId GROUP BY w.auto.id)")
    List<Auto> findCustomQueryAutoByDate(@Param("companyId") Long companyId);*/
}
