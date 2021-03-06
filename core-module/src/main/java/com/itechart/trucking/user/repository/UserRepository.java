package com.itechart.trucking.user.repository;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.statistics.UserStatisticsDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    User findUserByEmail(String email);

    User findUserByUsername(String username);

    List<User> findUsersByUserRole(UserRole userRole);

    User findUserByUsernameOrEmail(String username, String email);

    User findUserByEmailAndCompany(String email, Company company);

    List<User> findUsersByCompany(Company company);

    Page<User> findAllByCompany(Company company, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO users(username, email, password, user_role, company, birth_day, first_name, second_name, third_name, country, city, street, house_number, flat_number, reg_date) VALUES (:username, :email, :userPassword, :userRole, :companyId, :birthDay, :firstName, :secondName," +
            ":thirdName, :country, :city, :street, :houseNumber, :flatNumber, :reg_date)", nativeQuery = true)
    void saveUser(@Param("username") String username, @Param("email") String email, @Param("userPassword") String userPassword, @Param("userRole") String userRole, @Param("companyId") Long companyId, @Param("birthDay") Date birthDay,
                  @Param("firstName") String firstName, @Param("secondName") String secondName, @Param("thirdName") String thirdName, @Param("country") String country,
                  @Param("city") String city, @Param("street") String street, @Param("houseNumber") String houseNumber, @Param("flatNumber") String flatNumber, @Param("reg_date") Timestamp reg_date);

    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET username=:username, email=:email, password=:userPassword, user_role=:userRole, birth_day=:birthDay, first_name=:firstName, second_name=:secondName," +
            "third_name=:thirdName, country=:country, city=:city, street=:street, house_number=:houseNumber, flat_number=:flatNumber WHERE id=:userId", nativeQuery = true)
    void updateUser(@Param("userId") Long userId, @Param("username") String username, @Param("email") String email, @Param("userPassword") String userPassword, @Param("userRole") String userRole, @Param("birthDay") Date birthDay,
                    @Param("firstName") String firstName, @Param("secondName") String secondName, @Param("thirdName") String thirdName, @Param("country") String country,
                    @Param("city") String city, @Param("street") String street, @Param("houseNumber") String houseNumber, @Param("flatNumber") String flatNumber);


    @Query(value = "SELECT * FROM users JOIN company c2 on users.company = c2.id WHERE CAST(birth_day AS text) LIKE :birthDay", nativeQuery = true)
    List<User> customFindUsersByBirthDay(@Param("birthDay") String birthDay);

    User findUserByIdAndUsername(Long id, String username);

    @Query(value = "SELECT * FROM users WHERE id=:userId AND company=:companyId", nativeQuery = true)
    User customFindUserByIdAndCompanyId(@Param("userId") Long userId, @Param("companyId") Long companyId);

    User findUserById(Long id);

    @Query(value = "SELECT new com.itechart.trucking.user.statistics.UserStatisticsDto(u.userRole,count(u)) from User u group by u.userRole")
    List<UserStatisticsDto> getTotalUserStatistics();


}