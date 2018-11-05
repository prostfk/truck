package com.itechart.trucking.stock.dto;

import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.stock.entity.Stock;
import lombok.Data;

import java.util.List;


@Data
public class StockDto {
    private Long id;
    private String address;
    private String name;
    private Boolean active;

    private CompanyDto company;
    private List<OrderDto> stockSenderOrders;
    private List<OrderDto> stockReceiverOrders;

    public StockDto(Stock stock) {
        this.id = stock.getId();
        this.address = stock.getAddress();
        this.name = stock.getName();
        this.active = stock.getActive();
    }

    public StockDto(Long id, String name,String address) {
        this.id = id;
        this.address = address;
        this.name = name;
    }

    public StockDto() {
    }

    public void setCompany(Company company) {
        this.company = new CompanyDto(company);
    }

    public void setStockSenderOrders(List<Order> stockSenderOrders) {
        this.stockSenderOrders = Odt.OrderToDtoList(stockSenderOrders);
    }

    public void setStockReceiverOrders(List<Order> stockReceiverOrders) {
        this.stockReceiverOrders = Odt.OrderToDtoList(stockReceiverOrders);
    }
}
