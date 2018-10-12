package com.itechart.trucking.driver.repository;

import com.itechart.trucking.driver.entity.Driver;
import org.springframework.data.repository.CrudRepository;

public interface DriverRepository extends CrudRepository<Driver, Long> {
}
