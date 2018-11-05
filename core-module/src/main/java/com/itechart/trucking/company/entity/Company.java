package com.itechart.trucking.company.entity;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.user.entity.User;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.sql.Date;
import java.util.List;

@Entity
@Data
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min = 2, max = 100)
    private String name;
    @Min(0)
    @Max(1)
    private int active;
    private String lockComment;
    private Date lockDate;

    @OneToOne
    @JoinColumn(name = "locker_id")
    private User lockerId;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<User> companyUsers;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Client> companyClients;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Order> companyOrders;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Stock> companyStocks;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Driver> companyDrivers;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Auto> companyAutos;


    public Company() {
    }
    public Company(@Size(min = 2, max = 100) String name, @Min(0) @Max(1) int active) {
        this.name = name;
        this.active = active;
    }

    @Override
    public String toString() {
        return "Company{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", active=" + active +
                ", lockComment='" + lockComment + '\'' +
                ", lockDate=" + lockDate +
                '}';
    }
}
