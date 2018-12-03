package com.itechart.trucking.driver.service;

import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public Driver findDriverByUser(User user) {
        return driverRepository.findDriverByUser(user);
    }

    public Driver findDriverById(Long id) {
        return driverRepository.findDriverById(id);
    }

    public void saveDriver(String driverName, String passportNumber, Long companyId, Long userId) {
        driverRepository.saveDriver(driverName, passportNumber, companyId, userId);
    }

    public Driver save(Driver driver) {
        return driverRepository.save(driver);
    }

    public Driver update(Driver driver) {
        if (driver.getId() != null) {
            return driverRepository.save(driver);
        }
        return driver;
    }


}
