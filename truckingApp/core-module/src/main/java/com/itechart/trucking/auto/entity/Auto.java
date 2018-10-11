package com.itechart.trucking.auto.entity;

import com.itechart.trucking.company.entity.Company;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
    private Company companyOwner;


}
