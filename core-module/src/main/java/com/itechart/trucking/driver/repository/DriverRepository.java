package com.itechart.trucking.driver.repository;

import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.user.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface DriverRepository extends CrudRepository<Driver, Long> {
    Driver findDriverByUser(User user);
}
