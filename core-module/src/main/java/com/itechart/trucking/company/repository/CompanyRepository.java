package com.itechart.trucking.company.repository;

import com.itechart.trucking.company.entity.Company;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends CrudRepository<Company, Long> {

   Company findCompanyByName(String name);
   Company findCompanyById(Long id);
   List<Company> findCompaniesByActive(int active);
   List<Company> findCompaniesByNameLikeIgnoreCase(String name);//% %
   List<Company> findAllByOrderById();
   List<Company> findAll();

   @Query(value = "SELECT driver.name as driverName, driver.passport_number, driver.company_of_driver as company,product.price, product.count FROM driver JOIN waybill on driver.id = waybill.driver JOIN orders on waybill.id = orders.waybill_id JOIN consignment on orders.id = consignment.order_id JOIN product on consignment.id = product.product_consignment WHERE company_of_driver=1 ORDER BY price DESC , count DESC", nativeQuery = true)
   List<Object[]> findStatsForXlsReport(@Param("companyId")Long companyId);
   List<Company> findTop10CompaniesByNameLikeIgnoreCase(String nameLike);

}
