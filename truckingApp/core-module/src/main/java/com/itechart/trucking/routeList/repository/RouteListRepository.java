package com.itechart.trucking.routeList.repository;

import com.itechart.trucking.routeList.entity.RouteList;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteListRepository extends CrudRepository<RouteList, Long> {



}
