package com.itechart.trucking.driver.entity;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String passportNumber;

    @OneToOne
    @JoinColumn(name = "userid")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_of_driver", nullable = false)
    private Company company; /*old name companyOfDriver*/

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "driver")
    private List<Waybill> waybills;

    @Override
    public String toString() {
        return "Driver{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", passportNumber='" + passportNumber + '\'' +
                '}';
    }
}
