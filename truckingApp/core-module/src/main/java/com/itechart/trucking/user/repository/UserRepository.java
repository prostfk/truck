package com.itechart.trucking.user.repository;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    User findUserByEmail(String email);
    User findUserByUsername(String username);
    List<User> findUsersByUserRole(UserRole userRole);
    User findUserByUsernameOrEmail(String username, String email);


}
