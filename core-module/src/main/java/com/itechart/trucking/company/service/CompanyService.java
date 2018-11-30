package com.itechart.trucking.company.service;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.company.statistics.CompanyStatisticsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public Page<Company> findCompaniesByPage(String page){
        Integer pageId = Integer.parseInt(page);
        if(pageId==null) return null;
        return companyRepository.findAll(PageRequest.of(pageId-1, 5));
    }

    public Company findCompanyByName(String name) {
        return companyRepository.findCompanyByName(name);
    }

    public Company findCompanyById(Long id) {
        return companyRepository.findCompanyById(id);
    }

    public List<Company> findCompaniesByActive(int active) {
        return companyRepository.findCompaniesByActive(active);
    }

    public List<Company> findCompaniesByNameLikeIgnoreCase(String name) {
        return companyRepository.findCompaniesByNameLikeIgnoreCase(name);
    }

    public List<Company> findAllByOrderById() {
        return companyRepository.findAllByOrderById();
    }

    public List<Company> findTop10CompaniesByNameLikeIgnoreCase(String nameLike) {
        return companyRepository.findTop10CompaniesByNameLikeIgnoreCase(nameLike);
    }

    public List<Object[]> findStatsForXlsReport(Long companyId) {
        return companyRepository.findStatsForXlsReport(companyId);
    }

    public Company save(@Valid Company company){
        return companyRepository.save(company);
    }

    public Company update(@Valid Company company){
        return companyRepository.save(company);
    }

    public void remove(Company company){
        companyRepository.delete(company);
    }

    @Deprecated
    public List<Company> findAll() {
        return companyRepository.findAll();
    }


    public List<CompanyStatisticsDto> getCompanyStatistics() {
        return companyRepository.getCompanyStatistics();
    }
}
