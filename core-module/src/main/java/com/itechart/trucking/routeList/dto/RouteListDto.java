package com.itechart.trucking.routeList.dto;

import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

@Data
public class RouteListDto {
    private Long id;
    private String point;
    private Integer pointLevel;
    private Boolean marked;
    private Double lat;
    private Double lng;

    private WaybillDto waybill;

    public RouteListDto(RouteList routeList) {
        this.id = routeList.getId();
        this.point = routeList.getPoint();
        this.pointLevel = routeList.getPointLevel();
        this.marked = routeList.getMarked();
        this.lat = routeList.getLat();
        this.lng = routeList.getLng();
    }

    public void setWaybill(Waybill waybill) {
        this.waybill = new WaybillDto(waybill);
    }
}
