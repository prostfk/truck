package com.itechart.trucking.company.entity;

import com.itechart.trucking.user.entity.User;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.sql.Date;

@Entity
@Data
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min = 2, max = 100)
    private String name;
    @Min(0)
    @Max(1)
    private int active;
    private String lockComment;

    @OneToOne
    @JoinColumn(name = "locker_id")
    private User lockerId;

    private Date lockDate;
    public Company() {
    }

    public Company(@Size(min = 2, max = 100) String name, @Min(0) @Max(1) int active) {
        this.name = name;
        this.active = active;
    }
}
