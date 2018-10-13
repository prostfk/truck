package com.itechart.trucking.cancellationAct.entity;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.entity.Product;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class CancellationAct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String date;
    private Integer amount;
    private Integer price;
    @OneToOne
    @JoinColumn(name = "consignment_id")
    private Consignment consignment;

}
