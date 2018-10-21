package com.itechart.trucking.company.repository;

import com.itechart.trucking.company.entity.Company;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends CrudRepository<Company, Long> {

   Company findCompanyByName(String name);
   Company findCompanyById(Long id);
   List<Company> findCompaniesByActive(int active);
   List<Company> findCompaniesByNameLikeIgnoreCase(String name);//% %
   List<Company> findAllByOrderById();
}
