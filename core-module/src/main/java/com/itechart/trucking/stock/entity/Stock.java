package com.itechart.trucking.stock.entity;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.entity.Order;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String address;
    private String name;
    private Boolean active;
    private Double lng;
    private Double lat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "sender")
    private List<Order> stockSenderOrders;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "receiver")
    private List<Order> stockReceiverOrders;

    public Stock() {
    }
    public Stock(String address, String name, Company company) {
        this.address = address;
        this.name = name;
        this.company = company;
    }

    public Stock(String address, String name, Double lng, Double lat, Company company) {
        this.address = address;
        this.name = name;
        this.lng = lng;
        this.lat = lat;
        this.company = company;
    }

    @Override
    public String toString() {
        return "Stock{" +
                "id=" + id +
                ", address='" + address + '\'' +
                ", name='" + name + '\'' +
                ", active=" + active +
                '}';
    }
}
