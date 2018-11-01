package com.itechart.trucking.waybill.entity;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.user.entity.User;
import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Data
public class Waybill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String status;
    @OneToOne
    @JoinColumn(name = "driver")
    private Driver driver;
    @OneToOne
    @JoinColumn(name = "auto")
    private Auto auto;
    private Date checkDate;
    private Date dateDeparture;
    private Date dateArrival;
    //private User userMarkerId;

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
