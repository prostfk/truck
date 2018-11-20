package com.itechart.trucking.product.entity;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
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
    private Integer status;
    private String description;
    private Double price;
    private Integer count;
    private Integer cancelledCount;

    @ManyToOne
    @JoinColumn(name = "cancellation_act")
    private CancellationAct cancellationAct;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_consignment")
    private Consignment consignment;
}
