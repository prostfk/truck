package com.itechart.trucking.stock.entity;

import com.itechart.trucking.company.entity.Company;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    @OneToOne
    @JoinColumn(name = "company_id")
    private Company company;
}
