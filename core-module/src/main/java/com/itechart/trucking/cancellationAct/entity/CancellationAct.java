package com.itechart.trucking.cancellationAct.entity;

import com.itechart.trucking.product.entity.Product;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
public class CancellationAct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String date;
    private Integer ammount;
    private Integer price;
    private Product productRef;//JOIN

}
