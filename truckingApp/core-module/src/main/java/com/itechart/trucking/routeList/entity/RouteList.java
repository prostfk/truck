package com.itechart.trucking.routeList.entity;

import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class RouteList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer point;
    private Integer pointLevel;
    @OneToOne
    @JoinColumn(name = "waybill_id")
    private Waybill waybill;

}

