package com.itechart.trucking.client.entity;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.entity.Order;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_owner", nullable = false)
    private Company company;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    private List<Order> clientOrders;

    public Client() {
    }
    public Client(String name, String type, Company company) {
        this.name = name;
        this.type = type;
        this.company = company;
    }

    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
