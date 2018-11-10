package com.itechart.trucking.cancellationAct.entity;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.entity.Product;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Min;
import java.sql.Date;
import java.util.List;

@Entity
@Data
public class CancellationAct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date;
    @Min(0)
    private Integer amount;
    @Min(0)
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consignment_id")
    private Consignment consignment;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cancellationAct")
    private List<Product> product;

    public CancellationAct() {
    }

    public CancellationAct(Date date, @Min(0) Integer amount, @Min(0) Double price, Consignment consignment, List<Product> product) {
        this.date = date;
        this.amount = amount;
        this.price = price;
        this.consignment = consignment;
        this.product = product;
    }
}
