package com.itechart.trucking.waybill.entity;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.user.entity.User;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.sql.Date;
import java.util.List;

@Entity
@Data
public class Waybill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Min(0)
    @Max(4)
    private Integer status;
    private Date dateDeparture;
    private Date dateArrival;
    private Date checkDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver", nullable = false)
    private Driver driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auto", nullable = false)
    private Auto auto;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "waybill")
    private List<RouteList> routeListList;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Waybill() {
    }

    public Waybill(@Min(0) @Max(4) Integer status, Driver driver, Auto auto, Date dateDeparture, Date dateArrival) {
        this.status = status;
        this.driver = driver;
        this.auto = auto;
        this.dateDeparture = dateDeparture;
        this.dateArrival = dateArrival;
    }

    @Override
    public String toString() {
        return "Waybill{" +
                "id=" + id +
                ", status='" + status + '\'' +
                ", dateDeparture=" + dateDeparture +
                ", dateArrival=" + dateArrival +
                '}';
    }
}
