package com.itechart.trucking.order.dto;

import com.itechart.trucking.client.dto.ClientDto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.consignment.dto.ConsignmentDto;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import java.time.LocalDate;
import java.time.ZoneId;

@Data
public class OrderDto {
    private Long id;
    private String name;
    private String status;
    private LocalDate dateAccepted;
    private LocalDate dateExecuted;

    private WaybillDto waybill;
    private StockDto sender;
    private StockDto receiver;
    private CompanyDto company;
    private ClientDto client;
    private ConsignmentDto consignment;

    public OrderDto(Order order) {
        this.id = order.getId();
        this.name = order.getName();
        this.status = order.getStatus();
        this.sender = new StockDto(order.getSender());
        this.receiver = new StockDto(order.getReceiver());
        this.waybill = new WaybillDto(order.getWaybill());
        this.dateAccepted = Odt.convertToLocalDateViaInstant(order.getDateAccepted());
        this.dateExecuted = Odt.convertToLocalDateViaInstant(order.getDateExecuted());
    }

    public void setWaybill(Waybill waybill) {
        this.waybill = new WaybillDto(waybill);
    }

    public void setSender(Stock sender) {
        this.sender = new StockDto(sender);
    }

    public void setReceiver(Stock receiver) {
        this.receiver = new StockDto(receiver);
    }

    public void setCompany(Company company) {
        this.company = new CompanyDto(company);
    }

    public void setClient(Client client) {
        this.client = new ClientDto(client);
    }

    public void setConsignment(Consignment consignment) {
        this.consignment = new ConsignmentDto(consignment);
    }
}
