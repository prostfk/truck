package com.itechart.trucking.waybill.entity;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.routeList.entity.RouteList;
import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
@Data
public class Waybill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String status;
    private Date dateDeparture;
    private Date dateArrival;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver", nullable = false)
    private Driver driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auto", nullable = false)
    private Auto auto;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "waybill")
    private List<RouteList> routeListList;


    public Waybill() {
    }
    public Waybill(String status, Driver driver, Auto auto, Date dateDeparture, Date dateArrival) {
        this.status = status;
        this.driver = driver;
        this.auto = auto;
        this.dateDeparture = dateDeparture;
        this.dateArrival = dateArrival;
    }
}
