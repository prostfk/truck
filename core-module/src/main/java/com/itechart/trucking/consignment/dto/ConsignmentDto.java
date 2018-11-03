package com.itechart.trucking.consignment.dto;

import com.itechart.trucking.cancellationAct.dto.CancellationActDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.product.dto.ProductDto;
import com.itechart.trucking.product.entity.Product;
import lombok.Data;

import java.util.List;

@Data
public class ConsignmentDto {

    private Long id;
    private String name;

    private OrderDto order;
    private List<ProductDto> productList;
    private List<CancellationActDto> cancellationActList;

    public ConsignmentDto(Consignment consignment) {
        this.id = consignment.getId();
        this.name = consignment.getName();
    }

    public void setOrder(Order order) {
        this.order = new OrderDto(order);
    }

    public void setProductList(List<Product> productList) {
        this.productList = Odt.ProductToDtoList(productList);
    }

    public void setCancellationActList(List<CancellationAct> cancellationActList) {
        this.cancellationActList = Odt.CancellationActToDtoList(cancellationActList);
    }
}
