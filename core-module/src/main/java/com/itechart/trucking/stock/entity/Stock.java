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
    private String address;
    private String name;
    @OneToOne
    @JoinColumn(name = "company_id")
    private Company company;
    private Boolean active;

    public Stock() {
    }

    public Stock(String address, String name, Company company) {
        this.address = address;
        this.name = name;
        this.company = company;
    }
}
