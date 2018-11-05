package com.itechart.trucking.formData;

import lombok.Data;

import java.time.LocalDate;


@Data
public class WaybillFormData {

    private Long id;
    private String status;
    private LocalDate dateDeparture;
    private LocalDate dateArrival;
    private Long driverId;
    private Long autoId;
    private String routeList;

    public WaybillFormData() {
    }

    public WaybillFormData(Long id, String status, LocalDate dateDeparture, LocalDate dateArrival, Long driverId, Long autoId, String routeList) {
        this.id = id;
        this.status = status;
        this.dateDeparture = dateDeparture;
        this.dateArrival = dateArrival;
        this.driverId = driverId;
        this.autoId = autoId;
        this.routeList = routeList;
    }
}
