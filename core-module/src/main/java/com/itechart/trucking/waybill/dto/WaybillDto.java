package com.itechart.trucking.waybill.dto;

import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.driver.dto.DriverDto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Data
public class WaybillDto {
    private Long id;
    private Integer status;
    private LocalDate dateDeparture;
    private LocalDate dateArrival;

    private DriverDto driver;
    private AutoDto auto;
    private List<RouteListDto> routeListList;

    public WaybillDto(Waybill waybill) {
        this.id = waybill.getId();
        this.status = waybill.getStatus();
        this.dateDeparture = Instant.ofEpochMilli(waybill.getDateDeparture().getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        this.dateArrival =  Instant.ofEpochMilli(waybill.getDateArrival().getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }

    public void setDriver(Driver driver) {
        this.driver = new DriverDto(driver);
    }

    public void setAuto(Auto auto) {
        this.auto = new AutoDto(auto);
    }

    public void setRouteListList(List<RouteList> routeListList) {
        this.routeListList = Odt.RouteListToDtoList(routeListList);
    }
}
