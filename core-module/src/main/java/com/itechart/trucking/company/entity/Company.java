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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public Map getWorkersAmmount(){
        Map workersAmmount = new HashMap<String,Integer>();
        int ROLE_COMP_OWNER =0;
        int ROLE_ADMIN =0;
        int ROLE_DISPATCHER =0;
        int ROLE_MANAGER =0;
        int ROLE_DRIVER =0;
        for (User user:companyUsers) {
            switch (user.getUserRole()){
                case ROLE_COMP_OWNER:
                    ROLE_COMP_OWNER+=1;
                    break;
                case ROLE_ADMIN:
                    ROLE_ADMIN+=1;
                    break;
                case ROLE_DISPATCHER:
                    ROLE_DISPATCHER+=1;
                    break;
                case ROLE_MANAGER:
                    ROLE_MANAGER+=1;
                    break;
                case ROLE_DRIVER:
                    ROLE_DRIVER+=1;
                    break;
            }
        }
        workersAmmount.put("ROLE_COMP_OWNER",ROLE_COMP_OWNER);
        workersAmmount.put("ROLE_ADMIN",ROLE_ADMIN);
        workersAmmount.put("ROLE_DISPATCHER",ROLE_DISPATCHER);
        workersAmmount.put("ROLE_MANAGER",ROLE_MANAGER);
        workersAmmount.put("ROLE_DRIVER",ROLE_DRIVER);
        return workersAmmount;
    }


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
