package com.itechart.trucking.waybill.entity;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.driver.entity.Driver;
import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Data
public class Waybill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private WaybillState status;
    @OneToOne
    @JoinColumn(name = "driver")
    private Driver driver;
    @OneToOne
    @JoinColumn(name = "auto")
    private Auto auto;
    private Date dateDeparture;
    private Date dateArrival;

}
