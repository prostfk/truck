package com.itechart.trucking.order.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.entity.Order;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
public class OrderDtoCalendar {
    private Long id;
    private String title;
    private String start;
    private String end;
/*    private LocalDate end;*/

    public OrderDtoCalendar(Order order) {
        this.id = order.getId();
        this.title = order.getName();
        this.start = order.getDateAccepted().toString();
        this.end = order.getDateExecuted().toString();
/*        this.end = Odt.convertToLocalDateViaInstant(order.getDateExecuted());*/
    }

    public OrderDtoCalendar() {

    }

    public static Map<String, Object> toMap(OrderDtoCalendar orderDtoCalendar){
        ObjectMapper oMapper = new ObjectMapper();
        Map<java.lang.String, java.lang.Object> map = oMapper.convertValue(orderDtoCalendar, Map.class);
        return map;
    }
}
