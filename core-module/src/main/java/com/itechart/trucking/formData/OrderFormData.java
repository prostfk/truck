package com.itechart.trucking.formData;

import lombok.Data;

@Data
public class OrderFormData {

    private Long clientId;
    private String name;
    private String status;
    private Long departureStock;
    private Long deliveryStock;
    private String dateArrival;
    private String dateDeparture;
    private String waybillStatus;
    private Long autoId;
    private Long driverId;

    public OrderFormData(Long clientId, String name, String status, Long departureStock, Long deliveryStock, String dateArrival, String dateDeparture, String waybillStatus, Long autoId, Long driverId) {
        this.clientId = clientId;
        this.name = name;
        this.status = status;
        this.departureStock = departureStock;
        this.deliveryStock = deliveryStock;
        this.dateArrival = dateArrival;
        this.dateDeparture = dateDeparture;
        this.waybillStatus = waybillStatus;
        this.autoId = autoId;
        this.driverId = driverId;
    }



}
