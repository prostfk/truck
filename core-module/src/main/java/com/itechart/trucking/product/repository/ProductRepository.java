package com.itechart.trucking.product.repository;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.entity.ProductState;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends CrudRepository<Product, Long> {

    Product findProductById(Long id);

    List<Product> findProductsByStatus(ProductState status);

    List<Product> findProductsByDescriptionLikeIgnoreCase(String description);

    List<Product> findAllByConsignment(Consignment consignment);

    @Query(value = "INSERT INTO product(name, status, description, product_consignment, cancellation_act, price) VALUES (:productName, :productStatus, :description,:consignmentId, :cancellationActId, :price)", nativeQuery = true)
    Product saveProduct(@Param("productName") String name, @Param("productStatus") String status, @Param("description") String description, @Param("consignmentId") Long consignmentId, @Param("cancellationActId") String cancellationActId, @Param("productStatus") Double price);
}
