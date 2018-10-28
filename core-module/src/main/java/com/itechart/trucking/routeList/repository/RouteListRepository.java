package com.itechart.trucking.routeList.repository;

import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.waybill.entity.Waybill;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteListRepository extends CrudRepository<RouteList, Long> {

    List<RouteList> findAllByWaybillOrderByPointLevel(Waybill waybill);
}
