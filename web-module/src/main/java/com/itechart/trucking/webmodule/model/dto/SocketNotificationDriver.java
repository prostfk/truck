package com.itechart.trucking.webmodule.model.dto;

import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import lombok.Data;

public class SocketNotificationDriver extends SocketNotification {
    private Long orderId;
    private Boolean orderAdd=true;
    private OrderDto order;

    public SocketNotificationDriver(String userName, String message) {
        super(userName, message);
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Boolean getOrderAdd() {
        return orderAdd;
    }

    public void setOrderAdd(Boolean orderAdd) {
        this.orderAdd = orderAdd;
    }

    public OrderDto getOrder() {
        return order;
    }

    public void setOrder(OrderDto order) {
        this.order = order;
    }
}
