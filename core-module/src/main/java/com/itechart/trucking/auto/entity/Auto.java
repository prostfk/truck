package com.itechart.trucking.auto.entity;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_owner", nullable = false)
    private Company company; /*old name companyOwner*/

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "auto")
    private List<Waybill> waybills;
}
