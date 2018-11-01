package com.itechart.trucking.consignment.entity;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.product.entity.Product;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

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

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "consignment")
    private List<Product> productList;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "consignment")
    private List<CancellationAct> cancellationActList;

    public Consignment() {
    }
    public Consignment(String name, Order order) {
        this.name = name;
        this.order = order;
    }
}
