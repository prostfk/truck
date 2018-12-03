package com.itechart.trucking.waybill.service;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.waybill.entity.Waybill;
import com.itechart.trucking.waybill.repository.WaybillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

@Service
public class WaybillService {

    @Autowired
    private WaybillRepository waybillRepository;

    public Waybill findWaybillById(Long id) {
        return waybillRepository.findWaybillById(id);
    }

    public List<Driver> findFreeDrivers(java.util.Date dDep, java.util.Date dArr, Long companyId) {
        return waybillRepository.findFreeDrivers(dDep, dArr, companyId);
    }

    public List<Auto> findFreeAutos(java.util.Date dDep, java.util.Date dArr, Long companyId) {
        return waybillRepository.findFreeAutos(dDep, dArr, companyId);
    }

    public List<Driver> findFreeDriversToChange(java.util.Date dDep, java.util.Date dArr, Long companyId, Long wayBillId) {
        return waybillRepository.findFreeDriversToChange(dDep, dArr, companyId, wayBillId);
    }

    public List<Auto> findFreeAutosToChange(java.util.Date dDep, java.util.Date dArr, Long companyId, Long wayBillId) {
        return waybillRepository.findFreeAutosToChange(dDep, dArr, companyId, wayBillId);
    }

    public List<Driver> findCustomQueryDriverByDate(java.util.Date dDep, java.util.Date dArr, Long companyId) {
        return waybillRepository.findCustomQueryDriverByDate(dDep, dArr, companyId);
    }

    public List<Auto> findCustomQueryAutoByDate(java.util.Date dDep, java.util.Date dArr, Long companyId) {
        return waybillRepository.findCustomQueryAutoByDate(dDep, dArr, companyId);
    }

    public void updateWaybill(Long waybillId, Integer waybillStatus, Long driverId, Long autoId, String dateDeparture, String dateArrival) {
        waybillRepository.updateWaybill(waybillId, waybillStatus, driverId, autoId, dateDeparture, dateArrival);
    }

    public int saveWaybill(Integer waybillStatus, Long driverId, Long autoId, String dateDeparture, String dateArrival) {
        return waybillRepository.saveWaybill(waybillStatus, driverId, autoId, dateDeparture, dateArrival);
    }

    public List<Waybill> findTop10WaybillsByUserId(Long userId) {
        return waybillRepository.findTop10WaybillsByUserId(userId);
    }

    public Waybill save(@Valid Waybill waybill) {
        return waybillRepository.save(waybill);
    }

    public Waybill update(@Valid Waybill waybill) {
        return waybillRepository.save(waybill);
    }

    public void remove(Waybill waybill) {
        waybillRepository.delete(waybill);
    }

}
