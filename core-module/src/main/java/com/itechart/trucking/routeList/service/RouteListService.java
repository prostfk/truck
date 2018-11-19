package com.itechart.trucking.routeList.service;

import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.routeList.repository.RouteListRepository;
import com.itechart.trucking.waybill.entity.Waybill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

@Service
public class RouteListService {

    @Autowired
    private RouteListRepository routeListRepository;

    public List<RouteList> findAllByWaybillOrderByPointLevel(Waybill waybill){
        return routeListRepository.findAllByWaybillOrderByPointLevel(waybill);
    }

    public RouteList save(@Valid RouteList routeList){
        return routeListRepository.save(routeList);
    }

    public RouteList update(@Valid RouteList routeList){
        return routeListRepository.save(routeList);
    }

    public void remove(RouteList routeList){
        routeListRepository.delete(routeList);
    }


}
