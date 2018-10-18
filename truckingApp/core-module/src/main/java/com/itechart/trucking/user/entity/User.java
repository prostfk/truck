package com.itechart.trucking.user.entity;

import com.itechart.trucking.company.entity.Company;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Size;

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
    @OneToOne
    @JoinColumn(name = "company")
    private Company company;

    public User() {
    }

    public User(@Size(min = 3, max = 50) String email, @Size(min = 5, max = 100) String password) {
        this.password = password;
        this.email = email;
    }

    public User(@Size(min = 5, max = 20) String username, @Size(min = 5, max = 100) String password, @Size(min = 3, max = 50) String email, UserRole userRole, Company company) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.userRole = userRole;
        this.company = company;
    }
}
