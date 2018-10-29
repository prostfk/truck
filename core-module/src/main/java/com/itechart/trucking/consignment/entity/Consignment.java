package com.itechart.trucking.consignment.entity;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.entity.Order;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Consignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    public Consignment() {
    }

    public Consignment(String name, Order order) {
        this.name = name;
        this.order = order;
    }
}
