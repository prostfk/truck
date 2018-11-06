package com.itechart.trucking.product.repository;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.entity.ProductState;
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

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM product WHERE product_consignment=:consignmentId", nativeQuery = true)
    void deleteWhereConsignmentId(@Param("consignmentId") Long consignmentId);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO product(name, status, description, product_consignment,cancellation_act,  price) VALUES (:productName, :productStatus, :description,:consignmentId, :cancellationActId, :price)", nativeQuery = true)
    int saveProduct(@Param("productName") String name, @Param("productStatus") Integer status, @Param("description") String description, @Param("consignmentId") Long consignmentId,@Param("cancellationActId") Long cancellationActId, @Param("price") Double price);
}
