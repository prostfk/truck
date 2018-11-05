package com.itechart.trucking.company.dto;

import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.client.dto.ClientDto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.driver.dto.DriverDto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CompanyDto {

    private Long id;
    private String name;
    private int active;
    private String lockComment;
    private LocalDate lockDate;
    private UserDto lockerId;

    private List<UserDto> companyUsers;
    private List<ClientDto> companyClients;
    private List<OrderDto> companyOrders;
    private List<StockDto> companyStocks;
    private List<DriverDto> companyDrivers;
    private List<AutoDto> companyAutos;

    public CompanyDto(Company company) {
        this.id = company.getId();
        this.name = company.getName();
        this.active = company.getActive();
        this.lockComment = company.getLockComment();
        this.lockDate = Odt.convertToLocalDateViaInstant(company.getLockDate());
    }

    public void setLockerId(User lockerId) {
        this.lockerId = new UserDto(lockerId);
    }

    public void setCompanyOrders(List<Order> companyOrders) {
        this.companyOrders = Odt.OrderToDtoList(companyOrders);
    }


    public void setCompanyUsers(List<User> companyUsers) {
        this.companyUsers = Odt.UserListToDtoList(companyUsers);
    }

    public void setCompanyClients(List<Client> companyClients) {
        this.companyClients = Odt.ClientListToDtoList(companyClients);
    }

    public void setCompanyStocks(List<Stock> companyStocks) {
        this.companyStocks = Odt.StockListToDtoList(companyStocks);
    }

    public void setCompanyDrivers(List<Driver> companyDrivers) {
        this.companyDrivers = Odt.DriverListToDtoList(companyDrivers);
    }

    public void setCompanyAutos(List<Auto> companyAutos) {
        this.companyAutos = Odt.AutoListToDtoList(companyAutos);
    }
}
