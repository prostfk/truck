package com.itechart.trucking.auto.entity;

import com.itechart.trucking.company.entity.Company;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Auto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private Integer fuelConsumption;
    private String name;
    private String carNumber;
    @OneToOne
    @JoinColumn(name = "company_owner")
    private Company companyOwner;


}
