package com.itechart.trucking.driver.repository;

import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.user.entity.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DriverRepository extends CrudRepository<Driver, Long> {
    Driver findDriverByUser(User user);

    Driver findDriverById(Long id);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO driver(name, passport_number, company_of_driver, userid) VALUES (:driverName,:passportNumber,:companyId, :userId)", nativeQuery = true)
    void saveDriver(@Param("driverName")String driverName, @Param("passportNumber") String passportNumber, @Param("companyId")Long companyId, @Param("userId")Long userId);
}
