package com.itechart.trucking.driver.entity;

import com.itechart.trucking.company.entity.Company;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String passportNumber;
    @OneToOne
    @JoinColumn(name = "company_of_driver")
    private Company companyOfDriver;



}
