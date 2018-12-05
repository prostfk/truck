package com.itechart.trucking.product.repository;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.entity.ProductState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends CrudRepository<Product, Long> {

    Product findProductById(Long id);

    List<Product> findProductsByStatus(Integer status);

    List<Product> findProductsByDescriptionLikeIgnoreCase(String description);

    List<Product> findAllByConsignment(Consignment consignment);

    Page<Product> findAllByConsignment(Consignment consignment, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM product WHERE product_consignment=:consignmentId", nativeQuery = true)
    void deleteWhereConsignmentId(@Param("consignmentId") Long consignmentId);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO product(name, status, description, product_consignment, price, count) VALUES (:productName, :productStatus, :description,:consignmentId, :price, :productCount)", nativeQuery = true)
    int saveProduct(@Param("productName") String name, @Param("productStatus") Integer status, @Param("description") String description, @Param("consignmentId") Long consignmentId, @Param("price") Double price, @Param("productCount") Integer productCount);
}