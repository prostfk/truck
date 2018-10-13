package com.itechart.trucking.product.entity;

import com.itechart.trucking.consignment.entity.Consignment;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    private ProductState status;
    private String description;
    @OneToOne
    @JoinColumn(name = "product_consignment")
    private Consignment consignment;

}
