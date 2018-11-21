package com.itechart.trucking.client.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import lombok.Data;

import javax.validation.constraints.Size;
import java.util.List;
import java.util.Map;

@Data
public class ClientDto {
    private Long id;
    @Size(min = 3, max = 39)
    private String name;
    private String type;
    private CompanyDto company;
    private List<OrderDto> clientOrders;

    public ClientDto(Client client) {
        this.id = client.getId();
        this.name = client.getName();
        this.type = client.getType();
    }

    public void setCompany(Company company) {
        this.company = new CompanyDto(company);
    }

    public void setClientOrders(List<Order> clientOrders) {
        this.clientOrders = Odt.OrderToDtoList(clientOrders);
    }

    public static Map<String, Object> toMap(ClientDto clientDto){
        ObjectMapper oMapper = new ObjectMapper();
        Map<java.lang.String, java.lang.Object> map = oMapper.convertValue(clientDto, Map.class);
        return map;
    }
}
