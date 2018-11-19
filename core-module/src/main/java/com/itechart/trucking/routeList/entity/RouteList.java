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
    private Double lat;
    private Double lng;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waybill_id")
    private Waybill waybill;

    public RouteList() {
    }

    public RouteList(String point, Integer pointLevel, Boolean marked) {
        this.point = point;
        this.pointLevel = pointLevel;
        this.marked = marked;
    }

    public RouteList(String point, Integer pointLevel, Boolean marked, Waybill waybill) {
        this.point = point;
        this.pointLevel = pointLevel;
        this.marked = marked;
        this.waybill = waybill;
    }
}

