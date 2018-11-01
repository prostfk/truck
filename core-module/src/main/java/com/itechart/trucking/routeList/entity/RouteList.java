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
    private String point;
    private Integer pointLevel;
    private Boolean marked;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waybill_id")
    private Waybill waybill;

}

