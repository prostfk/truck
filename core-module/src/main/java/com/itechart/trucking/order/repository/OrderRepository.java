package com.itechart.trucking.order.repository;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    Order findOrderById(Long id);

    Page<Order> findByCompany(Company company, Pageable pageable);

    @Query("select o From Order o where o.waybill IN (select w.id FROM Waybill w where w.driver.id = :driverId) and o.status = 1 ")
    List<Order> findCustomQueryOrderByDriver(@Param("driverId") Long driverId);

    @Query(value = "INSERT INTO orders(name, client_id, sender, receiver, date_accepted, date_executed, waybill_id, company_id) VALUES (:orderName,:clientId,:sender, :receiver, :dateDeparture, :dateArrival, :waybillId, :companyId)", nativeQuery = true)
    Order saveOrder(@Param("orderName") String orderName, @Param("clientId") Long clientId, @Param("sender") Long sender, @Param("receiver") Long receiver, @Param("dateDeparture") String dateDeparture, @Param("dateArrival") String dateArrival, @Param("waybillId")Long waybillId, @Param("companyId") Long companyId);

    @Query(value = "UPDATE orders SET name=:orderName, client_id=:clientId, sender=:sender, receiver=:receiver, date_accepted=:dateDeparture, date_executed=:dateArrival, waybill_id=:waybillId, company_id=:companyId WHERE id=:orderId", nativeQuery = true)
    Order updateOrder(@Param("orderId")Long orderId, @Param("orderName") String orderName,@Param("clientId") Long clientId, @Param("sender") Long sender,@Param("receiver") Long receiver, @Param("dateDeparture") String dateDeparture, @Param("dateArrival") String dateArrival,@Param("waybillId")Long waybillId,@Param("companyId") Long companyId);

/*    @Query(value = "select count(*) from orders where company_id=1 and date_accepted >= date_trunc('month', now()) - interval '6 month' and\n" +
            "                           date_accepted < date_trunc('month', now()) group by extract(month from date_accepted)", nativeQuery = true)
    List<Order> findCustomQueryOrderByDateAcceptedLastSixMont(String companyId);    */

    @Query(value = "select * from orders where company_id=:companyId and date_trunc('month',date_accepted) >= date_trunc('month', now()) - interval '6 month' and\n" +
            "                           date_trunc('month',date_accepted) <= date_trunc('month', now())", nativeQuery = true)
    List<Order> findCustomQueryOrderByDateAcceptedLastSixMont(@Param("companyId") Long companyId);

    @Query(value = "select * from orders where company_id=:companyId and date_trunc('month',date_executed) >= date_trunc('month', now()) - interval '6 month' and\n" +
            "                           date_trunc('month',date_executed) <= date_trunc('month', now())", nativeQuery = true)
    List<Order> findCustomQueryOrderByDateExecutedLastSixMont(@Param("companyId") Long companyId);


    List<Order> findAllByStatusAndCompanyId(Integer active, Long companyId);

    Page<Order> findAllByStatusAndCompanyId(Integer active, Long companyId,Pageable pageable);


/*    @Query("select a From Auto a where a.id not IN (select w.auto.id FROM Waybill w where w.auto.id = :companyId GROUP BY w.auto.id)")
    List<Auto> findCustomQueryAutoByDate(@Param("companyId") Long companyId);*/
    List<Order> findAllByStatus(Integer status);
}
