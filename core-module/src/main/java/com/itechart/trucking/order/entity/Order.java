package com.itechart.trucking.order.entity;

import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
@Data
@Table(name = "orders")
public class Order {//enum

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @OneToOne
    @JoinColumn(name = "client_id")
    private Client client;
    private String status;
    @OneToOne
    @JoinColumn(name = "sender")
    private Stock sender;
    @OneToOne
    @JoinColumn(name = "receiver")
    private Stock receiver;
    private Date dateAccepted;
    private Date dateExecuted;
    @OneToOne
    @JoinColumn(name = "waybill_id")
    private Waybill waybill;
    @OneToOne
    @JoinColumn(name = "company_id")
    private Company company;

}
