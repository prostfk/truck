package com.itechart.trucking.auto.service;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.auto.repository.AutoRepository;
import com.itechart.trucking.company.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

@Service
public class AutoService {

    @Autowired
    private AutoRepository autoRepository;

    public Auto save(@Valid Auto auto){
        return autoRepository.save(auto);
    }

    public List<Auto> findAutosByCompany(Company company){
        return autoRepository.findAllByCompanyAndActive(company,true);
    }

    public Page<Auto> findAllByCompanyAndActive(Company company, boolean b, PageRequest of) {
        return autoRepository.findAllByCompanyAndActive(company,b,of);
    }

    public Auto findAutoById(Long id) {
        return autoRepository.findAutoById(id);
    }

    public List<Auto> findAllByCompanyAndActive(Company company,Boolean active){
        return autoRepository.findAllByCompanyAndActive(company,active);
    }

}
