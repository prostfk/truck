package com.itechart.trucking.auto.entity;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
@Data
public class Auto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min = 2, max = 14)
    private String type;
    @Min(1)
    @Max(199)
    private Integer fuelConsumption;
    @Size(min = 3, max = 45)
    private String name;
    @Size(min = 3, max = 45)
    private String carNumber;
    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_owner", nullable = false)
    private Company company; /*old name companyOwner*/

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "auto")
    private List<Waybill> waybills;
}
