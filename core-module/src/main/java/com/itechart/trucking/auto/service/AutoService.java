package com.itechart.trucking.auto.service;

import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.auto.repository.AutoRepository;
import com.itechart.trucking.auto.statistics.AutoStatisticsDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.user.entity.User;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

@Service
public class AutoService {

    @Autowired
    private AutoRepository autoRepository;

    public Auto save(@Valid Auto auto) {
        return autoRepository.save(auto);
    }

    public List<Auto> findAutosByCompany(Company company) {
        return autoRepository.findAllByCompanyAndActive(company, true);
    }

    public Page<Auto> findAllByCompanyAndActive(Company company, boolean b, PageRequest of) {
        return autoRepository.findAllByCompanyAndActive(company, b, of);
    }

    public Auto findAutoById(Long id) {
        return autoRepository.findAutoById(id);
    }

    public List<Auto> findAllByCompanyAndActive(Company company, Boolean active) {
        return autoRepository.findAllByCompanyAndActive(company, active);
    }

    public AutoDto saveAuto(@Valid AutoDto autoDto, User user) throws JSONException {
        if (autoDto == null) return null;
        Auto auto = new Auto();
        auto.setName(autoDto.getName());
        auto.setCarNumber(autoDto.getCarNumber());
        auto.setFuelConsumption(autoDto.getFuelConsumption());
        auto.setType(autoDto.getType());
        auto.setCompany(user.getCompany());
        auto.setActive(true);
        autoRepository.save(auto);
        AutoDto autoDto1 = new AutoDto(auto);
        return autoDto1;
    }

    public AutoDto processEditingAuto(@Valid AutoDto autoDto, User user) throws JSONException {
        Auto auto = autoRepository.findAutoById(autoDto.getId());
        if (auto.getCompany().getId() != user.getCompany().getId()) return null;
        auto.setName(autoDto.getName());
        auto.setCarNumber(autoDto.getCarNumber());
        auto.setType(autoDto.getType());
        auto.setFuelConsumption(autoDto.getFuelConsumption());
        autoRepository.save(auto);
        return new AutoDto(auto);
    }

    public List<AutoDto> processRemoveAuto(Long autoId, User user) throws JSONException {
        Auto auto = autoRepository.findAutoById(autoId);
        if (user.getCompany().getId() != auto.getCompany().getId()) return null;
        auto.setActive(false);
        autoRepository.save(auto);
        List<Auto> autos = autoRepository.findAllByCompanyAndActive(user.getCompany(), true);
        List<AutoDto> autoDtos = Odt.AutoListToDtoList(autos);
        return autoDtos;
    }

    public List<AutoStatisticsDto> getAutoStatistics() {
        return autoRepository.getAutoStatistics();
    }
}