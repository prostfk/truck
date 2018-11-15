package com.itechart.trucking.user.entity;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min = 5, max = 20)
    private String username;
    @Size(min = 5, max = 100)
    private String password;
    @Size(min = 3, max = 50)
    private String email;
    @Enumerated(EnumType.STRING)
    private UserRole userRole;
    private Date birthDay;
    private String firstName;
    private String secondName;
    private String thirdName;
    private String country;
    private String city;
    private String street;
    private String houseNumber;
    private String flatNumber;
    private Timestamp reg_date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", nullable = false)
    private Company company;

    public User() {
    }
    public User(@Size(min = 3, max = 50) String email, @Size(min = 5, max = 100) String password) {
        this.password = password;
        this.email = email;
    }
    public User(@Size(min = 5, max = 20) String username, @Size(min = 5, max = 100) String password, @Size(min = 3, max = 50) String email, UserRole userRole, Company company, Date date) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.userRole = userRole;
        /*this.company = company;*/
        this.birthDay = date;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", userRole=" + userRole +
                ", birthDay=" + birthDay +
                '}';
    }
}
