package com.itechart.trucking.consignment.entity;

import com.itechart.trucking.company.entity.Company;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Consignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @OneToOne
    @JoinColumn(name = "consignment_ref")
    private Company consignmentRef;

}
